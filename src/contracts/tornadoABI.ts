import { AbiItem } from 'web3-utils';

const tornadoABI: AbiItem[] = [
    {
        constant: false,
        inputs: [
            {
                internalType: 'bytes32',
                name: '_commitment',
                type: 'bytes32',
            },
        ],
        name: 'deposit',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'bytes',
                name: '_proof',
                type: 'bytes',
            },
            {
                internalType: 'bytes32',
                name: '_root',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: '_nullifierHash',
                type: 'bytes32',
            },
            {
                internalType: 'address payable',
                name: '_recipient',
                type: 'address',
            },
            {
                internalType: 'address payable',
                name: '_relayer',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_fee',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_refund',
                type: 'uint256',
            },
        ],
        name: 'withdraw',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'bytes32',
                name: '_root',
                type: 'bytes32',
            },
        ],
        name: 'isKnownRoot',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'bytes32',
                name: '_nullifierHash',
                type: 'bytes32',
            },
        ],
        name: 'isSpent',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'commitment',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'uint32',
                name: 'leafIndex',
                type: 'uint32',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
        ],
        name: 'Deposit',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'toBtc',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'nullifierHash',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'relayer',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'fee',
                type: 'uint256',
            },
        ],
        name: 'Withdrawal',
        type: 'event',
    },
];

export { tornadoABI };
