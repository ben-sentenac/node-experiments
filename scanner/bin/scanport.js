#!/usr/bin/node
import { program } from "commander"
import { scan } from "../src/scan.js";

//portscanner -b <ip | ip range> [port range] 


program
.name('Scanport')
.description('tcp port scanner')
.version('0.0.1')
  .option('-b', 'add a banner')
  .argument('<host>', 'host name or host range')
  .argument('[portRange]','the number of port to scan',65535);

program.parse();


const [host,portRange = 65535] = program.args;
const {b} = program.opts();

scan(host, portRange,b);

