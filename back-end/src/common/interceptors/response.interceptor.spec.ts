import { of, firstValueFrom } from 'rxjs';
import { ExecutionContext } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  const interceptor = new ResponseInterceptor();
  const intercept = (value: unknown) => firstValueFrom(interceptor.intercept({} as ExecutionContext, { handle: () => of(value) }));

  it('keeps controller lists at data when a message is omitted', async () => {
    const records = [{ id: 'org_001', name: 'HopeConnect' }];
    expect(await intercept({ success: true, data: records })).toEqual({ success: true, data: records, message: 'Operation completed successfully' });
  });

  it('preserves an existing response and message', async () => {
    const response = { success: true, data: { verifiedTotal: 750 }, message: 'Balance retrieved' };
    expect(await intercept(response)).toEqual(response);
  });

  it('preserves failed business responses', async () => {
    expect(await intercept({ success: false, data: null, message: 'Unavailable' })).toEqual({ success: false, data: null, message: 'Unavailable' });
  });

  it('wraps raw controller data once', async () => {
    expect(await intercept([1, 2])).toEqual({ success: true, data: [1, 2], message: 'Operation completed successfully' });
  });
});
