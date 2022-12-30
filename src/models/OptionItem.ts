export interface OptionItem<T = any> {
  icon?: string
  image?: string
  video?: string
  label: string
  desc?: string
  externalUrl?: string
  value: T
}
