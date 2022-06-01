import { useEffect, useState } from 'react'
import { EasyWeb3, Web3Callback } from './easy-web3'
import { Registry } from './helper/event-bus'
import { ConnectState, Web3Event } from './types'

export const useEasyWeb3 = () => {
  const [connectState, setConnectState] = useState(ConnectState.Disconnected)
  const easyWeb3 = EasyWeb3.getInstance()
  let registry: Registry
  const web3Callback: Web3Callback = (e: Web3Event) => {
    setConnectState(easyWeb3.getConnectState())
  }
  useEffect(() => {
    registry = easyWeb3.registerEvent(web3Callback)
    easyWeb3.connectWalletIfCached()
    return () => {
      easyWeb3.unregisterEvent(registry)
    }
  }, [])
  return { easyWeb3, connectState }
}
