const canvasSketch = require('canvas-sketch')
const pixels = require('image-pixels')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300
};

const sketch = async () => {
  const image = await pixels('./assets/trees-above.jpg')
  const pix = []

  for ( let i = 0; i < image.data.length; i += 4 ) {
    pix.push(image.data.slice(i, i + 4))
  }

  const createGrid = (count) => {
    const grid = []
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1)
        const v = y / (count - 1)
        const [r, g, b, a ] = random.pick(pix) 
        grid.push({
          position: [u, v],
          color: `rgba(${r}, ${g}, ${b}, 0.5)`,
        })
      }
    }
    return grid
  }

  const data = createGrid(30)
  const margin = 300
  const rFactor = 0.001
  const iterations = 5
  const segments = 10000
  const scale = 0.05
  const zScale = 0.001
  const strength = 2

  return ({ context, width, height }) => {
    context.fillStyle = '#fdfdfd';
    context.fillRect(0, 0, width, height);
    for( let i = 0; i < iterations; i++) {
      data.forEach(({ position, color }) => {
        const [ u, v ] = position
        let x = lerp(margin, width - margin, u)
        let y = lerp(margin, height - margin, v)
        context.beginPath()
        context.strokeStyle = color;
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
