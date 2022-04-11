const copyImage = (svg: string, color: string): Promise<void> => {
  return new Promise((resolve) => {
    const containerDiv = document.createElement('div')
    containerDiv.innerHTML = svg
    // Now we have a DOM element:
    const svgEl: HTMLOrSVGElement = containerDiv.querySelector('svg')
    svgEl.setAttribute('style', `color: ${color};`)
    const data: string = new XMLSerializer().serializeToString(svgEl)
    const svgBlob: Blob = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const src = URL.createObjectURL(svgBlob)
    toPng(src).then((image) => {
      navigator.clipboard
        .write([
          new ClipboardItem({
            'image/png': await toBlob(image),
          }),
        ])
        .then(resolve)
    })
    function toBlob(dataurl) {
      return fetch(dataurl).then(r => r.blob())
    }
    function toPng(svg: string): Promise<string> {
      class SvgToPngConverter {
        constructor() {
          this._init = this._init.bind(this)
          this._cleanUp = this._cleanUp.bind(this)
          this.convertFromInput = this.convertFromInput.bind(this)
        }

        _init() {
          this.canvas = document.createElement('canvas')
          this.imgPreview = document.createElement('img')
          this.imgPreview.style = 'position: absolute; top: -9999px'

          document.body.appendChild(this.imgPreview)
          this.canvasCtx = this.canvas.getContext('2d')
        }

        _cleanUp() {
          document.body.removeChild(this.imgPreview)
        }

        convertFromInput(
          input,
          {
            width,
            height,
            scaleFactor = 2,
          }: { width: number; height: number; scaleFactor: numer },
          callback,
        ) {
          this._init()
          this.imgPreview.onload = async function() {
            const img = new Image()
            const dimensions: { width: number; height: number }
              = await getDimensions(this.imgPreview.src)

            this.canvas.width = width || dimensions.width * scaleFactor
            this.canvas.height = height || dimensions.height * scaleFactor
            img.crossOrigin = 'anonymous'
            img.src = this.imgPreview.src
            img.onload = () => {
              this.canvasCtx.drawImage(
                img,
                0,
                0,
                this.canvas.width,
                this.canvas.height,
              )
              const imgData = this.canvas.toDataURL('image/png')
              if (typeof callback == 'function') callback(imgData)

              this._cleanUp()
            }

            function getDimensions(src) {
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
      return new Promise((resolve) => {
        // Make a 32x32px icon be 256x256
        new SvgToPngConverter().convertFromInput(
          svg,
          { scaleFactor: 256 / 32 },
          resolve,
        )
      })
    }
  })
}

export default copyImage
