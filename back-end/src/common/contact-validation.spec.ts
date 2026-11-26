import { ContactValidationPipe } from './contact-validation.pipe';
describe('Contact validation across request bodies',()=>{
  const pipe=new ContactValidationPipe();
  const body={type:'body' as const};
  it('accepts valid email providers and exactly ten Indian mobile digits',()=>{
    for(const email of ['name@gmail.com','name+tag@outlook.com','person@community.org'])expect(()=>pipe.transform({email,contactPhone:'6123456789'},body)).not.toThrow();
    for(const phone of ['7123456789','8123456789','9123456789'])expect(()=>pipe.transform({buyerPhone:phone},body)).not.toThrow();
  });
  it('rejects malformed phone/email fields in nested and inline payloads',()=>{
    for(const phone of ['5123456789','123','+919812345678','98123 45678','98abc12345678'])expect(()=>pipe.transform({contact:{phone}},body)).toThrow(/10 digits/);
    for(const email of ['bad@','a@@b.com','a b@gmail.com','.bad@gmail.com'])expect(()=>pipe.transform({recipientEmail:email},body)).toThrow(/valid email/);
    expect(pipe.transform({phone:'',recipientEmail:undefined},body)).toEqual({phone:'',recipientEmail:undefined});
  });
});
