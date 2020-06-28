// const NETWORK = 'mainnet';
const NETWORK = 'ropsten';

// access to Infura ethereum node
const RPC_URL: string = 'https://' + NETWORK + '.infura.io/v3/066eeeca9925471f9db758dc3af48442';

const TORNADO_INSTANCES_ADDRESSES: any = {
    ropsten: {
        0.001: '0x750be934a9e3D0e3Ea53D5404637A536c0CdDe68',
        0.01: '0x70a3d78447FA3482003A64288a7905b581Ab21b5',
        0.1: '0xA467352aB675F5d0E552bF2c17731f14Ac9E5416',
    },
};

// BTC deposit amount options which show up in th UI (sort the amounts from the lowest to the highest)
const DEPOSIT_AMOUNTS: number[] = Object.keys(TORNADO_INSTANCES_ADDRESSES[NETWORK]).sort().map(Number);

// Do not allow the user to choose the following amounts
const AMOUNTS_DISABLED: number[] = [];

const TOKEN_ADDRESS = {
    ropsten: '0x101848d5c5bbca18e6b4431eedf6b95e9adf82fa',
};

const PAYMASTER_ADDRESS = '0x55Ef931a040b28657c53c9847de05d81456380Ff';

// demo private key without 0x
const DEMO_PRIVATE_KEY = 'F8D46A5469433C4369BA77749B760F46208066F92EB9D9DCC31F26D4355DE157';

// used to get anonymity set size using TheGraph
const THE_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/benesjan/tbtc-tornado';

const RELAYER_URL = 'http://127.0.0.1:8000';

const SERVER_URL = 'http://192.168.1.14:5000';

export {
    RPC_URL,
    DEPOSIT_AMOUNTS,
    TORNADO_INSTANCES_ADDRESSES,
    TOKEN_ADDRESS,
    PAYMASTER_ADDRESS,
    NETWORK,
    THE_GRAPH_URL,
    RELAYER_URL,
    SERVER_URL,
    AMOUNTS_DISABLED,
    DEMO_PRIVATE_KEY,
};
