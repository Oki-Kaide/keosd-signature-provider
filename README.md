# Keosd Signature Provider
# Installation

NPM
```
npm i @proton/keosd-signature-provider
```

YARN
```
yarn add @proton/keosd-signature-provider
```

# Usage
```
import { JsonRpc, Api } from '@proton/js'
import { KeosdSignatureProvider } from '@proton/keosd-signature-provider'

const rpc = new JsonRpc(['https://proton.eoscafeblock.com'])
const api = new Api({ rpc, signatureProvider: new KeosdSignatureProvider() })
```