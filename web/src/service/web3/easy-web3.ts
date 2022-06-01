import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { EventBus, Registry } from './helper/event-bus'
import { getChainData } from './helper/utilities'
import {
  ConnectInfo,
  ProviderMessage,
  ProviderRpcError,
  WalletInfo,
  Web3Error,
  Web3Event,
} from './types'

const TAG = 'EasyWeb3'

const DEFAULT_WALLET_INFO: WalletInfo = {
  signer: '',
  address: '',
  chainId: 1,
  network: {},
  balance: '0',
}

const WEB3_MESSAGE = 'web3-message'

interface IWeb3Event {
  event: Web3Event
  data?: any
}

type Web3Callback = (event: Web3Event) => void

/**
 * sample:
 *
 */
class EasyWeb3 {
  private static instance: EasyWeb3
  private web3Modal: Web3Modal
  private web3: any //Web3Provider
  private wallet: WalletInfo = DEFAULT_WALLET_INFO
  private chainId = 1
  private connecting = false
  public static getInstance(): EasyWeb3 {
    if (!EasyWeb3.instance) {
      EasyWeb3.instance = new EasyWeb3()
    }
    return EasyWeb3.instance
  }

  private constructor() {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      // providerOptions: getProviderOptions(),
    })
  }

  public getNetwork = () => getChainData(this.chainId).network

  /**
   * connect to wallet if cached before
   */
  public connectWalletIfCached(): void {
    if (this.web3Modal.cachedProvider) {
      this.connectWallet()
    }
  }
  /**
   * connect to wallet
   */
  public connectWallet = async (): Promise<void> => {
    try {
      if (this.connecting) {
        return
      }
      this.connecting = true
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        event: Web3Event.Connecting,
      })
      if (!this.web3) {
        const provider = await this.web3Modal.connect()
        await this.subscribeProvider(provider)
        await provider.enable()
        this.web3 = new ethers.providers.Web3Provider(provider)
      }
      const signer = this.web3.getSigner()
      this.wallet.signer = signer
      this.wallet.address = await signer.getAddress()
      this.wallet.chainId = await signer.getChainId()
      this.wallet.network = await this.web3.getNetwork()
      this.wallet.balance = await this.getBalance()
    } catch (error) {
      console.log(TAG, 'connectWallet', error)
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        event: Web3Event.Provider_Disconnect,
      })
    } finally {
      this.connecting = false
    }
    EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
      event: Web3Event.Provider_Connect,
    })
    console.log(TAG, 'connectWallet', this.wallet)
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
      this.clearAll()
    })
    provider.on(Web3Event.Provider_AccountsChanged, (accounts: string[]) => {
      console.log(TAG, Web3Event.Provider_AccountsChanged, accounts)
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        event: Web3Event.Provider_AccountsChanged,
        data: accounts,
      })
    })
    provider.on(Web3Event.Provider_Connect, (info: ConnectInfo) => {
      console.log(TAG, Web3Event.Provider_Connect, info)
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        event: Web3Event.Provider_Connect,
        data: info,
      })
    })

    provider.on(Web3Event.Provider_Disconnect, (error: ProviderRpcError) => {
      console.log(TAG, Web3Event.Provider_Disconnect, error)
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        event: Web3Event.Provider_Disconnect,
        data: error,
      })
    })

    provider.on(Web3Event.Provider_ChainChanged, (chainId: string) => {
      console.log(TAG, Web3Event.Provider_ChainChanged, chainId)
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        event: Web3Event.Provider_ChainChanged,
        data: chainId,
      })
    })
    provider.on(Web3Event.Provider_Message, (message: ProviderMessage) => {
      console.log(TAG, Web3Event.Provider_Message, message)
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        event: Web3Event.Provider_Message,
        data: message,
      })
    })
  }
  /**
   *
   * @param func (event:Web3Event, data?:any) => {}
   * @returns Registry
   */
  public registerEvent(cb: Web3Callback): Registry {
    return EventBus.getInstance().register(WEB3_MESSAGE, cb)
  }
  /**
   *
   * @param registry
   */
  public unregisterEvent(registry: Registry) {
    registry.unregister()
  }
  /**
   *
   * @returns ETH balance
   */
  public async getBalance() {
    if (this.wallet.signer) {
      const balance = await this.wallet.signer.getBalance()
      return ethers.utils.formatEther(balance)
    } else {
      throw new Error(Web3Error.WalletNotConnected)
    }
  }
  /**
   * clear
   */
  private async clearAll() {
    this.web3Modal.clearCachedProvider()
  }
}

export { EasyWeb3 }
export type { IWeb3Event, Web3Callback }
