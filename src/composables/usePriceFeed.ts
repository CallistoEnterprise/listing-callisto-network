import { Contract, ethers } from 'ethers'
import { nodeProvider } from './web3/nodeProvider'
import priceFeedAbi from '~/contracts/abi/cloPriceFeed.json'

const cloPrice = ref<number>(0)
const soyPrice = ref<number>(0)

const priceFeed = new Contract(import.meta.env.VITE_PRICE_FEED_ADDR, priceFeedAbi, nodeProvider.value)

const parseNumber = (value: any): number => {
  try {
    return parseFloat(value.toString())
  }
  catch (error) {
    return 0
  }
}

const fetchTokenPrices = async () => {
  const { isMainnet } = useWallet()

  if (isMainnet.value) {
    const [clo, soy] = await Promise.all([
      await priceFeed.getPrice('0x0000000000000000000000000000000000000001'),
      await priceFeed.getPrice(import.meta.env.VITE_SOY_ADDR),
    ])
    cloPrice.value = parseNumber(ethers.utils.formatUnits(clo, 18))
    soyPrice.value = parseNumber(ethers.utils.formatUnits(soy, 18))
  }
  else {
    cloPrice.value = 1
    soyPrice.value = 1
  }
}

watch(nodeProvider, async (newProvider) => {
  if (!newProvider)
    return

  await fetchTokenPrices()

  nodeProvider.value.removeAllListeners()
  nodeProvider.value.on('block', () => fetchTokenPrices())
}, { immediate: true })

export default function usePriceFeed() {
  return {
    cloPrice: readonly(cloPrice),
    soyPrice: readonly(soyPrice),
  }
}

