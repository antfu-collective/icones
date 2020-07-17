/* eslint-disable no-undef */
import type JSZip from 'jszip'
import type Iconify from '@iconify/iconify'

declare global {
  interface Window {
    Iconify: typeof Iconify
    JSZip: JSZip
    SvgPacker: (options: any) => Promise<any>
  }
}
