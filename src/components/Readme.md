# Callisto assets list library

This package contains multi chain asset lists with Tokens and NFTs

## How to use

1. Install the package
   `npm i @callisto-enterprice/assetslist`

1. Get Token or NFT asset list for each supported chain, e.g.

```ts
import {
  CallistAssetChainId,
  CallistoNftList,
  CallistoTokenList,
  getCallistoNFT,
  getCallistoToken,
} from '@callisto-enterprise/assetslist'

const mainnetTokens = CallistoTokenList[CallistAssetChainId.Mainnet] // or just 820
const mainnetNFTs = CallistoNftList[CallistAssetChainId.Mainnet]

// Or find any specific asset by address
const nft = getCallistoNFT('0x...', CallistAssetChainId.Mainnet)
const token = getCallistoToken('0x...', CallistAssetChainId.Mainnet)
```

Here is the structure of the Asset interface

```ts
export interface CallistoAsset {
  address: string
  category: AssetType // NATIVE, ERC20, ERC223, ERC721, ERC1155, CALLISTONFT
  name: string
  symbol: string
  image: string // for the NFT it could be a fallback image
  audit: {
    isAudited: boolean
    reportUrl?: string
    riskLevel?: string
  }
  decimals: number
  platforms: string[]
  projectUrl: string
}
```

Here is the structure of the AssetNFT interface which extends the Asset interface

```ts
export interface CallistoAssetNFT extends CallistoAsset {
  collectionName: string
  placeholderName?: string // usually when it is undefined, it is filled by Asset.name
  placeholderId?: string // it can be filled by the contract tokenId() during the parsing
  placeholderTitle?: string // it can be filled by collectionName during the parsing
  placeholderDescription?: string
  placeholderMedia?: string // it cann be filled by specific standard, for example for ERC721 is used tokenURI()
}
```

> The placeholder fields are used for the UI, especially for CallistoNFT standard, since we want to show different data accross different collections
> We decided to choose placeholder approach when the same UI placeholder can point to different NFT metadata
> as you can see at the image below

![NFT placeholder](https://asset.callisto.network/images/nft_placeholder.png)