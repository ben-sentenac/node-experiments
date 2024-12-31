export function parsePacket(buffer) {
    console.log(buffer);
    const ethernetFrame = parseEthernetFrame(buffer);
    const ipFrame = parseIPv4Packet(buffer.slice(14));
    const tcpFrame = parseTCPHeader(ipFrame.payload)
    return {
        ethernetFrame,
        ipFrame,
        tcpFrame
    }
}

function parseEthernetFrame(buffer) {

    return {
        destinationMAC: buffer.slice(0, 6).toString('hex'),
        sourceMAC: buffer.slice(6, 12).toString('hex'),
        type: buffer.slice(12, 14).toString('hex'),
        payload: buffer.slice(14)
    }

}

function parseIPv4Packet(buffer) {
    const version = buffer[0] >> 4;
    const ihl = (buffer[0] & 0x0F) * 4;
    const totalLength = buffer.readUInt16BE(2);
    const protocol = buffer[9];
    const sourceIP = buffer.slice(12, 16).join('.');
    const destinationIP = buffer.slice(16, 20).join('.');

    return {
        version,
        ihl,
        totalLength,
        protocol,
        sourceIP,
        destinationIP,
        payload: buffer.slice(ihl)//error probably comes from here
    };
}

function parseTCPHeader(buffer) {
    if (buffer.length < 20) {
        throw new Error('Buffer too short to be a valid TCP header');
    }

    const sourcePort = buffer.readUInt16BE(0);
    const destinationPort = buffer.readUInt16BE(2);
    const sequenceNumber = buffer.readUInt32BE(4);
    const acknowledgmentNumber = buffer.readUInt32BE(8);
    const dataOffset = (buffer[12] >> 4) * 4;
    const flags = buffer[13];
    const windowSize = buffer.readUInt16BE(14);
    const checksum = buffer.readUInt16BE(16);
    const urgentPointer = buffer.readUInt16BE(18);

    if (buffer.length < dataOffset) {
        throw new Error('Buffer too short for TCP data offset');
    }

    return {
        sourcePort,
        destinationPort,
        sequenceNumber,
        acknowledgmentNumber,
        dataOffset,
        flags,
        windowSize,
        checksum,
        urgentPointer,
        payload: buffer.slice(dataOffset)
    };
}


function parseHTTP(buffer) {
    const data = buffer.toString('utf-8');
    const [header, body] = data.split('\r\n\r\n');
    const headers = header.split('\r\n').map(line => {
        const [key, ...value] = line.split(': ');
        return { key, value: value.join(': ') };
    });

    return {
        headers,
        body
    };
}