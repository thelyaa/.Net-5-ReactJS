import React, { Component } from 'react';
import { SignInScreen } from './components/SignInScreen';
import { MainScreen } from './components/MainScreen';
import { UserEditScreen } from './components/UserEditScreen';
import { EditPasswordScreen } from './components/EditPasswordScreen';
import './custom.css'

export default class App extends Component {
    static displayName = App.name;
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: "Login",
            userData: {},
            usersList: [],
            userEditData: {},
            userId: ""
        }
    }

    setLoginScreenData(userData, usersList) {
        let sortArr = [];
        sortArr.unshift(userData);
        usersList.map(item => {
            if (item.id != userData.id)
            sortArr.push(item)
        })
        console.log(sortArr);
        this.setState({ currentScreen: "MainScreen", userData: userData, usersList: sortArr });
    }
    setEditScreenData(usersList) {
        this.setState({ currentScreen: "MainScreen", usersList: usersList });
    }

    getUserData(data) {
        console.log("add", data)
        this.setState({ currentScreen: "UserEditScreen", userEditData: data[0] })
    }

    viewUserInfoScreen(data) {
        console.log("df", data);
        this.setState({currentScreen: "ViewUserInfoScreen", userViewData: data[0]})
    }

    setPasswordData(data) {
        this.setState({ currentScreen: "EditPasswordScreen", userEditData: data });
    }

    render () {
        return (
            <div>
                {console.log(this.state.currentScreen, this.state.userData)}
                {this.state.currentScreen === "Login" ? (
                    <SignInScreen goToMainScreen={this.setLoginScreenData.bind(this)} />
                ) : ""}
                {this.state.currentScreen === "MainScreen" ? (
                    <MainScreen usersList={this.state.usersList}
                        userData={this.state.userData}
                        setUserData={(newData) => { this.setState({ usersList: newData }) }}
                        editUserScreenHandler={this.getUserData.bind(this)}
                        viewUserInfoScreenHandler={this.viewUserInfoScreen.bind(this)}
                        deAuthHandler={() => { this.setState({ currentScreen: "Login" }) }}/>
                ) : ""}        
                {this.state.currentScreen === "UserEditScreen" ? (
                    <UserEditScreen userData={this.state.userData}
                        usersList={this.state.usersList}
                        userEditData={this.state.userEditData}
                        cancelHandler={() => { this.setState({ currentScreen: "MainScreen" }) }}
                        goToEditPasswordHandler={this.setPasswordData.bind(this)}
                        goToMainScreen={this.setEditScreenData.bind(this)} />
                ):""}
                {this.state.currentScreen === "EditPasswordScreen" ? (
                    <EditPasswordScreen userEditData={this.state.userEditData}
                        cancelHandler={() => { this.setState({ currentScreen: "UserEditScreen" }) }}
                        goToPreviousScreen={() => { this.setState({ currentScreen: "UserEditScreen" }) }} />
                ):""}
            </div>
      //<Layout>
      //  <Route exact path='/' component={Home} />
      //  <Route path='/counter' component={Counter} />
      //  <Route path='/fetch-data' component={FetchData} />
      //</Layout>
        );
    }
}
