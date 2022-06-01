import { EasyWeb3, Registry, Web3Callback, Web3Event } from '@/service/web3'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ConnectWallet = () => {
  const { t } = useTranslation()
  const myWeb3 = EasyWeb3.getInstance()
  let registry: Registry
  const web3Callback: Web3Callback = (event: Web3Event) => {
    console.log('web3Callback', event)
  }
  useEffect(() => {
    registry = myWeb3.registerEvent(web3Callback)
    myWeb3.connectWalletIfCached()
    return () => {
      myWeb3.unregisterEvent(registry)
    }
  }, [])
  const onConnect = () => {
    myWeb3.connectWallet()
  }
  return (
    <>
      <button
        className="text-sm bg-primary text-white px-6 py-2 btn rounded-full flex shadow shadow-gray-500/50"
        onClick={onConnect}
      >
        <span>{t('connect')}</span>
        <span className="hidden sm:block sm:ml-1">{t('wallet')}</span>
      </button>
    </>
  )
}

export default ConnectWallet
