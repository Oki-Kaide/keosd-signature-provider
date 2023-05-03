import * as net from 'net';
import * as os from 'os';

/** export constANTS */
export const DEFAULT_WALLET_NAME = 'default';

export const sockCall = async ({
  endpoint,
  body = '',
  wallet_url = `/${os.homedir()}/eosio-wallet/keosd.sock`,
}: {
  endpoint: string;
  body: string | object;
  wallet_url?: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(wallet_url);

    client.on('connect', () => {
      const bodyString = body ? JSON.stringify(body) : '';
      let s = '';
      s += `POST ${endpoint} HTTP/1.0\r\n`;
      s += `Host: ${wallet_url}:\r\n`;
      s += 'Accept: */*\r\n';
      s += `content-length: ${bodyString.length}\r\n`;
      s += 'Connection: close\r\n';
      s += '\r\n';
      s += bodyString;
      client.write(s);
    });

    client.on('data', (data: any) => {
      const dataString = data.toString();
      const dataSplit = dataString.split('\n');

      let parsed: any;
      if (dataSplit.length) {
        parsed = JSON.parse(dataSplit[dataSplit.length - 1]);
        if (parsed.code === 500) {
          reject(parsed);
        }
      }

      resolve(parsed);
    });

    client.on('error', error => {
      reject(error);
    });
  });
};
export const wallet_create = async (
  wallet_name: string = DEFAULT_WALLET_NAME
) => {
  return await sockCall({ endpoint: '/v1/wallet/create', body: wallet_name });
};
export const wallet_open = async (
  wallet_name: string = DEFAULT_WALLET_NAME
) => {
  return await sockCall({ endpoint: '/v1/wallet/open', body: wallet_name });
};
export const wallet_list_wallets = async () => {
  return await sockCall({ endpoint: '/v1/wallet/list_wallets', body: '' });
};
export const wallet_list_private_keys = async (
  wallet_name: string = DEFAULT_WALLET_NAME,
  wallet_pw: string
) => {
  return await sockCall({
    endpoint: '/v1/wallet/list_keys',
    body: [wallet_name, wallet_pw],
  });
};
export const wallet_list_public_keys = async () => {
  return await sockCall({ endpoint: '/v1/wallet/get_public_keys', body: '' });
};
export const wallet_lock = async (
  wallet_name: string = DEFAULT_WALLET_NAME
) => {
  return await sockCall({ endpoint: '/v1/wallet/lock', body: wallet_name });
};
export const wallet_lock_all = async () => {
  return await sockCall({ endpoint: '/v1/wallet/lock_all', body: '' });
};
export const wallet_unlock = async (
  wallet_name: string = DEFAULT_WALLET_NAME,
  wallet_pw: string
) => {
  return await sockCall({
    endpoint: '/v1/wallet/unlock',
    body: [wallet_name, wallet_pw],
  });
};
export const wallet_import_key = async (
  wallet_name: string = DEFAULT_WALLET_NAME,
  wallet_key: string
) => {
  return await sockCall({
    endpoint: '/v1/wallet/import_key',
    body: [wallet_name, wallet_key],
  });
};
export const wallet_remove_key = async (
  wallet_name: string = DEFAULT_WALLET_NAME,
  wallet_pw: string,
  wallet_rm_key_str: string
) => {
  return await sockCall({
    endpoint: '/v1/wallet/remove_key',
    body: [wallet_name, wallet_pw, wallet_rm_key_str],
  });
};
export const wallet_create_key = async (
  wallet_name: string = DEFAULT_WALLET_NAME,
  wallet_create_key_type: string = ''
) => {
  return await sockCall({
    endpoint: '/v1/wallet/create_key',
    body: [wallet_name, wallet_create_key_type],
  });
};
export const wallet_sign_transaction = async (
  transaction: any,
  requiredKeys: string[],
  chainId: string
) => {
  return await sockCall({
    endpoint: '/v1/wallet/sign_transaction',
    body: [transaction, requiredKeys, chainId],
  });
};
export const keosd_stop = async () => {
  return await sockCall({ endpoint: '/v1/keosd/stop', body: '' });
};
