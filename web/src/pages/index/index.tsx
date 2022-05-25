import React, { useEffect } from 'react'
import Logo from '@/components/Logo'
import { showAlert } from '@/utils/util'
import { helloGet } from '@/service/api'
import './index.css'
import Counter from '@/components/Counter'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LocaleSwitch from '@/components/LocaleSwitch'

const Index = () => {
  const { t } = useTranslation()
  useEffect(() => {
    console.log('app created')
  }, [])
  const networkTest = () => {
    console.log('network')
    helloGet()
      .then((res) => {
        showAlert(res)
      })
      .catch((err) => {
        showAlert(err)
      })
  }
  return (
    <div className="flex flex-col items-center h-screen bg-gray-700">
      <LocaleSwitch />
      <Logo />
      {/* <img src="/logo.svg" className="w-40 h-40" alt="logo" /> */}
      <div className="flex items-center text-white">
        <Link to="/about" className="ml-6">
          {t('about')}
        </Link>
      </div>
      <div className="bg-white w-3/4 p-4 rounded mt-4">
        <Counter />
        <div onClick={networkTest} className="btn bg-blue-500 mt-2">
          Network Test
        </div>
      </div>
    </div>
  )
}

export default Index
