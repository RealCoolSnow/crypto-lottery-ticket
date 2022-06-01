import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { getChainData } from './helper/utilities'
import { getProviderOptions } from './provider'

const TAG = 'MyWeb3'

class MyWeb3 {
  private static instance: MyWeb3
  private web3Modal: Web3Modal
  private web3: any //Web3Provider
  private signer: any
  private chainId = 1
  public static getInstance(): MyWeb3 {
    if (!MyWeb3.instance) {
      MyWeb3.instance = new MyWeb3()
    }
    return MyWeb3.instance
  }
  private constructor() {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    })
  }
  public getNetwork = () => getChainData(this.chainId).network
  /**
   * connect to wallet
   */
  public connectWallet = async () => {
    const provider = await this.web3Modal.connect()
    await this.subscribeProvider(provider)
    await provider.enable()
    this.web3 = new ethers.providers.Web3Provider(provider)
    this.signer = this.web3.getSigner()
    console.log(TAG, 'connectWallet', this.signer)
  }

  /**
   * subscribe provider event
   * @param provider
   * @returns
   */
  private subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return
    }
    provider.on('close', () => {
      console.log(TAG, 'close')
    })
    provider.on('accountsChanged', async (accounts: string[]) => {
      console.log(TAG, 'accountsChanged', accounts)
      // await this.setState({ address: accounts[0] })
      // await this.getAccountAssets()
    })
    provider.on('chainChanged', async (chainId: number) => {
      console.log(TAG, 'chainChanged', chainId)
      // const { web3 } = this.state
      // const networkId = await web3.eth.net.getId()
      // await this.setState({ chainId, networkId })
      // await this.getAccountAssets()
    })

    provider.on('networkChanged', async (networkId: number) => {
      console.log(TAG, 'networkChanged', networkId)
      // const { web3 } = this.state
      // const chainId = await web3.eth.chainId()
      // await this.setState({ chainId, networkId })
      // await this.getAccountAssets()
    })

    provider.on('connect', async (info: { chainId: number }) => {
      console.log(TAG, 'connect', info)
    })

    // Subscribe to provider disconnection
    provider.on(
      'disconnect',
      async (error: { code: number; message: string }) => {
        console.log(TAG, 'disconnect', error)
      },
    )
  }
}

export default MyWeb3
