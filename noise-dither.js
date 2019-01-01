const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math')
const { noise2D, gaussian } = require('canvas-sketch-util/random')

const settings = {
  // dimensions: [ 2048, 2048 ],
  dimensions: 'poster',
  units: 'px',
  pixelsPerInch: 300
};

const sketch = () => {


  const createSegments = () => {
    const s = [] 
    for( let i = 0; i < detail; i++ ) {
      const angle = (i / detail) * Math.PI * 2
      const u = 0.4 + (Math.sin(Math.cos(angle) + angle *2 ) * 0.5 * radius)
      const v = 0.5 + (Math.tan(angle) * 0.5 * radius)
      s.push([u, v])
    }
    return s
  }


  const detail = 5000
  const margin = 200
  const radius = 0.6
  const shadowDensity = 450
  const noiseStrength = 3.5
  const noiseScale = 1.4
  const segments = createSegments()

  return ({ context, width, height }) => {
    const drawSegments = () => {
      context.strokeStyle = '#101010'
      context.beginPath()
      segments.forEach(([u, v], i, segments) => {
        const x = lerp(margin, width - margin, u)
        const y = lerp(margin, height - margin, v)
        context.lineTo(x, y)
      })
      context.closePath()
      context.stroke()
    }

    context.fillStyle = 'hsl(200, 10%, 98%)';
    context.fillRect(0, 0, width, height);

    // drawSegments()
    segments.forEach(([u, v], i, segments) => {
      console.log(`${i + 1} of ${segments.length}`)
      if ( i > -1 ) {
        let x = lerp(margin, width - margin, u)
        let y = lerp(margin, height - margin, v)
        for( let j = 0; j < shadowDensity; j++ ) {
          const angle = (j / shadowDensity)
          const n = noise2D(
            u * noiseScale,
            v * noiseScale
          )
          x += Math.cos(n + angle) * noiseStrength
          y += Math.sin(n + angle) * noiseStrength
          if ( gaussian() > 0.1 ) {
            if ( gaussian() > u)  {
              const hue = lerp(260, 230, angle)
              context.fillStyle = `hsla(${hue}, ${lerp(60, 100, n)}%, ${lerp(70, 60, n)}%, 0.6)`
              context.beginPath()
              context.arc(x, y, 2, Math.PI * 2, false)
              context.fill()
            } else {
              const hue = lerp(280, 340, angle)
              context.fillStyle = `hsla(${hue}, ${lerp(100, 60, n)}%, ${lerp(70, 40, n)}%, 0.6)`
              context.beginPath()
              context.arc(x, y, 2, Math.PI * 2, false)
              context.fill()
            }
          }
        }
      }
    })

  };
};

canvasSketch(sketch, settings);
