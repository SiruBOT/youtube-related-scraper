import ip from "ip";
// Author: Jesse Tane <jesse.tane@gmail.com>
// NPMJS: https://npmjs.org/random-ip
export class RandomIp {
  static getRandomIp(address: string, start?: number, end?: number) {
    const bytes = ip.toBuffer(address);
    const ipv6 = bytes.length === 16;
    const bytesize = 8;

    start = start || 0;
    end = typeof end !== "undefined" ? end : bytes.length * bytesize;

    for (let i = 0; i < bytes.length; i++) {
      let bit = i * bytesize;

      // skip if nothing to do
      if (bit + bytesize < start || bit >= end) {
        continue;
      }

      let b = bytes[i];

      // insert random bits
      for (let n = 0; n < bytesize; n++) {
        if (bit >= start && bit < end) {
          const bitpos = bytesize - n - 1;
          const bitmask = 1 << bitpos;
          if (Math.random() < 0.5) {
            b |= bitmask;
          } else {
            b &= ~bitmask;
          }
        }
        bit++;
      }

      // save randomized byte
      bytes[i] = b;
    }

    // need an array for formatting
    const tets = [];
    for (let i = 0; i < bytes.length; i++) {
      if (ipv6) {
        if (i % 2 === 0) {
          tets[i >> 1] = ((bytes[i] << bytesize) | bytes[i + 1]).toString(16);
        }
      } else {
        tets[i] = bytes[i];
      }
    }

    return tets.join(ipv6 ? ":" : ".");
  }
}
