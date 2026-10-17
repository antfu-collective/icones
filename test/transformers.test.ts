import { describe, expect, it } from 'vitest'
import {
  ClearSvg,
  normalizeZipFleName,
  SvgToAstro,
  SvgToDataURL,
  SvgToJSX,
  SvgToQwik,
  SvgToReactNative,
  SvgToSolid,
  SvgToSvelte,
  SvgToTSX,
  SvgToVue,
  toComponentName,
} from '../src/utils/svg/transformers'

const fixtures = {
  simple: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 22h20z"/></svg>',
  attrs: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill-opacity=".3"/><path clip-path="url(#a)" d="M12 6v6l4 2"/></g><!-- comment --></svg>',
}

describe('utils', () => {
  it('toComponentName', () => {
    expect(toComponentName('mdi:account-box_outline')).toMatchInlineSnapshot(`"MdiAccountBoxOutline"`)
  })
  it('normalizeZipFleName', () => {
    expect(normalizeZipFleName('mdi:account')).toMatchInlineSnapshot(`"mdi-account"`)
  })
})

for (const [key, svg] of Object.entries(fixtures)) {
  describe(`transformers: ${key}`, () => {
    const name = 'TestIcon'
    it('clearSvg', () => {
      expect(ClearSvg(svg)).toMatchSnapshot('default')
      expect(ClearSvg(svg, true)).toMatchSnapshot('reactJSX')
      expect(ClearSvg(svg, false, true)).toMatchSnapshot('skipJSXTransform')
    })
    it('svgToDataURL', () => {
      expect(SvgToDataURL(svg)).toMatchSnapshot()
    })
    it('svgToSvelte', () => {
      expect(SvgToSvelte(svg)).toMatchSnapshot()
    })
    it('svgToAstro', () => {
      expect(SvgToAstro(svg)).toMatchSnapshot()
    })
    for (const snippet of [true, false]) {
      it(`components (snippet: ${snippet})`, async () => {
        expect(await SvgToJSX(svg, name, snippet)).toMatchSnapshot('jsx')
        expect(await SvgToTSX(svg, name, snippet)).toMatchSnapshot('tsx')
        expect(await SvgToTSX(svg, name, snippet, false)).toMatchSnapshot('tsx-no-react-jsx')
        expect(await SvgToQwik(svg, name, snippet)).toMatchSnapshot('qwik')
        expect(await SvgToSolid(svg, name, snippet)).toMatchSnapshot('solid')
        expect(await SvgToReactNative(svg, name, snippet)).toMatchSnapshot('react-native')
      })
    }
    it('svgToVue', async () => {
      expect(await SvgToVue(svg, name)).toMatchSnapshot('js')
      expect(await SvgToVue(svg, name, true)).toMatchSnapshot('ts')
    })
  })
}
