import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './css/userEditScreen.css';
import CreateIcon from '@material-ui/icons/Create';

export class UserEditScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.userEditData.email,
            password: this.props.userEditData.password,
            firstName: this.props.userEditData.firstName,
            lastName: this.props.userEditData.lastName,
            phone: this.props.userEditData.phone
        };
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
        console.log(this.props.userEditData.id)
        axios.post('https://localhost:5001/editUser', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res);
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
            console.log("usersList", res);
            /* this.setState({ usersList: res.data })*/
            this.props.goToMainScreen(res.data);
        });
    }

    goToEditPassword() {
        this.props.goToEditPasswordHandler(this.props.userEditData);
    }

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
                </div>
            </div>
        )
    }
}