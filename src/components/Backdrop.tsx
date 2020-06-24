import React from 'react';

import '../styles/Backdrop.css';

interface Props {
    clicked: any;
    show: boolean;
}

const backdrop = (props: Props) => (props.show ? <div className="backdrop" onClick={props.clicked} /> : null);

export default backdrop;
