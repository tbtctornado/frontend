// const NETWORK = 'mainnet';
const NETWORK = 'ropsten';

// access to Infura ethereum node
const RPC_URL: string = 'https://' + NETWORK + '.infura.io/v3/066eeeca9925471f9db758dc3af48442';

const TORNADO_INSTANCES_ADDRESSES: any = {
    ropsten: {
        0.001: '0x59Bf15eC506892396095A50feb077021f39c27Dc',
        0.01: '0xf5307f6680d335b1cae884b43d5b46e1b3671b30',
        0.1: '0x758ab20c9a4ad3b609076e5f27b5665ed5b0c682',
    },
};

// BTC deposit amount options which show up in th UI (sort the amounts from the lowest to the highest)
const DEPOSIT_AMOUNTS: number[] = Object.keys(TORNADO_INSTANCES_ADDRESSES[NETWORK]).sort().map(Number);

// Do not allow the user to choose the following amounts
const AMOUNTS_DISABLED: number[] = [0.01, 0.1];

const TOKEN_ADDRESS = {
    ropsten: '0xEB770B1883Dcce11781649E8c4F1ac5F4B40C978',
    mainnet: '0x5228a22e72ccC52d415EcFd199F99D0665E7733b',
};

const PAYMASTER_ADDRESS = '0x55Ef931a040b28657c53c9847de05d81456380Ff';

// demo private key without 0x
const DEMO_PRIVATE_KEY = 'F8D46A5469433C4369BA77749B760F46208066F92EB9D9DCC31F26D4355DE157';

// used to get anonymity set size using TheGraph
const THE_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/benesjan/btc-tornado';

const RELAYER_URL = 'http://127.0.0.1:8000';

export {
    RPC_URL,
    DEPOSIT_AMOUNTS,
    TORNADO_INSTANCES_ADDRESSES,
    TOKEN_ADDRESS,
    PAYMASTER_ADDRESS,
    NETWORK,
    THE_GRAPH_URL,
    RELAYER_URL,
    AMOUNTS_DISABLED,
    DEMO_PRIVATE_KEY,
};
