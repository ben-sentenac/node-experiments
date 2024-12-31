import { spawn } from 'node:child_process';
import process from 'node:process';
import { parsePacket } from './packetParser.js';

const eth = process.argv.slice(2)[0] ?? 'any';

console.log(eth);

const sniffer = spawn('sudo',['tcpdump','-i', eth,'-U','-w','-']);

sniffer.stdout.on('data',(data) => {

    const packet = parsePacket(data);
    console.log(packet);
});

sniffer.stderr.on('data', (data) => {
    console.log('Error', data.toString())
});

sniffer.on('close', () => {
    console.log('closing raw socket...0');
});