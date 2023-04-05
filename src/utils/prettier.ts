import type { BuiltInParserName } from 'prettier'
import { isElectron } from '../env'

export async function prettierCode(code: string, parser: BuiltInParserName) {
  if (!isElectron)
    return code
  try {
    const prettier = await import('prettier')
    return prettier.format(code, {
      parser,
      semi: false,
      singleQuote: true,
      //   ...TODO: add user settings
    })
  }
  catch (e) {
    return code
  }
}
