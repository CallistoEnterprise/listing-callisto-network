export const indexOfEnd = (string: string, needle: string): number => {
  const index = string.indexOf(needle)
  return index === -1 ? -1 : index + needle.length
}

export const getTxUrl = (txHash: string): string => `https://explorer.callisto.network/tx/${txHash}`

export const parseNumber = (value: any): number => {
  try {
    return parseFloat(value.toString())
  }
  catch (error) {
    return 0
  }
}
