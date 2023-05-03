import { JsonRpc, Api } from '@proton/js';
import { KeosdSignatureProvider } from '../src';

describe('normal function', () => {
  it('works', () => {
    const rpc = new JsonRpc(['https://proton.eoscafeblock.com']);
    const api = new Api({
      rpc,
      signatureProvider: new KeosdSignatureProvider(),
    });
    expect(!!api);
  });
});
