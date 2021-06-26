import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import './css/mainScreen.css';
import { Cookies } from 'react-cookie';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export class MainScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phone: "",
            role: "",
            searchData: [],
            symbols: 0,
            isErrorDialogOpen: false,
            userData: [],
            isCreateDialogOpen: false,
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.cookies = new Cookies();
        this.passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{8,}/;
        this.emailReg = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;
    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }  

    userData = [];  
    getUserInfo(item) {  
        this.userData.push({ id: item.id, email: item.email, password: item.password, firstName: item.firstName, lastName: item.lastName, phone: item.phone });
       
        this.props.editUserScreenHandler(this.userData);
    }

    viewUserInfo(item) {
        this.state.userData.push({ id: item.id, email: item.email, password: item.password, firstName: item.firstName, lastName: item.lastName, phone: item.phone, roleId: item.role });
        //this.props.viewUserInfoScreenHandler(this.userData);
        this.setState({
            isErrorDialogOpen: true
        });
    }

    deAuth() {
        this.cookies.remove('userId');
        this.cookies.remove('userRole');
        this.props.deAuthHandler();
    }

    flag = false;
    getUsersList() {
        if (this.state.symbols === 0 && !this.flag) {
            return (
                <div>
                    {this.props.usersList.map((item) => {
                        return (
                            <Card className="mainScreen-block_card">
                                <CardContent key={item.id} className="mainScreen-block_card_cardcontent">
                                    <div className="mainScreen-block_card_cardcontent_userDiv">
                                    <Typography variant="h5" component="h2" noWrap>{item.firstName + ' ' + item.lastName}</Typography>
                                    {item.id === this.cookies.get('userId') ? (
                                        
                                           <AccountCircleIcon></AccountCircleIcon>
                                    ) : ""}</div>
                                    <Typography noWrap>{item.email}</Typography>
                                    <Typography noWrap>{item.phone}</Typography>
                                    
                                </CardContent>

                                <Button onClick={() => { this.getUserInfo(item) }}>
                                    edit
                             </Button>
                                <Button onClick={() => { this.viewUserInfo(item) }}>
                                    view
                                </Button>
                                {this.cookies.get('userRole') === "1" && item.role !== "1"? (
                                    <Button onClick={() => { this.deleteUser(item) }}>
                                        delete
                                    </Button>
                                ) : ""}
                                {this.cookies.get('userRole') === "2" && item.role !== "2" ? (
                                    < Button onClick={() => { this.deleteUser(item) }}>
                                        delete
                                    </Button>
                                ) : ""}
                            </Card>
                        )
                    })}</div>
            )
        }
        else if (this.flag && this.state.symbols >= 3) {
            return (
                <div>
                    {this.state.searchData.map((item) => {
                        return (
                            <Card className="mainScreen-block_card">
                                <CardContent key={item.id} className="mainScreen-block_card_cardcontent">
                                    <div className="mainScreen-block_card_cardcontent_userDiv">
                                        <Typography variant="h5" component="h2" noWrap>{item.firstName + ' ' + item.lastName}</Typography>
                                        {item.id === this.cookies.get('userId') ? (

                                            <AccountCircleIcon></AccountCircleIcon>
                                        ) : ""}</div>
                                    <Typography noWrap>{item.email}</Typography>
                                    <Typography noWrap>{item.phone}</Typography>
                                </CardContent>

                                <Button onClick={() => { this.getUserInfo(item) }}>
                                    edit
                                </Button>
                                <Button onClick={() => { this.viewUserInfo(item) }}>
                                    view
                                </Button>
                                {this.cookies.get('userRole') === "1" && item.role !== "1"? (
                                    <Button onClick={() => { this.deleteUser(item) }}>
                                        delete
                                    </Button>
                                ) : ""}
                                {this.cookies.get('userRole') === "2" && item.role !== "2" ? (
                                    < Button onClick={() => { this.deleteUser(item) }}>
                                        delete
                                    </Button>
                                    ):""}
                            </Card>
                        )
                })}</div>
            )
        }
    }

    deleteUser(item) {

        let params = {
            id: item.id
        }

        axios.post('https://localhost:5001/deleteUser', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res);
            this.updateUsersList();
        });
    }

    searchUser(e){
        const value = e.target.value.toLowerCase();
        
        if (value === "") {
            console.log("val", value);
            this.setState({ searchData: [], symbols: 0 });
            this.flag = false;
            
            this.getUsersList();
        }
        else {
            var count = this.state.symbols + 1;
            this.setState({ symbols: count });
            console.log(this.state.symbols)
            if (this.state.symbols >= 2) {
                this.flag = true;
                const filter = this.props.usersList.filter(user => {
                    return user.firstName.toLowerCase().includes(value) ||
                        user.lastName.toLowerCase().includes(value) ||
                        user.email.toLowerCase().includes(value);
                });

                this.setState({ searchData: filter });
                console.log("aa", filter)

                this.getUsersList();
            }
        }
    }

    getRoleName(role) {
        if (role === "1") return (<div>{"Role: Admin"}</div>)
        if (role === "2") return (<div>{"Role: Manager"}</div>)
        if (role === "3") return (<div>{"Role: Staff"}</div>)
    }

    handleClose() {
        console.log(this.props.usersList)
        this.setState({ isErrorDialogOpen: false })
        this.state.userData = []
    };

    handleCreateClose() {
        //console.log(this.props.usersList)
        this.setState({ isCreateDialogOpen: false })
        
    };

    openCreateUser() {
        this.setState({ isCreateDialogOpen: true });     
    }

    updateUsersList() {
        let params = {
            role: this.cookies.get('userRole')
        }

        axios.post('https://localhost:5001/usersList', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("usersList", res);
            /* this.setState({ usersList: res.data })*/
            this.props.setUserData(res.data);
        });
    }

    createUser() {

        let params = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
            role: this.state.role
        }

        let flag = false;
        this.props.usersList.map(item => {
            if (item.email === this.state.email) {
                alert("This email is already in use");
                flag = true
            }
        })

        if (!flag && this.state.email !== "" && this.state.password !== "" && this.state.firstName !== "" && this.state.lastName !== "" && this.state.phone !== "" && this.state.role !== "" ) {
           
            axios.post('https://localhost:5001/createUser', params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log(res);
                this.updateUsersList();
                this.handleCreateClose();
            });
            
        }
        
    }

    handleChangeRole = (e) => {
        this.setState({ role: e.target.value });
    }

    render() {
        return (
            <div className="mainScreen-block">
                
                <div className="mainScreen-block_searchInput"><TextField id="filled-search" label="Search user" type="search" variant="outlined" onChange={this.searchUser} />
                   
                </div>
                <Button onClick={() => { this.deAuth() }}>Exit</Button>
                {this.cookies.get('userId') === "1" ? (
                    <Button onClick={() => { this.openCreateUser() }}>Create User</Button>
                ):""}
                {this.getUsersList()}
                
                <Dialog open={this.state.isErrorDialogOpen} onClose={() => {
                    this.handleClose()
                }} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">User info</DialogTitle>
                    <DialogContent>
                        {this.state.userData.map(item => {
                            return (
                                <DialogContentText>
                                    <div>{"Email: " + item.email}</div>
                                    <div>{"Full Name " + item.firstName + " " + item.lastName}</div>
                                    <div>{"Phone: " + item.phone}</div>
                                    <div>{this.getRoleName(item.roleId)}</div>
                                </DialogContentText>)
                        }) }
                    </DialogContent>
                    <DialogActions>
                        <Button size="large" color="secondary" onClick={() => {
                            this.handleClose()
                        }}>
                            OK
                     </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.isCreateDialogOpen} onClose={() => {
                    this.handleCreateClose()
                }} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create user</DialogTitle>
                    <DialogContent>
                        <div className="form-dialog-content">
                            <div className="form-dialog-content_textField">
                                <TextField
                                    variant="outlined"
                                    label="Email"
                                    value={this.state.email}
                                    name="email"
                                    helperText={this.state.email !== "" && !this.emailReg.test(this.state.email) ? 'Not email format' : ''}
                                    onChange={this.onInputChange}></TextField>
                            </div>
                            <div className="form-dialog-content_textField">
                                <TextField
                                    variant="outlined"
                                    type="password"
                                    label="Password"
                                    value={this.state.password}
                                    name="password"
                                    helperText={this.state.password !== "" && !this.passwordReg.test(this.state.password) ? 'Incorrect password' : ''}
                                    onChange={this.onInputChange}></TextField>
                            </div>
                            <div className="form-dialog-content_textField">
                                <TextField
                                    variant="outlined"
                                    label="First Name"
                                    value={this.state.firstName}
                                    name="firstName"
                                    onChange={this.onInputChange}></TextField>
                            </div>
                            <div className="form-dialog-content_textField">
                                <TextField
                                    variant="outlined"
                                    label="Last Name"
                                    value={this.state.lastName}
                                    name="lastName"
                                    onChange={this.onInputChange}></TextField>
                            </div>
                            <div className="form-dialog-content_textField">
                                <TextField
                                    variant="outlined"
                                    label="Phone"
                                    value={this.state.phone}
                                    name="phone"
                                    onChange={this.onInputChange}></TextField>
                            </div>
                            <div className="form-dialog-content_textField">
                                <Select onChange={this.handleChangeRole}
                                    value={this.state.role}>
                                    <MenuItem value={'2'}>Manager</MenuItem>
                                    <MenuItem value={'3'}>Staff</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button size="large" color="secondary" onClick={() => {
                            this.createUser()
                        }}>
                            OK
                     </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}