import Web3Modal from 'web3modal'
import { getChainData } from './helper/utilities'
import { getProviderOptions } from './provider'

class MyWeb3 {
  private static instance: MyWeb3
  private web3Modal: Web3Modal
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
  }
  private subscribeProvider = (provider: any) => {
    if (!provider.on) {
      return
    }
    provider.on('close', () => {})
    provider.on('accountsChanged', async (accounts: string[]) => {
      // await this.setState({ address: accounts[0] })
      // await this.getAccountAssets()
    })
    provider.on('chainChanged', async (chainId: number) => {
      // const { web3 } = this.state
      // const networkId = await web3.eth.net.getId()
      // await this.setState({ chainId, networkId })
      // await this.getAccountAssets()
    })

    provider.on('networkChanged', async (networkId: number) => {
      // const { web3 } = this.state
      // const chainId = await web3.eth.chainId()
      // await this.setState({ chainId, networkId })
      // await this.getAccountAssets()
    })
  }
}

export default MyWeb3
