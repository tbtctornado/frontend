// server configuration
import axios from 'axios';
import { NETWORK, THE_GRAPH_URL, SERVER_URL, TORNADO_INSTANCES_ADDRESSES } from '../config';

const getAnonymitySetSize = async (btcAmount: number) => {
    // convert the address to lowercase, otherwise it won't work
    const tornadoAddress = TORNADO_INSTANCES_ADDRESSES[NETWORK][btcAmount].toLowerCase();
    const query = `{ anonymitySet(id: "${tornadoAddress}") { size } }`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const data = JSON.stringify({ query: query });

    try {
        const response = await axios.post(THE_GRAPH_URL, data, { headers: headers });
        const anonymitySet = response.data.data.anonymitySet;

        // if there are no deposits in the contract yet, it returns anonymitySet === null
        if (anonymitySet !== null) {
            return anonymitySet.size;
        } else {
            return 0;
        }
    } catch (error) {
        console.log('Error while requesting anonymity set size');
        console.log(error);
        return -1;
    }
};

const getProvingKey = async () => {
    const reponse = await axios.get(`${SERVER_URL}/provingKey`, {
        responseType: 'arraybuffer',
    });
    return reponse.data;
};

export { getAnonymitySetSize, getProvingKey };
