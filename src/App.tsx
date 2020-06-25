import React, { Component } from 'react';
import WithdrawPage from './components/WithdrawPage';
import DepositPage from './components/DepositPage';
import Footer from './components/Footer';
import logo from './images/logo.svg';
import './styles/App.css';

// State interface
interface State {
    pageSelected: string;
    web3: any;
}

// pass props and State interface to Component class
class App extends Component<{}, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            pageSelected: 'deposit',
            web3: null,
        };
    }

    switchToDeposit = () => {
        this.setState({ pageSelected: 'deposit' });
    };

    switchToWithdraw = () => {
        this.setState({ pageSelected: 'withdraw' });
    };

    render() {
        let withdrawButtonClasses = 'unselected';
        let depositButtonClasses = 'unselected';

        let pageContent;

        if (this.state.pageSelected === 'withdraw') {
            withdrawButtonClasses = 'selected';
            pageContent = <WithdrawPage />;
        } else {
            depositButtonClasses = 'selected';
            pageContent = <DepositPage />;
        }
        return (
            <>
                <div className="App">
                    <img src={logo} className="logo" alt="logo" />
                    <div className="page-wrapper">
                        <div className="page-selector-div">
                            <button className={depositButtonClasses} onClick={this.switchToDeposit}>
                                Deposit
                            </button>
                            <button className={withdrawButtonClasses} onClick={this.switchToWithdraw}>
                                Withdraw
                            </button>
                        </div>
                        <div className="content-wrapper">{pageContent}</div>
                    </div>
                </div>
                <Footer></Footer>
            </>
        );
    }
}

export default App;
