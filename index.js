const Encoder = require('gif-encoder-2')
const Canvas = require('canvas')

const data = require('./data.json').children.map(layer => layer.children.map(path => path.attributes.d))
const shading = require('./shading.json')

data.forEach(layer => {
  layer.reverse()
  layer.base = layer.pop()
  layer.mask = layer.pop()
})

shading.forEach((layer, index) => {
  for (i = 0; i < layer; i++) {
    let str = new String(data[index][i])
    str.shading = true
    data[index].push(str)
  }
})

function path(path, color) {
  if (path.shading) color = color.map(int => Math.round(int / 1.5))
  return '<path fill="rgb(' + color + ')" d="' + path + '"/>'
}

function build(layer, color) {
  let base = path(layer.base, [0, 0, 0])
  let mask = path(layer.mask, [149, 201, 218])

  return 'data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 128 128" width="128" height="128" xmlns="http://www.w3.org/2000/svg">' + base + mask + layer.map(d => path(d, color)).join('') + '</svg>'
}

function loop(arr, num) {
  if (num > arr.length - 1) return loop(arr, -arr.length + num)
  if (num < 0) return loop(arr, arr.length - num)
  return num
}

async function getData(image, size) {
  const canvas = Canvas.createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  image = await Canvas.loadImage(image)
  ctx.drawImage(image, 0, 0, size, size)
  return ctx.getImageData(0, 0, size, size).data
}

module.exports = function (image, { size = 10, resolution = 1080, speed = 10 } = { size: 10, resolution: 1080, speed: 10 }) {
  const imgSize = resolution / size

  return getData(image, size)
    .then(async pixels => {
      const pixelLength = pixels.length
      const gif = new Encoder(resolution, resolution)

      gif.setTransparent(0)
      gif.setDelay(speed)
      gif.start()

      const canvas = Canvas.createCanvas(resolution, resolution)
      const ctx = canvas.getContext('2d')

      async function generate(frame) {
        let res = []
        let x = 0;
        let y = 0;

        for (i = 0; i < pixelLength; i += 4) {
          const [r, g, b, a] = pixels.slice(i)

          if (a > 125) {
            const image = new Canvas.Image()
            const promise = new Promise(resolve => {
              image.onload = () => {
                resolve()
                ctx.drawImage(image, x * imgSize, y * imgSize, imgSize * 2, imgSize * 2)
              }
            })

            res.push(promise)

            let offset = i / 4 % data.length
            const svg = build(data[loop(data, offset + frame)], [r, g, b])
            image.src = svg
          }

          x++
          if (x === size) {
            x = 0
            y++
          }
        }

        return Promise.all(res).then(() => ctx)
      }

      for (f = 0; f < data.length; f++) {
        const frame = await generate(f)
        gif.addFrame(frame)
        ctx.clearRect(0, 0, resolution, resolution)
      }

      gif.finish()
      return gif.out.getData()
    })
}