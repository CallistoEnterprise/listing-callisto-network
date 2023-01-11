import type { Ref } from 'vue'

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

export const isFormValid = (fields: Ref[]) => {
  let isValid = true
  for (const f of fields) {
    f.value?.validate()
    if (!f.value?.isValid)
      isValid = false
  }
  return isValid
}

export const createBase64Image = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = err => reject(err)
    reader.onabort = err => reject(err)

    reader.readAsDataURL(file)
  })
}
