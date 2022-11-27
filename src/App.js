/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import axios from "axios";

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0.0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    }
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser}
    newUser.userName = logInInfo.userName
    this.setState({currentUser: newUser})
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit}/>)
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit}/>) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react-example-code-gh-pages">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }

   async componentDidMount() {
    const debitAPI = "https://johnnylaicode.github.io/api/debits.json";

    try {
      const debitResponse = await axios.get(debitAPI);
      let accountBalance = this.state.accountBalance;
      for (const data of debitResponse.data) {
        accountBalance -= data.amount;
      }
      this.setState({ debitList: debitResponse.data, accountBalance: accountBalance });
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      }
    }
  }

  addCredit = (event) => {
    event.preventDefault();

    const target = event.target;
    const date = new Date();
    const dateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    const credit = {"id": this.state.creditList.length+1, "description": target[0].value, "amount": target[1].value, "date": dateString};
    this.setState((prevState) => ({
      creditList: [credit, ...prevState.creditList],
      accountBalance: prevState.accountBalance + Number(target[1].value)
    }))
  }

  addDebit = (event) => {
    event.preventDefault();

    const target = event.target;
    const date = new Date();
    const dateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    const debit = {"id": this.state.debitList.length+1, "description": target[0].value, "amount": target[1].value, "date": dateString};
    this.setState((prevState) => ({
      debitList: [debit, ...prevState.debitList],
      accountBalance: prevState.accountBalance - Number(target[1].value)
    }))
  }
}

export default App;