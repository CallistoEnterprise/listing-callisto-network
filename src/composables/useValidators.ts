import { ethers } from 'ethers'
import type BaseValidator from '~/models/BaseValidator'

const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g

export default function useValidators() {
  const minValidator = (min: number, suffix?: string): BaseValidator => ({ validator: (val: any): boolean => val && val >= min, message: `Minimal value is ${min} ${suffix}` } as BaseValidator)
  const minLengthValidator = (min: number): BaseValidator => ({ validator: (val: any): boolean => val && val.length >= min, message: `Write at least ${min} characters` } as BaseValidator)
  const maxValidator = (max: number, suffix?: string): BaseValidator => ({ validator: (val: any): boolean => val && val <= max, message: `Maximal value is ${max} ${suffix}` } as BaseValidator)
  const addressValidator = (): BaseValidator => ({ validator: (val: string) => val.includes('0x') && ethers.utils.isAddress(val ?? ''), message: 'Invalid address format' })
  const emailValidator = (): BaseValidator => ({ validator: (val: any): boolean => val && val.match(emailRegexp), message: 'Invalid e-mail address' } as BaseValidator)

  return {
    minValidator,
    minLengthValidator,
    maxValidator,
    addressValidator,
    emailValidator,
  }
}
