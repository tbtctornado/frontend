import React, { Component } from 'react';
import Backdrop from './Backdrop';

import '../styles/Modal.css';

interface Props {
    modalClosed: any;
    show: boolean;
}

class Modal extends Component<Props, {}> {
    // Order summary updates every time we add incredient. But we don't show order summary.
    // We want order summary to re-render only when we want to ee it
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return (
            nextProps.show !== this.props.show || nextProps.children !== this.props.children // update event when children change (because of loading spinner)
        );
    }

    render() {
        return (
            <>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div
                    className="modal"
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0',
                    }}
                >
                    <button className="closeButton" onClick={this.props.modalClosed}>
                        ✖
                    </button>
                    {this.props.children}
                </div>
            </>
        );
    }
}

export default Modal;
