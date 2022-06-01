import { ConnectState, useEasyWeb3 } from '@/service/web3'
import { CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'

const ConnectWallet = () => {
  const { t } = useTranslation()
  const { easyWeb3, connectState, walletInfo } = useEasyWeb3()
  const onConnect = () => {
    easyWeb3.connectWallet()
  }
  return (
    <>
      {connectState == ConnectState.Disconnected && (
        <button
          className="text-sm bg-primary text-white px-6 py-2 btn rounded-full flex shadow shadow-gray-500/50"
          onClick={onConnect}
        >
          <span>{t('connect')}</span>
          <span className="hidden sm:block sm:ml-1">{t('wallet')}</span>
        </button>
      )}
      {connectState == ConnectState.Connecting && (
        <CircularProgress color="secondary" size="1.2rem" />
      )}
      {connectState == ConnectState.Connected && (
        <div className="flex flex-col items-center">
          <span className="text-primary">
            {easyWeb3.getAddressShort(walletInfo.address)}
          </span>
          <span className="text-sm">
            {easyWeb3.getBalanceShort(walletInfo.balance)}&nbsp;ETH
          </span>
        </div>
      )}
    </>
  )
}

export default ConnectWallet
