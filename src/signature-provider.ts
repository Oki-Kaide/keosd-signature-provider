import {
  ApiInterfaces,
  RpcInterfaces,
  Serialize,
  transactionAbi,
} from '@proton/js';
import * as Keosd from './keosd-sock';

const transactionTypes = Serialize.getTypesFromAbi(
  Serialize.createInitialTypes(),
  transactionAbi
);

const deserialize = (buffer: Serialize.SerialBuffer, type: string) => {
  return transactionTypes.get(type)!.deserialize(buffer);
};
const deserializeTransaction = (transaction: Uint8Array) => {
  const buffer = new Serialize.SerialBuffer();
  buffer.pushArray(transaction);
  return deserialize(buffer, 'transaction');
};

/** Signs transactions using in-process private keys */
export class KeosdSignatureProvider implements ApiInterfaces.SignatureProvider {
  /** Public keys associated with the private keys that the `SignatureProvider` holds */
  public async getAvailableKeys() {
    return Keosd.wallet_list_public_keys();
  }

  /** Sign a transaction */
  public async sign({
    chainId,
    requiredKeys,
    serializedTransaction,
    serializedContextFreeData,
  }: ApiInterfaces.SignatureProviderArgs): Promise<
    RpcInterfaces.PushTransactionArgs
  > {
    const transaction = deserializeTransaction(serializedTransaction);
    const { signatures } = await Keosd.wallet_sign_transaction(
      transaction,
      requiredKeys,
      chainId
    );
    return {
      signatures,
      serializedTransaction,
      serializedContextFreeData,
    };
  }
}
