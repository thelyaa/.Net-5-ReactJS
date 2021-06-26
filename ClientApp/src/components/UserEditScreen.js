import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './css/userEditScreen.css';
import CreateIcon from '@material-ui/icons/Create';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import './css/editPasswordScreen.css';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { Cookies } from 'react-cookie';

export class UserEditScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.userEditData.email,
            password: this.props.userEditData.password,
            firstName: this.props.userEditData.firstName,
            lastName: this.props.userEditData.lastName,
            phone: this.props.userEditData.phone,
            isErrorDialogOpen: false,
            showPassword: false
        };
        this.cookies = new Cookies();
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    editUserFunction = (e) => {
        //this.props.usersList.map(item => {
        //    if (this.props.userEditData.Email !== this.state.email && item.email === this.state.email) {
        //        alert("This email is already in use");
        //    }

        let params = {
            Id: this.props.userEditData.id,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone
        }
        //console.log(this.props.userEditData.id)
        axios.post('https://localhost:5001/editUser', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            //console.log(res);
            this.getUsers(this.props.userEditData.role);
            alert("Changes saved");
        });
    }

    getUsers(role) {
        let params = {
            role: role
        }

        axios.post('https://localhost:5001/usersList', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            //console.log("usersList", res);
            /* this.setState({ usersList: res.data })*/
            this.props.goToMainScreen(res.data);
        });
    }

    goToEditPassword() {
        this.setState({ isErrorDialogOpen: true })
        //this.props.goToEditPasswordHandler(this.props.userEditData);
    }

    handleClose() {
        this.setState({ isErrorDialogOpen: false })
    };

    updatePassword = (e) => {

        //console.log(this.state.password);
        let params = {
            Id: this.props.userEditData.id,
            password: this.state.password
        }

        axios.post('https://localhost:5001/updatePassword', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            //console.log(res);
            alert("Changes saved");
            //this.props.goToPreviousScreen();
            //this.updateUsersList();
            this.setState({ isErrorDialogOpen: false });
        });
    }

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    render() {
        return (
            <div className="userEditScreen-block">
                <div className="userEditScreen-block_form">
                    <TextField
                        defaultValue={this.props.userEditData.email}
                        label="Email"
                        onChange={this.onInputChange}
                        name="email"></TextField>

                    <div className="userEditScreen-block_form_passwordField">
                        <TextField
                            defaultValue={this.props.userEditData.password}
                            disabled label="Password"
                            name="password"
                            type="password"
                        ></TextField>
                        <Button onClick={() => this.goToEditPassword()}><CreateIcon /></Button>
                    </div>

                    <TextField
                        defaultValue={this.props.userEditData.firstName}
                        label="First Name"
                        onChange={this.onInputChange}
                        name="firstName"></TextField>
                    <TextField
                        defaultValue={this.props.userEditData.lastName}
                        label="Last Name"
                        onChange={this.onInputChange}
                        name="lastName"></TextField>
                    <TextField
                        defaultValue={this.props.userEditData.phone}
                        label="Phone"
                        onChange={this.onInputChange}
                        name="phone"></TextField>

                    <div className="userEditScreen-block_buttons">
                        <div><Button variant="contained" color="primary" onClick={() => { this.editUserFunction() }}>OK</Button></div>
                        <div><Button variant="contained" color="primary" onClick={this.props.cancelHandler}>Cancel</Button></div>
                    </div>
                    <Dialog open={this.state.isErrorDialogOpen} onClose={() => {
                        this.handleClose()
                    }} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Edit password</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <div className="editPasswordScreen-block_form">
                                    <div>
                                        <TextField
                                            defaultValue={this.props.userEditData.password}
                                            label="Password"
                                            type={this.state.showPassword ? 'text' : 'password'}
                                            name="password"
                                            onChange={this.onInputChange}>
                                        </TextField>
                                        <div className="editPasswordScreen-block_form_icon">
                                            {this.state.showPassword ? (
                                                <Visibility onClick={this.handleClickShowPassword}></Visibility>
                                            ) : ""}
                                            {!this.state.showPassword ? (
                                                <VisibilityOffIcon onClick={this.handleClickShowPassword}></VisibilityOffIcon>
                                            ) : ""}</div>
                                    </div>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button size="large" color="secondary" onClick={() => {
                                this.updatePassword()
                            }}>
                                OK
                            </Button>
                            <Button size="large" color="secondary" onClick={() => {
                                this.handleClose()
                            }}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    }
}