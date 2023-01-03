# Callisto assets list library

This package contains multi chain asset lists with Tokens and NFTs

> The package is created with TSDX tool

## How to use
1. Install the package
`npm i @callisto-enterprice/assetslist`

1. Get Token or NFT asset list for each supported chain, e.g.
```ts
import { CALLISTO_CHAIN_ID } from '@callisto-enterprise/chain-constants'
import { NFTLIST, TOKENLIST } from '@callisto-enterprise/assetslist'

const mainnetTokens = TOKENLIST[CALLISTO_CHAIN_ID.Mainnet] // or just 820
const mainnetNFTs = NFTLIST[CALLISTO_CHAIN_ID.Mainnet]
```

Here is the structure of the Asset interface
```ts
export interface Asset {
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
export interface AssetNFT extends Asset {
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

## Commands

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`. If testing misbehaves, run `npx jest --clearCache`.

_Note about DeprecationWarning [DEP0148]: tslib library, referenced by tsdx, has deprecated "./" key in package.json, see discussion in [github](https://github.com/microsoft/tslib/issues/134). No safe fix was identified, manual edit within node_modules can be a temporary solution._

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### Contribution
If you would like to add new Token or NFT collection, or fix some image assets feel free to create a new PR.