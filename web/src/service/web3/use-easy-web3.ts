import { useEffect, useState } from 'react'
import { DEFAULT_WALLET_INFO, EasyWeb3, Web3Callback } from './easy-web3'
import { Registry } from './helper/event-bus'
import { ConnectState, Web3Event } from './types'

export const useEasyWeb3 = (cb?: Web3Callback) => {
  const [connectState, setConnectState] = useState(ConnectState.Disconnected)
  const [walletInfo, setWalletInfo] = useState(DEFAULT_WALLET_INFO)
  const easyWeb3 = EasyWeb3.getInstance()
  let registry: Registry
  const web3Callback: Web3Callback = (e: Web3Event) => {
    setConnectState(easyWeb3.getConnectState())
    setWalletInfo({ ...easyWeb3.getWallet() })
    cb && cb(e)
  }
  useEffect(() => {
    registry = easyWeb3.registerEvent(web3Callback)
    easyWeb3.connectWalletIfCached()
    return () => {
      easyWeb3.unregisterEvent(registry)
    }
  }, [])
  return { easyWeb3, connectState, walletInfo }
}
