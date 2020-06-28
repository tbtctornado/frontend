import React, { Component } from 'react';
import { generateProof, parseNote } from '../utils/snarks-functions';
import { DEMO_PRIVATE_KEY, NETWORK, TORNADO_INSTANCES_ADDRESSES, RPC_URL } from '../config';
import { tornadoABI } from '../contracts/tornadoABI';
import Spinner from './Spinner';
import Web3 from 'web3';

interface WithdrawPageState {
    noteWithdraw: string;
    ethAddress: string;
    loading: boolean;
    proofGenerated: boolean;
    txSent: boolean;
    error: boolean;
    web3: any;
}

class WithdrawPage extends Component<{}, WithdrawPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            noteWithdraw: '',
            ethAddress: '',
            loading: false,
            proofGenerated: false,
            txSent: false,
            error: false,
            web3: null,
        };
    }

    componentDidMount = async () => {
        let provider = new Web3.providers.HttpProvider(RPC_URL);
        const web3 = new Web3(provider);
        this.setState({ web3 });
    };

    handleChange = (event: any) => {
        // Handle change of input fields
        switch (event.target.name) {
            case 'ethRecipientAddress':
                this.setState({ ethAddress: event.target.value, txSent: false });
                break;
            case 'note':
                this.setState({ noteWithdraw: event.target.value, txSent: false });
                break;
            default:
                break;
        }
    };

    /**
     * Do an ETH withdrawal
     */
    withdrawHandler = async () => {
        this.setState({ loading: true, txSent: false, error: false });
        try {
            const web3 = this.state.web3;
            const refund: string = '0';
            const recipient = this.state.ethAddress;
            const { amount, deposit } = parseNote(this.state.noteWithdraw);
            const tornadoAddress = TORNADO_INSTANCES_ADDRESSES[NETWORK][amount];
            const tornado = new web3.eth.Contract(tornadoABI, tornadoAddress);
            const senderPrivateKey = DEMO_PRIVATE_KEY; // private key for demo purposes only
            const accountSender = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);

            // generate the proof
            console.log('Generating proof...');
            let { proof, args } = await generateProof({ deposit, recipient, refund, tornado });

            this.setState({ proofGenerated: true });

            // sign and send withdraw transaction
            console.log('Signing and sending withdraw transaction...');
            const nonce = await web3.eth.getTransactionCount(accountSender.address);
            const txData = await tornado.methods.withdraw(proof, ...args).encodeABI();
            const txSigned = await web3.eth.accounts.signTransaction(
                {
                    nonce: nonce,
                    to: tornadoAddress,
                    value: refund.toString(),
                    data: txData,
                    gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
                    gas: web3.utils.toHex(1e6),
                },
                '0x' + senderPrivateKey,
            );

            let receipt = await web3.eth.sendSignedTransaction(txSigned.rawTransaction);
            console.log('SUCCESS! Withdraw transaction sent', receipt);
            this.setState({ loading: false, proofGenerated: false, txSent: true, noteWithdraw: '', error: false });
        } catch (e) {
            console.log('ERROR: Withdraw transaction not sent', e);
            this.setState({ loading: false, proofGenerated: false, txSent: false, error: true });
        }
    };

    render() {
        let loadingInfo = <></>;
        let proofGenerated = <></>;
        let sendingTx = <></>;
        let txSent = <></>;

        let withdrawButton = (
            <button
                className="hover-button withdraw-button"
                onClick={this.withdrawHandler}
                disabled={this.state.ethAddress === '' || this.state.noteWithdraw === ''}
            >
                Withdraw
            </button>
        );

        if (this.state.loading) {
            withdrawButton = <Spinner></Spinner>;
            loadingInfo = <div>1. Generating proof...</div>;
            if (this.state.proofGenerated) {
                sendingTx = <div>2. Sending transaction...</div>;
            }
        }

        if (this.state.txSent && !this.state.error) {
            txSent = (
                <div className="successful-withdrawal">
                    <p className="withdraw-success-message">Success!</p>
                    <p className="withdraw-sent-message">TBTC tokens were sent to:</p>
                    <br />
                    <b>{this.state.ethAddress}</b>
                </div>
            );
        }

        if (this.state.error) {
            txSent = (
                <div className="successful-withdrawal">
                    <p className="withdraw-error-message">Something went wrong :(</p>
                    <span>Check console for more information</span>
                </div>
            );
        }

        return (
            <div className="withdraw-wrapper">
                <label className="withdraw-note-label">
                    <b>Your Note:</b>
                    <input name="note" type="text" value={this.state.noteWithdraw} onChange={this.handleChange} />
                </label>
                <br />
                <label className="btc-recipient-label">
                    <b>Recipient's Ethereum Address:</b>
                    <input
                        name="ethRecipientAddress"
                        type="text"
                        value={this.state.ethAddress}
                        onChange={this.handleChange}
                    />
                </label>
                <div className="withdrawal-info">
                    {withdrawButton}
                    {loadingInfo}
                    {proofGenerated}
                    {sendingTx}
                    {txSent}
                </div>
            </div>
        );
    }
}

export default WithdrawPage;
