export async function svgToPngDataUrl(svg: string) {
  const scaleFactor = 16

  const canvas = document.createElement('canvas')
  const imgPreview = document.createElement('img')
  imgPreview.setAttribute('style', 'position: absolute; top: -9999px')
  document.body.appendChild(imgPreview)
  const canvasCtx = canvas.getContext('2d')!

  const svgBlob: Blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const svgDataUrl = URL.createObjectURL(svgBlob)

  return new Promise<string>((resolve) => {
    imgPreview.onload = async () => {
      const img = new Image()
      const dimensions: { width: number, height: number } = await getDimensions(imgPreview.src)

      Object.assign(canvas, {
        width: dimensions.width * scaleFactor,
        height: dimensions.height * scaleFactor,
      })

      img.crossOrigin = 'anonymous'
      img.src = imgPreview.src
      img.onload = () => {
        canvasCtx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const imgData = canvas.toDataURL('image/png')
        resolve(imgData)
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
    imgPreview.src = svgDataUrl
  })
    .finally(() => {
      document.body.removeChild(imgPreview)
    })
}
