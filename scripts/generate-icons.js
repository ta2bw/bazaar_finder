import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcInput);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Generate image data
  // Color palette: orange theme (#ea580c is R:234, G:88, B:12), deep orange (#c2410c), white (#ffffff)
  const rawBytes = [];
  const cx = width / 2;
  const cy = height / 2;
  const rCorner = width * 0.22;

  for (let y = 0; y < height; y++) {
    rawBytes.push(0); // filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      // Rounded squircle distance
      let inBounds = true;
      if (!isMaskable) {
        const dx = Math.abs(x - cx);
        const dy = Math.abs(y - cy);
        const limit = width / 2 - 2;
        const cornerDist = Math.max(0, dx - (limit - rCorner)) ** 2 + Math.max(0, dy - (limit - rCorner)) ** 2;
        if (cornerDist > rCorner ** 2) {
          inBounds = false;
        }
      }

      if (!inBounds) {
        rawBytes.push(0, 0, 0, 0); // transparent
        continue;
      }

      // Background gradient from top-left (#ea580c) to bottom-right (#9a3412)
      const gradRatio = (x + y) / (width + height);
      let r = Math.round(234 - gradRatio * 80);
      let g = Math.round(88 - gradRatio * 36);
      let b = Math.round(12 + gradRatio * 6);
      let a = 255;

      // Draw Bazaar Pin & Tent in center
      // Center pin head:
      const pinDist = Math.hypot(x - cx, y - (cy - height * 0.08));
      if (pinDist < width * 0.16) {
        // Pin outer circle (white)
        r = 255; g = 255; b = 255;
        if (pinDist < width * 0.07) {
          // Pin center dot (orange)
          r = 234; g = 88; b = 12;
        }
      } else {
        // Pin point / triangle downward
        const dyPin = y - (cy - height * 0.08);
        const dxPin = Math.abs(x - cx);
        if (dyPin > 0 && dyPin < height * 0.25 && dxPin < (height * 0.25 - dyPin) * 0.65) {
          r = 255; g = 255; b = 255;
        }
      }

      // Awning arc stripes below pin
      const awningY = cy + height * 0.18;
      const awningH = height * 0.15;
      if (y >= awningY && y <= awningY + awningH) {
        const awningW = width * 0.72;
        if (Math.abs(x - cx) <= awningW / 2) {
          const stripe = Math.floor(((x - (cx - awningW / 2)) / awningW) * 8);
          if (stripe % 2 === 0) {
            r = 255; g = 255; b = 255;
          } else {
            r = 234; g = 88; b = 12;
          }
        }
      }

      rawBytes.push(r, g, b, a);
    }
  }

  const rawBuffer = Buffer.from(rawBytes);
  const deflated = zlib.deflateSync(rawBuffer, { level: 9 });
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));

console.log('Successfully generated PWA icon assets: 192x192, 512x512, maskable, and apple-touch-icon!');
