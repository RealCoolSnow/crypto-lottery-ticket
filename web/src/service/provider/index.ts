import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Torus from "@toruslabs/torus-embed";

const getProviderOptions = () => {
  const infuraId = process.env.VITE_INFURA_ID
  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
    },
    torus: {
      package: Torus,
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'CRP',
        infuraId,
      },
    },
  }
  return providerOptions
}

export { getProviderOptions }
