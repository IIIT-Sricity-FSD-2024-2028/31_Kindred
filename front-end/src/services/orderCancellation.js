export function canCancelOrder(order,now=Date.now()){
 const created=Date.parse(order.createdAt),age=now-created;
 return Number.isFinite(created)&&age>=0&&age<60*60*1000&&['awaiting_admin_assignment','assigned'].includes(order.deliveryStatus);
}
