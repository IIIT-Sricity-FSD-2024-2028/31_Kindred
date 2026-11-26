export function deliveryArea(address:string,fallback:string){
  const parts=address.split(',').map(part=>part.trim()).filter(Boolean);
  const last=parts.at(-1)?.replace(/\b\d{6}\b/g,'').trim();
  if(last&&!/\d/.test(last)&&last.length<=60&&(parts.length>1||last.split(/\s+/).length<=3))return last;
  return fallback;
}
