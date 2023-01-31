export interface FormRequest {
  name: string
  symbol: string
  address: string
  chainId: number
  icon: string
  about: string
  website: string
  email: string
  telegram?: string
  discord?: string
  includeHub: boolean
  includeSoy: boolean
  includeBridge: boolean
  securityAudit: string
  securityAuditUrl: string
  createFarm: boolean
  farmToken: string
  farmDuration: number
  farmMultiplier: string
  payment: {
    price: any
    soyPrice: number
    destination: string
    txHash: string
  }
  vlidationOnly: boolean
}
