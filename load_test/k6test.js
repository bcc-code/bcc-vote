import ws from 'k6/ws';
import { sleep } from 'k6';

export const options = {
    duration: '5s',
    vus: 20
};

export default function () {
    const res = ws.connect('wss://dev.vote.bcc.no/socket.io/?EIO=3&transport=websocket', (socket) => {
        socket.on('open', () => console.log('connected'));
        socket.on('message', (data) => console.log('Message received: ', data));
        socket.on('close', () => console.log('disconnected'));
    });
    sleep(1);
}
