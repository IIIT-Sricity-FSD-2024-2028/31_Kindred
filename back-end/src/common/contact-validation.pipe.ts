import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEmail } from 'class-validator';
@Injectable()
export class ContactValidationPipe implements PipeTransform {
  transform(value:unknown,metadata:ArgumentMetadata) {
    if(metadata.type==='body')this.check(value);
    return value;
  }
  private check(value:unknown,path='') {
    if(!value||typeof value!=='object')return;
    for(const [key,item] of Object.entries(value)) {
      const field=path?`${path}.${key}`:key;
      if(item!==undefined&&item!==null&&item!=='') {
        if(/^(?:phone|mobile|donorPhone|buyerPhone|contactPhone|contactMobile|adminPhone)$/i.test(key)&& (typeof item!=='string'||item.length!==10||!/^[6-9]\d{9}$/.test(item)))throw new BadRequestException(`${field}: enter exactly 10 digits starting with 6, 7, 8, or 9`);
        if(/email$/i.test(key)&&(typeof item!=='string'||!isEmail(item)))throw new BadRequestException(`${field}: enter a valid email address`);
      }
      if(typeof item==='object')this.check(item,field);
    }
  }
}
