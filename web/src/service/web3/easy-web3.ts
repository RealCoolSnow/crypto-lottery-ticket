import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { EventBus, Registry } from './helper/event-bus'
import { getChainData } from './helper/utilities'
import {
  ConnectInfo,
  ProviderMessage,
  ProviderRpcError,
  WalletInfo,
  Web3Callback,
  Web3Error,
  Web3EventType,
  Web3Event,
  ConnectState,
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
  private connectState: ConnectState = ConnectState.Disconnected

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
      if (this.connectState !== ConnectState.Disconnected) {
        return
      }
      this.connectState = ConnectState.Connecting
      EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Connecting,
      })
      if (!this.web3) {
        const provider = await this.web3Modal.connect()
        await this.subscribeProvider(provider)
        this.web3 = new ethers.providers.Web3Provider(provider)
      }
      await this.updateWalletInfo()
      this.connectState = ConnectState.Connected
      EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Connect,
      })
    } catch (error) {
      console.log(TAG, 'connectWallet', error)
      EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Disconnect,
      })
    }
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
    // provider.on('close', () => {
    //   console.log(TAG, 'close')
    //   this.clearAll()
    // })
    provider.on(
      Web3EventType.Provider_AccountsChanged,
      async (accounts: string[]) => {
        console.log(TAG, Web3EventType.Provider_AccountsChanged, accounts)
        if (accounts.length <= 0) {
          this.connectState = ConnectState.Disconnected
          EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
            type: Web3EventType.Provider_Disconnect,
          })
        } else {
          await this.updateWalletInfo()
        }
        EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
          type: Web3EventType.Provider_AccountsChanged,
          data: accounts,
        })
      },
    )
    provider.on(Web3EventType.Provider_Connect, async (info: ConnectInfo) => {
      console.log(TAG, Web3EventType.Provider_Connect, info)
      this.connectState = ConnectState.Connected
      await this.updateWalletInfo()
      EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Connect,
        data: info,
      })
    })

    provider.on(
      Web3EventType.Provider_Disconnect,
      (error: ProviderRpcError) => {
        console.log(TAG, Web3EventType.Provider_Disconnect, error)
        this.connectState = ConnectState.Disconnected
        EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
          type: Web3EventType.Provider_Disconnect,
          data: error,
        })
      },
    )

    provider.on(
      Web3EventType.Provider_ChainChanged,
      async (chainId: string) => {
        console.log(TAG, Web3EventType.Provider_ChainChanged, chainId)
        await this.updateWalletInfo()
        EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
          type: Web3EventType.Provider_ChainChanged,
          data: chainId,
        })
      },
    )
    provider.on(Web3EventType.Provider_Message, (message: ProviderMessage) => {
      console.log(TAG, Web3EventType.Provider_Message, message)
      EventBus.getInstance().dispatch<Web3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Message,
        data: message,
      })
    })
  }
  /**
   *
   * @param cb (event:Web3Event, data?:any) => {}
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
   *
   * @returns
   */
  public getConnectState(): ConnectState {
    return this.connectState
  }
  /**
   *
   * @returns
   */
  public getWallet(): WalletInfo {
    return this.wallet
  }
  /**
   * short address (like 0xa2C...F6f9)
   * @param addr - wallet address
   * @returns
   */
  public getAddressShort(addr?: string): string {
    const address = addr || this.wallet.address
    if (address.length > 10)
      return `${address.slice(0, 5)}...${address.slice(-4)}`
    return address
  }
  
  /**
   * update wallet info
   */
  private async updateWalletInfo() {
    const signer = this.web3.getSigner()
    this.wallet.signer = signer
    this.wallet.address = await signer.getAddress()
    this.wallet.chainId = await signer.getChainId()
    this.wallet.network = await this.web3.getNetwork()
    this.wallet.balance = await this.getBalance()
    console.log(TAG, 'updateWalletInfo', this.wallet)
  }
  /**
   * clear
   */
  private async clearAll() {
    this.web3Modal.clearCachedProvider()
  }
}

export { EasyWeb3, DEFAULT_WALLET_INFO }
export type { Web3Event, Web3Callback }
