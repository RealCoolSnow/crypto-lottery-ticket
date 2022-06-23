import React, { useEffect } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next'
import { ConnectState, useEasyWeb3 } from '@/service/web3'
import { ethers, Wallet } from 'ethers'
import { DAI_CONTRACT } from '@/service/web3/constants/contract-test'
import LotteryPool from '@/components/LotteryPool'
const toAddress = '0x75dbb972072fEB3CAd41f3d7b634b4305A208375'

const Index = () => {
  const { t } = useTranslation()
  const { connectState, easyWeb3, walletInfo } = useEasyWeb3()
  const getContract = () => {
    let erc20_rw: any = null
    if (easyWeb3.isConnected()) {
      if (walletInfo.chainId == 3) {
        const dai = DAI_CONTRACT[3]
        erc20_rw = new ethers.Contract(
          dai.address,
          dai.abi,
          easyWeb3.getSigner(),
        )
      } else {
        alert("Please switch to network 'ropsten'")
      }
    }
    return erc20_rw
  }

  useEffect(() => {
    console.log('app created')
  }, [])
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center pt-12">
          <LotteryPool />
        </div>
        {connectState == ConnectState.Connected && (<div>
          loggined
        </div>
        )}
      </div>
      {connectState == ConnectState.Disconnected && (
        <div className="flex items-center justify-center h-32 text-secondary">
          Please connect to wallet first.
        </div>
      )}
    </>
  )
}

export default Index
