import { useTranslation } from 'react-i18next'

const ConnectWallet = () => {
  const { t } = useTranslation()
  const onConnect = () => {}
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
