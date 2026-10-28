import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
export function saveImage(file: any, prefix: string): string {
  if (!file?.buffer || file.buffer.length > 5 * 1024 * 1024) throw new BadRequestException('An image up to 5 MB is required');
  const b: Buffer = file.buffer;
  const ext = b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? '.png' : b[0] === 255 && b[1] === 216 && b[2] === 255 ? '.jpg' : b.toString('ascii',0,4) === 'RIFF' && b.toString('ascii',8,12) === 'WEBP' ? '.webp' : '';
  if (!ext) throw new BadRequestException('Upload a valid PNG, JPG or WebP image');
  const name = `${prefix}-${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), 'uploads'); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, name), b);
  return `http://localhost:3000/uploads/${name}`;
}
