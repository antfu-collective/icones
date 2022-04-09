const copyImage = (svg, color) => {
  return new Promise(async (resolve) => {
    let containerDiv = document.createElement("div");
    containerDiv.innerHTML = svg;
    //Now we have a DOM element:
    svg = containerDiv.querySelector("svg");
    svg.setAttribute("style", `color: ${color};`);
    let data = new XMLSerializer().serializeToString(svg);
    let svgBlob = new Blob([data], {
      type: "image/svg+xml;charset=utf-8",
    });
    let src = URL.createObjectURL(svgBlob);
    let image = await toPng(src);
    navigator.clipboard
      .write([
        new ClipboardItem({
          "image/png": await toBlob(image),
        }),
      ])
      .then(resolve);
    function toBlob(dataurl) {
      return fetch(dataurl).then((r) => r.blob());
    }
    function toPng(svg) {
      class SvgToPngConverter {
        constructor() {
          this._init = this._init.bind(this);
          this._cleanUp = this._cleanUp.bind(this);
          this.convertFromInput = this.convertFromInput.bind(this);
        }

        _init() {
          this.canvas = document.createElement("canvas");
          this.imgPreview = document.createElement("img");
          this.imgPreview.style = "position: absolute; top: -9999px";

          document.body.appendChild(this.imgPreview);
          this.canvasCtx = this.canvas.getContext("2d");
        }

        _cleanUp() {
          document.body.removeChild(this.imgPreview);
        }

        convertFromInput(input, { width, height, scaleFactor = 2 }, callback) {
          this._init();
          let _this = this;
          this.imgPreview.onload = async function () {
            const img = new Image();
            const dimensions = await getDimensions(_this.imgPreview.src);

            _this.canvas.width = width || dimensions.width * scaleFactor;
            _this.canvas.height = height || dimensions.height * scaleFactor;
            img.crossOrigin = "anonymous";
            img.src = _this.imgPreview.src;
            img.onload = function () {
              _this.canvasCtx.drawImage(
                img,
                0,
                0,
                _this.canvas.width,
                _this.canvas.height
              );
              let imgData = _this.canvas.toDataURL("image/png");
              if (typeof callback == "function") {
                callback(imgData);
              }
              _this._cleanUp();
            };

            function getDimensions(src) {
              return new Promise((resolve) => {
                const _img = new Image();
                _img.src = src;
                _img.onload = () => {
                  resolve({
                    width: _img.naturalWidth,
                    height: _img.naturalHeight,
                  });
                };
              });
            }
          };

          this.imgPreview.src = input;
        }
      }
      return new Promise((resolve) => {
        // Make a 32x32px icon be 256x256
        new SvgToPngConverter().convertFromInput(
          svg,
          { scaleFactor: 256 / 32 },
          resolve
        );
      });
    }
  });
};

export default copyImage;
