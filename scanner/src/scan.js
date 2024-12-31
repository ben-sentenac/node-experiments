import { Socket } from 'node:net';

const colors = {
    reset: '\x1b[0m',

    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',

    blackBg: '\x1b[40m',
    redBg: '\x1b[41m',
    greenBg: '\x1b[42m',
    yellowBg: '\x1b[43m',
    blueBg: '\x1b[44m',
    magentaBg: '\x1b[45m',
    cyanBg: '\x1b[46m',
    whiteBg: '\x1b[47m'
};




export async function scan(target, range,shouldSendBanner) {
    console.log('SCANNING:...\n');
    let start = 1;
    while (start <= range) {
        await scanPort(target, start,shouldSendBanner);
        start++;
    }
}


async function scanPort (ip, port,shouldSendBanner) {
    const socket = new Socket();
    let status = 'CLOSED';
    let info;
    let closedPorts = 0;
    socket.connect(port, ip);

    socket.setTimeout(4000);

    socket.on('error', (err) => {
        socket.destroy();
        closedPorts++;
    });

    socket.on('timeout', () => socket.destroy());

    socket.on('data', (chunk) => {
        let banner = chunk.toString();
        info = banner.split('\r\n\n')[0].trim();
    });

    socket.on('connect', () => {
        status = 'OPEN';
        if(shouldSendBanner) {
             socket.write('HEAD / HTTP/1.1\r\nHost: ' + ip + '\r\n\r\n');
        }
        socket.end();
    });

    socket.on('close', () => {
        if (status === 'OPEN') {
            console.log(`port:${colors.yellow} ${port}`, colors.green, status, colors.reset);
            if(shouldSendBanner) {
                console.log(colors.blue,info,colors.reset);
            }
            console.log('----------------------------------------');
        }
    });
}

