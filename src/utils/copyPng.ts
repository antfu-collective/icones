export function copyPng(svg: string, color: string): Promise<void> {
  return new Promise((resolve) => {
    const containerDiv = document.createElement('div')
    containerDiv.innerHTML = svg
    // Now we have a DOM element:
    const svgEl: SVGElement = containerDiv.querySelector('svg')!
    svgEl.setAttribute('style', `color: ${color};`)
    const data: string = new XMLSerializer().serializeToString(svgEl)
    const svgBlob: Blob = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const src = URL.createObjectURL(svgBlob)
    toPng(src).then(async (image) => {
      navigator.clipboard
        .write([
          new ClipboardItem({
            'image/png': await toBlob(image),
          }),
        ])
        .then(resolve)
    })
    function toBlob(dataurl: string) {
      return fetch(dataurl).then(r => r.blob())
    }
    function toPng(svg: string): Promise<string> {
      class SvgToPngConverter {
        canvas: HTMLCanvasElement | null
        imgPreview: HTMLImageElement | null
        canvasCtx: CanvasRenderingContext2D | null
        constructor() {
          this.canvas = null
          this.imgPreview = null
          this.canvasCtx = null

          this._init = this._init.bind(this)
          this._cleanUp = this._cleanUp.bind(this)
          this.convertFromInput = this.convertFromInput.bind(this)
        }

        _init(): void {
          this.canvas = document.createElement('canvas')
          this.imgPreview = document.createElement('img')
          this.imgPreview.setAttribute(
            'style',
            'position: absolute; top: -9999px',
          )

          document.body.appendChild(this.imgPreview)
          this.canvasCtx = this.canvas.getContext('2d')
        }

        _cleanUp(): void {
          if (this.imgPreview)
            document.body.removeChild(this.imgPreview)
        }

        convertFromInput(
          input: string,
          {
            width,
            height,
            scaleFactor = 2,
          }: {
            width: number | null
            height: number | null
            scaleFactor: number | null
          },
          callback: Function,
        ) {
          this._init()
          if (this.imgPreview) {
            this.imgPreview.onload = async () => {
              if (
                !this.imgPreview
                || !this.canvas
                || !(scaleFactor || (width && height))
              )
                return

              const img = new Image()
              const dimensions: { width: number, height: number }
                = await getDimensions(this.imgPreview.src)

              if (scaleFactor) {
                Object.assign(this.canvas, {
                  width: dimensions.width * scaleFactor,
                  height: dimensions.height * scaleFactor,
                })
              }
              else if (width && height) {
                Object.assign(this.canvas, { width, height })
              }
              img.crossOrigin = 'anonymous'
              img.src = this.imgPreview.src
              img.onload = () => {
                if (!this.canvasCtx || !this.canvas)
                  return

                this.canvasCtx.drawImage(
                  img,
                  0,
                  0,
                  this.canvas.width,
                  this.canvas.height,
                )
                const imgData = this.canvas.toDataURL('image/png')
                if (typeof callback == 'function')
                  callback(imgData)

                this._cleanUp()
              }

              function getDimensions(
                src: string,
              ): Promise<{ width: number, height: number }> {
                return new Promise((resolve) => {
                  const _img = new Image()
                  _img.src = src
                  _img.onload = () => {
                    resolve({
                      width: _img.naturalWidth,
                      height: _img.naturalHeight,
                    })
                  }
                })
              }
            }

            this.imgPreview.src = input
          }
        }
      }
      return new Promise((resolve) => {
        // Make a 32x32px icon be 256x256
        new SvgToPngConverter().convertFromInput(
          svg,
          { scaleFactor: 256 / 32, width: null, height: null },
          resolve,
        )
      })
    }
  })
}
