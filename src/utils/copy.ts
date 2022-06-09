import copyText from 'copy-text-to-clipboard'
import { userConfig } from '../store'

export function copyName(icon: string) {
  return copyText(userConfig.value['Name copying mode'].prefix + icon)
}
