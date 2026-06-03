import type { BuiltInParserName } from 'prettier'

export async function prettierCode(code: string, _parser: BuiltInParserName) {
  return code
}
