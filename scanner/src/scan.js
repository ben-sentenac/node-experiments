import { Socket,isIP } from 'node:net';

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

//use isIp instead
//const ipRegex = new RegExp(/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/);

function handleError(error) {
    if(error instanceof Error) {
        console.error(error.message);
    } else {
        console.error('An error occur');
    }
    process.exit(1);
}

export async function scan(target, range,shouldSendBanner) {
    if(!isIP(target)) handleError(new Error('Invalid ipv4 ip'));
    let start = 1;
    console.log(`scanning host:${target} ports: from ${start} to ${range}`);
    while (start <= range) {
        
        scanPort(target, start,shouldSendBanner);
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
       if(err.code === 'ECONNRESET') {
            console.log(err.message)
       }
        socket.destroy();
        closedPorts++;
    });

    socket.on('timeout', (t) => {
        socket.destroy();
    });

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

