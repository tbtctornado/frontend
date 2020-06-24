import React, { Component } from 'react';
import WithdrawPage from './components/WithdrawPage';
import DepositPage from './components/DepositPage';
import logo from './images/logo.svg';
import './styles/App.css';
import getWeb3 from './utils/getWeb3';

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

    componentDidMount = async () => {
        // get web3 injected by MetaMask
        const web3: any = await getWeb3();

        // Alert the user to choose Ropsten testnet
        const networkId = await web3.eth.net.getId();
        if (networkId !== 3) {
            alert('Switch to Ropsten testnet');
        }

        this.setState({ web3 });
    };

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
            pageContent = <WithdrawPage web3={this.state.web3} />;
        } else {
            depositButtonClasses = 'selected';
            pageContent = <DepositPage web3={this.state.web3} />;
        }
        return (
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
        );
    }
}

export default App;
