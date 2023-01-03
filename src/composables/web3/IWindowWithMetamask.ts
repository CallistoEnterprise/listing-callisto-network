import type { BaseProvider } from '@metamask/providers'

export interface IMetamask extends BaseProvider {
  isMetaMask: boolean
  _metamask: {
    isUnlocked(): Promise<boolean>
  }
}

export interface IWindowWithMetamask extends Window {
  ethereum: IMetamask
}
