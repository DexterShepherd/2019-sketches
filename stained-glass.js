const canvasSketch = require('canvas-sketch')
const pixels = require('image-pixels')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const sub = require('vectors/sub')(2)
const normalize = require('vectors/normalize')(2)

const settings = {
  dimensions: 'poster',
  units: 'in',
  pixelsPerInch: 300
};

const sketch = () => {
  const createGrid = (count) => {
    const grid = []
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count > 1 ? x / (count - 1) : 1
        const v = count > 1 ? y / (count - 1) : 0.5
        grid.push({
          position: [u, v],
          color: `rgba(0, 0, 0, 1)`,
        })
      }
    }
    return grid
  }

  const data = createGrid(1)
  const margin = 3
  const iterations = 1
  const segmentMax = 1000
  const scale = 100 
  const zScale = 0.4
  const strength = 0.008
  const maxAngle = Math.PI
  const strokeStyleFactor = 0.002

  const segments = []

  const detail = 100
  for( let i = 0; i < detail; i++ ) {
    const angle = (i / detail) * Math.PI * 2
    segments.push([
      Math.cos(angle) + 0.5 * 0.5,
      1 + Math.sin(angle) + 0.5 * 0.5
    ])
  }

  console.log(segments)
  return ({ context, width, height }) => {
    context.fillStyle = '#fdfdfd';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * strokeStyleFactor
    const shadowMax = 0.5
    const shadowDensity = 0.04
    const maxHeight = 50

    segments.forEach(([u, v], i, seg) => {
      let x = lerp(margin, width - margin, u)
      let y = lerp(margin, height - margin, v)
      if ( seg[i - 1] ) {
        const height = Math.floor(
          Math.pow(
            Math.abs(normalize(sub(seg[i - 1], seg[i]))[1]), 2
          ) * maxHeight
        )
        for( let i = 0; i < height; i++ ) {
          const angle = i / height
          const nAngle = random.noise3D(
            x * scale,
            y * scale,
            i * zScale) * maxAngle
          context.strokeStyle = `hsla(
            ${lerp(180, 220, angle)},
            ${lerp(40, 55, angle)}%,
            ${lerp(30, 100, angle)}%,
            ${shadowMax - (shadowMax * angle)})`
          x += Math.cos(nAngle) * strength * 8
          y += Math.sin(nAngle) * strength * 8
          context.beginPath()
          context.arc(
            x + (height * angle * shadowDensity * 0.5),
            y + (height * angle * shadowDensity),
            width * strokeStyleFactor * 0.5,
            Math.PI * 2,
            false)
          context.stroke()
        }
      }
    })
  };
};

canvasSketch(sketch, settings)
