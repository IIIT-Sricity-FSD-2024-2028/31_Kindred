import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// The data key is protected by the current Windows account. The records never
// need to be written to disk as plaintext during local development or migration.
function protectKey(value:Buffer,unprotect=false):Buffer {
 if(process.platform!=='win32')return value;
 const operation=unprotect?'Unprotect':'Protect';
 const command=`Add-Type -AssemblyName System.Security; $bytes=[Convert]::FromBase64String([Console]::In.ReadToEnd()); $protected=[Security.Cryptography.ProtectedData]::${operation}($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser); [Console]::Out.Write([Convert]::ToBase64String($protected))`;
 try {
  return Buffer.from(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{input:value.toString('base64'),encoding:'utf8',windowsHide:true,stdio:['pipe','pipe','pipe']}).trim(),'base64');
 } catch {throw new Error('Cannot unlock local records for this operating-system account');}
}
export function createLocalStateCodec(file:string,portable=false) {
 const keyFile=file+'.key';
 fs.mkdirSync(path.dirname(file),{recursive:true});
 let key:Buffer;
 if(fs.existsSync(keyFile))key=portable?fs.readFileSync(keyFile):protectKey(fs.readFileSync(keyFile),true);
 else {key=randomBytes(32);fs.writeFileSync(keyFile,portable?key:protectKey(key),{flag:'wx',mode:0o600});}
 if(key.length!==32)throw new Error('Invalid local data key');
 return {
  encrypt(value:string):Buffer {const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);const encrypted=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return Buffer.concat([Buffer.from('KND1'),iv,cipher.getAuthTag(),encrypted]);},
  decrypt(value:Buffer):string {if(value.subarray(0,4).toString()!=='KND1')throw new Error('Invalid encrypted local records');const cipher=createDecipheriv('aes-256-gcm',key,value.subarray(4,16));cipher.setAuthTag(value.subarray(16,32));return Buffer.concat([cipher.update(value.subarray(32)),cipher.final()]).toString('utf8');},
 };
}
