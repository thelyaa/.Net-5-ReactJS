import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { IconButton } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import './css/editPasswordScreen.css';

export class EditPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: this.props.userEditData.password,
            showPassword: false
        };
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    updatePassword = (e) => {
       
        console.log(this.state.password);
        let params = {
            Id: this.props.userEditData.id,
            password: this.state.password
        }

        axios.post('https://localhost:5001/updatePassword', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res);
            alert("Changes saved");
            this.props.goToPreviousScreen();
        });  
    }

    render() {
        return (
            <div className="editPasswordScreen-block">
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
                                ):""
                            }
                            {!this.state.showPassword ? (
                                <VisibilityOffIcon onClick={this.handleClickShowPassword}></VisibilityOffIcon>
                            ):""}</div>
                    </div>
                    <div className="editPasswordScreen-block_button">
                        <div className="editPasswordScreen-block_button"><Button variant="contained" color="primary" onClick={() => this.updatePassword() }>OK</Button></div>
                        <div className="editPasswordScreen-block_button"><Button variant="contained" color="primary" onClick={this.props.cancelHandler}>Cancel</Button></div>
                    </div>
                </div>
            </div>
        )
    }
}