import { XStorage } from './state';

export const createSampleFiles = (
  banner: string
): Omit<XStorage, 'project'> => ({
  directories: {},
  files: {
    '1': {
      id: '1',
      name: 'ping.js',
      binary: false,
      content: `
import {Socket} from "socket";
import Net from "net";
import Timer from "timer";

class Ping extends Socket {
  constructor(data, callback) {
    // Sample data: { host: "www.moddable.com", id: 0, interval: 5000 }
    super({kind: "RAW", protocol: 1});
    this.client = callback;
    this.id = data.id;
    this.interval = data.interval || 5000;
    this.icmp_seq = -1;
    this.start(data.host);
  }
  start(host) {
    Net.resolve(host, (host, address) => {
      if (address) {
        this.address = address;
        trace(\`PING \$\{host\} (\$\{address\})\\n\`);
        this.ping();
        this.timer = Timer.repeat(() => {
          if (!this.reply)
            this.client(2);
          this.ping();
        }, this.interval);
      }
      else this.failed(\`Cannot resolve \$\{host\}\`);
    });
  }
  ping() {
    this.icmp_seq++;
    let address = this.address;
    let packet = this.packet = new ArrayBuffer(56);		// 8 for icmp header + 48 for icmp payload
    let values = new Uint8Array(packet);

    // ICMP header
    values[0] = 8;										// type 8 (echo request)
    values[1] = 0;										// code 0
    values[2] = values[3] = 0;							// will be the checksum
    values[4] = (this.id & 0xFF00) >> 8;
    values[5] =	this.id & 0x00FF;
    values[6] = (this.icmp_seq & 0xFF00) >> 8;
    values[7] =	this.icmp_seq & 0x00FF;
    for (let i=8, val=0x08; val<0x38; val+=1, i++) {	// packet data
      values[i] = val;
    }
    let cs = Ping.checksum(values);
    values[2] = (cs & 0xFF00) >> 8;
    values[3] = cs & 0x00FF;

    this.reply = false;
    this.write(address, packet);
  }
  failed(message) {
    this.client(-1, message);
    this.close();
  }
  close() {
    if (this.timer) {
      Timer.clear(this.timer);
      delete this.timer;
    }
    super.close();
  }
  callback(message, value, address) {
    if (2 !== message) return;
    this.reply = true;
    if (value != 76) this.failed("Unexpected packet length");

    // Ignore IP header
    this.read(null, 20);

    // ICMP header
    let buf = this.read(ArrayBuffer, 56);
    let values = new Uint8Array(buf);
    if (values[0] != 0 || values[1] != 0) this.failed("Response is not an echo reply");
    let checksum = (values[2] << 8) + values[3];
    let identifier = (values[4] << 8) + values[5];
    let icmp_seq = (values[6] << 8) + values[7];
    let isValid = Ping.validate_checksum(identifier, icmp_seq, checksum);
    if (isValid) {
      this.client(1, value-20, {address, icmp_seq});
    } else {
      this.failed("Invalid checksum for icmp_seq "+icmp_seq);
    }
  }

  static checksum(values) {
    let sum = 0;
    for (let i=0; i<values.length; i+=2) {
      sum += (values[i] << 8) + values[i+1];
    }
    let carry = sum & 0xFFFF0000;
    sum += (carry >> 16);
    return ~sum & 0xFFFF;
  }
  static validate_checksum(identifier, seqNumber, checksum) {
    let sum = 191232;									// sum of packet bytes (0x08, 0x09...0x37)
    sum += identifier + seqNumber;
    let carry = sum & 0xFFFF0000;
    sum += (carry >> 16);
    return checksum == (~sum & 0xFFFF);
  }
};
Object.freeze(Ping.prototype);

export default Ping;
`.trim()
    },
    '2': {
      id: '2',
      name: 'mod.js',
      binary: false,
      content: `
${banner}
import Ping from "ping";

const HOST = "www.moddable.com";
const ID = 0;
const INTERVAL = 1000;	// interval between pings

debugger;

let ping = new Ping({host: HOST, id: ID, interval: INTERVAL}, (message, value, etc) => {
  switch (message) {
    case -1:
      trace(\`Error: \$\{value\}\\n\`);
      break;
    case 1:
      trace(\`\$\{value\} bytes from \$\{etc.address\}: icmp_seq=\$\{etc.icmp_seq\}\\n\`);
      break;
    case 2:
      trace(\`Request timeout for icmp_seq \$\{ping.icmp_seq\}\\n\`);
      break;
  }
});
`.trim()
    },
    '3': {
      id: '3',
      name: 'manifest.json',
      binary: false,
      content: `
{
  "modules": {
    "*": "./*"
  },
  "resources":{
    "*": "./*"
  }
}
`.trim()
    }
  }
});
