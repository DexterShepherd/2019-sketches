const canvasSketch = require('canvas-sketch')
const pixels = require('image-pixels')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: 'poster',
  units: 'in',
  pixelsPerInch: 500
};

const sketch = () => {
  const createGrid = (count) => {
    const grid = []
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1)
        const v = y / (count - 1)
        grid.push({
          position: [u, v],
          color: `rgba(10, 10, 10, 0.1)`,
        })
      }
    }
    return grid
  }

  const data = createGrid(150)
  const margin = 2
  const iterations = 2
  const segmentMax = 200
  const scale = 2.5 
  const zScale = 0.4
  const strength = 0.008
  const strokeStyleFactor = 0.002
  const yTransFactor = 0.1

  return ({ context, width, height }) => {
    context.fillStyle = '#fdfdfd';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * strokeStyleFactor
    for( let i = 0; i < iterations; i++) {
      data.forEach(({ position, color }) => {
        const [ u, v ] = position
        let x = lerp(margin, width - margin, u)
        let y = lerp(margin, height - margin, v)
        context.beginPath()
        context.strokeStyle = color;
        const segments = random.gaussian() * segmentMax
        for( let j = 0; j < segments; j++ ) {
          const angle = random.noise3D(
            x * scale,
            y * scale,
            i * zScale) * Math.PI * 2
          x += Math.cos(angle) * strength
          y += Math.sin(angle) * strength
          context.lineTo(x, y)
        }
        context.stroke()
      })
      console.log(`${i} of ${iterations} iterations`)
    }
  };
};

canvasSketch(sketch, settings)
