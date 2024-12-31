const http = require('node:http');

let num = 0;
const totalR = [];

const server = http.createServer();

server.on('request', (req, res) => {
    console.log(req.socket);
    console.log(req.socket.localPort)
    console.log(req.headers);
    console.log(req.socket.remoteAddress);
    if (req.url === '/') {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ message: 'pong' + num }));
        res.write('\n');
        res.end();
    }
})
    .on('error', (err) => {
        console.error(err);
    })
    .on('listening', () => console.log('listening on :', server.address()))
    .listen(8000);

const ping = async () => {
    const client = await fetch('http://localhost:8000');
    return await client.json();
}

ping();









