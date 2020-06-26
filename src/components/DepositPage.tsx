import React, { Component } from 'react';
import { DEPOSIT_AMOUNTS, NETWORK, TOKEN_ADDRESS, TORNADO_INSTANCES_ADDRESSES, AMOUNTS_DISABLED } from '../config';
import { tokenABI } from '../contracts/tokenABI';
import { getNoteStringAndCommitment } from '../utils/snarks-functions';
import { getAnonymitySetSize } from '../utils/axios-functions';
import Spinner from './Spinner';
import Modal from './Modal';
import { tornadoABI } from '../contracts/tornadoABI';
import Web3 from 'web3';

interface DepositPageState {
    tbtcAmount: number; // the amount of TBTC which the user wants to send to Tornado
    anonymitySetSize: number;
    noteString: string; // a string which allows the user to withdraw TBTC from Tornado
    loading: boolean;
    anonymitySetLoading: boolean;
    showDepositInfo: boolean;
    showModal: boolean;
    sendingApprove: boolean;
    sendingDeposit: boolean;
    web3: any;
}

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

// pass props and State interface to Component class
class DepositPage extends Component<{}, DepositPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            tbtcAmount: 0.001, // default option
            anonymitySetSize: 0,
            noteString: '',
            loading: false,
            anonymitySetLoading: false,
            showDepositInfo: false,
            showModal: false,
            sendingApprove: false,
            sendingDeposit: false,
            web3: null,
        };
    }

    componentDidMount = async () => {
        this.setAnonymitySetSize(this.state.tbtcAmount);
    };

    connectWallet = async () => {
        // connects to MetaMask
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();

            // make sure Ropsten testnet is selected
            const networkId = await window.web3.eth.net.getId();
            if (networkId !== 3) {
                alert('Switch to Ropsten testnet');
            }

            this.setState({ web3: window.web3 }, () => {
                console.log('wallet connected');
            });
        } else {
            alert('Install MetaMask if you want to deposit to TBTC Tornado');
        }
    };

    // set the amount of BTC which the user wants to deposit
    setBtcAmountHandler = (amount: number) => {
        this.setState({ tbtcAmount: amount, showDepositInfo: false });

        // show anonymity set size for selected amount
        this.setAnonymitySetSize(amount);
    };

    getDepositTxData = async (btcAmount: number, commitment: string) => {
        const tornadoAddress = TORNADO_INSTANCES_ADDRESSES[NETWORK][btcAmount];
        const tornadoContract = new this.state.web3.eth.Contract(tornadoABI, tornadoAddress);

        return tornadoContract.methods.deposit(commitment).encodeABI();
    };

    getApproveTxData = async (btcAmount: number) => {
        // get TBTC contract instance
        const tokenAddress = TOKEN_ADDRESS[NETWORK];
        const tokenInstance = new this.state.web3.eth.Contract(tokenABI, tokenAddress);
        const tornadoAddress = TORNADO_INSTANCES_ADDRESSES[NETWORK][btcAmount];

        // get transaction data for approve() method called on TBTC token contract
        const amountToApprove = btcAmount * 10 ** 18;
        return tokenInstance.methods.approve(tornadoAddress, amountToApprove.toString()).encodeABI();
    };

    closeModal = async () => {
        this.setState({ showModal: false });
    };

    makeDepositHandler = async () => {
        this.setState({ loading: true });

        try {
            const web3 = this.state.web3;
            const accountSelected = await web3.eth.getAccounts(); // selected account in MetaMask
            const userAddress = accountSelected[0];
            const tbtcAmount = this.state.tbtcAmount;
            const tokenAddress = TOKEN_ADDRESS.ropsten;
            const tokenInstance = new web3.eth.Contract(tokenABI, TOKEN_ADDRESS.ropsten);
            const tornadoAddress = TORNADO_INSTANCES_ADDRESSES[NETWORK][tbtcAmount];

            // check if the user has sufficient token balance
            const usersTokenBalance = await tokenInstance.methods.balanceOf(userAddress).call();
            if (usersTokenBalance < tbtcAmount * 10 ** 18) {
                this.setState({ showModal: true, loading: false });
                throw 'Insufficient balance of TBTC tokens';
            }

            // check if enough tokens is allowed to be spent by tornado instance
            const allowedToSpend = await tokenInstance.methods.allowance(userAddress, tornadoAddress).call();
            console.log('allowedToSpend', allowedToSpend);

            if (allowedToSpend < tbtcAmount * 10 ** 18) {
                this.setState({ sendingApprove: true });
                console.log('not enough tokens allowed to be spent');
                // tornado can not spend user's tokens. Make approve transaction.
                let approveReceipt = await web3.eth.sendTransaction({
                    from: userAddress,
                    to: tokenAddress,
                    data: await this.getApproveTxData(tbtcAmount),
                });
                console.log('approveReceipt', approveReceipt);
                this.setState({ sendingApprove: false });
            }

            // ----- DEPOSIT TX -----
            // et noteString and commitment
            console.log('getting noteString');
            this.setState({ sendingDeposit: true });

            const { noteString, commitment } = getNoteStringAndCommitment(
                'tbtc',
                tbtcAmount,
                await web3.eth.net.getId(),
            );

            // send deposit Tx
            let depositReceipt = await web3.eth.sendTransaction({
                from: userAddress,
                to: tornadoAddress,
                data: await this.getDepositTxData(tbtcAmount, commitment),
            });
            console.log('depositReceipt', depositReceipt);
            this.setState({ sendingDeposit: false });

            this.setState({ loading: false, showDepositInfo: true, noteString });
        } catch (error) {
            console.log('Error occured while making deposit');
            console.error(error);
            this.setState({ loading: false, sendingApprove: false, sendingDeposit: false });
        }
    };

    setAnonymitySetSize = async (amount: number) => {
        this.setState({ anonymitySetLoading: true });
        let size = await getAnonymitySetSize(amount);
        this.setState({ anonymitySetSize: size, anonymitySetLoading: false });
    };

    render() {
        const amountOptions = (
            <ul className="deposit-amounts-ul">
                {DEPOSIT_AMOUNTS.map((amount, index) => (
                    <li key={index}>
                        <label className="container">
                            {amount} TBTC
                            <input
                                checked={this.state.tbtcAmount === amount}
                                type="radio"
                                name="amounts"
                                id={index.toString()}
                                value={amount}
                                onChange={() => this.setBtcAmountHandler(amount)}
                                disabled={this.state.loading || AMOUNTS_DISABLED.includes(amount)} // don't allow the user to change TBTC amount while transactions are being provessed
                            />
                            <span className="checkmark" />
                        </label>
                    </li>
                ))}
            </ul>
        );

        // show deposit information is available
        let depositInfo = <></>;
        if (this.state.noteString !== '' && !this.state.loading && this.state.showDepositInfo) {
            depositInfo = (
                <div className="deposit-info-div">
                    <h3>Success!</h3>
                    <p>Keep this note. It allows you to withdraw anonymized TBTC.</p>
                    <div className="notestring">{this.state.noteString}</div>
                </div>
            );
        }

        // DEPOSIT BUTTON
        let depositButton = (
            <button className="make-deposit-button hover-button" onClick={this.connectWallet}>
                Connect to a wallet
            </button>
        );

        if (this.state.web3) {
            if (this.state.showDepositInfo) {
                depositButton = <></>;
            } else {
                depositButton = (
                    <button className="make-deposit-button hover-button" onClick={this.makeDepositHandler}>
                        Deposit
                    </button>
                );
            }
        }

        let loadingApprove = <></>;
        if (this.state.sendingApprove) {
            loadingApprove = (
                <div>
                    <p className="sending-tx-label">Sending approve transaction...</p>
                </div>
            );
        }

        let loadingDeposit = <></>;
        if (this.state.sendingDeposit) {
            loadingDeposit = (
                <div>
                    <p className="sending-tx-label">Sending deposit transaction...</p>
                </div>
            );
        }

        let insufficientBalanceModal = <></>;
        if (this.state.showModal) {
            insufficientBalanceModal = (
                <Modal modalClosed={this.closeModal} show={this.state.showModal}>
                    <h2>Insufficient balance</h2>
                    <p>
                        You don't have enough TBTC tokens. You need {this.state.tbtcAmount} TBTC. You can get more TBTC{' '}
                        <a target="_blank" href="https://dapp.test.tbtc.network/deposit">
                            here
                        </a>
                        .
                    </p>
                </Modal>
            );
        }

        return (
            <div>
                <h3 className="deposit-headline">Choose the amount of TBTC to anonymize</h3>

                {amountOptions}
                <h3 className="anonymity-size">
                    Anonymity set size:{' '}
                    {this.state.anonymitySetSize === -1 ? <>Loading...</> : <b>{this.state.anonymitySetSize}</b>}
                </h3>

                {depositInfo}

                {insufficientBalanceModal}

                {this.state.loading ? (
                    <>
                        <Spinner />
                        {loadingApprove}
                        {loadingDeposit}
                    </>
                ) : (
                    <>{depositButton}</>
                )}
            </div>
        );
    }
}

export default DepositPage;
