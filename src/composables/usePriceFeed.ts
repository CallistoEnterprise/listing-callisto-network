import { Contract, ethers } from 'ethers'
import { nodeProvider } from './web3/nodeProvider'
import priceFeedAbi from '~/contracts/abi/cloPriceFeed.json'

const cloPrice = ref<number>(0)
const soyPrice = ref<number>(0)

const priceFeed = new Contract('0x9bFc3046ea26f8B09D3E85bd22AEc96C80D957e3', priceFeedAbi, nodeProvider.value)

const parseNumber = (value: any): number => {
  try {
    return parseFloat(value.toString())
  }
  catch (error) {
    return 0
  }
}

const fetchTokenPrices = async () => {
  const [clo, soy] = await Promise.all([
    await priceFeed.getPrice('0x0000000000000000000000000000000000000001'),
    await priceFeed.getPrice(import.meta.env.VITE_SOY_ADDR),
  ])

  cloPrice.value = parseNumber(ethers.utils.formatUnits(clo, 18))
  soyPrice.value = parseNumber(ethers.utils.formatUnits(soy, 18))
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

