import test from 'node:test';
import assert from 'node:assert/strict';
import {canCancelOrder} from '../../src/services/orderCancellation.js';

test('order cancellation expires exactly one hour after purchase and remains blocked after pickup',()=>{
 const created=Date.parse('2026-11-02T10:00:00Z'),order={createdAt:new Date(created).toISOString(),deliveryStatus:'assigned'};
 assert.equal(canCancelOrder(order,created),true);
 assert.equal(canCancelOrder(order,created+3599999),true);
 assert.equal(canCancelOrder(order,created+3600000),false);
 assert.equal(canCancelOrder(order,created-1),false);
 assert.equal(canCancelOrder({...order,deliveryStatus:'picked_up'},created+1000),false);
 assert.equal(canCancelOrder({...order,createdAt:'invalid'},created),false);
});
