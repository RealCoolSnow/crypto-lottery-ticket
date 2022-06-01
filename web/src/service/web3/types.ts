export interface WalletInfo {
  signer: any
  address: string
  chainId: number
  network: object
  balance: string //eth balance
}
// --- event ---
export interface ConnectInfo {
  chainId: string
}

export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export interface ProviderMessage {
  type: string
  data: unknown
}

export enum Web3Error {
  WalletNotConnected = 'Wallet not connected',
}

export enum Web3Event {
  Provider_Connect = 'connect',
  Provider_Disconnect = 'disconnect',
  Provider_AccountsChanged = 'accountsChanged',
  Provider_ChainChanged = 'chainChanged',
  Provider_Message = 'message',
  //----custom event
  Connecting = 'connecting',
}
