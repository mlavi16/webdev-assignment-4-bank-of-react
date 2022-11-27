/*==================================================
src/components/AccountBalance.js

The AccountBalance component displays account balance. It is included in other page views.
==================================================*/
import React, {Component} from 'react';

class AccountBalance extends Component {
  // Display account balance
  render() {
    return (
      <h3>
        Balance: {this.props.accountBalance.toFixed(2)}
      </h3>
    );
  }
}

export default AccountBalance;