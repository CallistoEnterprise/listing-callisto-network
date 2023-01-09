export interface FormRequest {
  name: string
  symbol: string
  address: string
  chainId: number
  about: string
  website: string
  email: string
  telegram?: string
  discord?: string
  includeHub: boolean
  includeSoy: boolean
  includeBridge: boolean
  securityAudit: boolean
  createFarm: boolean
  farmToken: string
  payment: {
    price: number
    soyPrice: number
    destination: string
    txHash: string
  }
}
