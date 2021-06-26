import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './css/loginScreen.css';
import { Cookies } from 'react-cookie';

export class SignInScreen extends Component {

    constructor(props) {
        super(props);
        this.cookies = new Cookies();
        this.state = {
            email: "",
            password: "",
            userData: {}
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.signInFunction = this.signInFunction.bind(this);
        this.cookies = new Cookies();
        var id = this.cookies.get('userId');
        console.log("id", id);
        if (this.cookies.get('userId') !== undefined)
            this.loadUserData(this.cookies.get('userId'));
        this.emailReg = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;   
    }

    loadUserData(userId) {
        let params = {
            Id: userId
        }
        axios.post('https://localhost:5001/getUserInfo', params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res.data);
            this.setState({ userData: res.data });
            if (this.cookies.get('userId'))
            this.getUsers(this.cookies.get('userRole'));
        });
    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    signInFunction = (e) => {

        if (this.state.email !== "" && this.state.password !== "" && this.emailReg.test(this.state.email)) {

            let params = {
                email: this.state.email,
                password: this.state.password
            }
            console.log(this.state.password);
            axios.post('https://localhost:5001/signIn', params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log(res);
                if (res.data.email !== null) {
                    this.setState({ userData: res.data });
                    this.cookies.set('userId', res.data.id, { path: '/' });
                    this.cookies.set('userRole', res.data.role, { path: '/' });
                    this.getUsers(res.data.role);
                }
                else alert("Wrong email or password");
            });
        }
        else alert("Fill correctly both field");
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
            this.props.goToMainScreen(this.state.userData, res.data);
        });
    }



    render() {
        return (
            <div className="signInScreen-block">
                <div className="signInScreen-block_form">
                    <TextField
                        id="outlined-basic"
                        label="E-mail"
                        name="email"
                        variant="outlined"
                        onChange={this.onInputChange}
                        value={this.state.email}
                        helperText={this.state.email !== "" && !this.emailReg.test(this.state.email) ? 'Not email format' : '' }>
                    </TextField>
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        name="password"
                        onChange={this.onInputChange}
                        value={this.state.value}
                    />
                
                    <div><Button variant="contained" color="primary" onClick={() => { this.signInFunction() }}>Sign In</Button></div>
                </div>
            </div>
        )
    }
}