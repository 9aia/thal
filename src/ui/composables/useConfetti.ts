export function useConfetti() {
  let timer: any
  let frame: number | undefined
  const containerId = "confetti-container"

  const make = () => {
    const random = Math.random
    const cos = Math.cos
    const sin = Math.sin
    const PI = Math.PI
    const PI2 = PI * 2
    const confetti: Confetto[] = []

    const spread = 40
    const sizeMin = 3
    const sizeMax = 12 - sizeMin
    const eccentricity = 10
    const deviation = 100
    const dxThetaMin = -0.1
    const dxThetaMax = -dxThetaMin - dxThetaMin
    const dyMin = 0.13
    const dyMax = 0.18
    const dThetaMin = 0.4
    const dThetaMax = 0.7 - dThetaMin

    const colorThemes: (() => string)[] = [
      function () {
        return color(
          (200 * random()) | 0,
          (200 * random()) | 0,
          (200 * random()) | 0,
        )
      },
      function () {
        const black = (200 * random()) | 0
        return color(200, black, black)
      },
      function () {
        const black = (200 * random()) | 0
        return color(black, 200, black)
      },
      function () {
        const black = (200 * random()) | 0
        return color(black, black, 200)
      },
      function () {
        return color(200, 100, (200 * random()) | 0)
      },
      function () {
        return color((200 * random()) | 0, 200, 200)
      },
      function () {
        const black = (256 * random()) | 0
        return color(black, black, black)
      },
      function () {
        return colorThemes[random() < 0.5 ? 1 : 2]()
      },
      function () {
        return colorThemes[random() < 0.5 ? 3 : 5]()
      },
      function () {
        return colorThemes[random() < 0.5 ? 2 : 4]()
      },
    ]

    function color(r: number, g: number, b: number): string {
      return `rgb(${r},${g},${b})`
    }

    // Cosine interpolation
    function interpolation(a: number, b: number, t: number): number {
      return ((1 - cos(PI * t)) / 2) * (b - a) + a
    }

    // Create a 1D Maximal Poisson Disc over [0, 1]
    const radius = 1 / eccentricity
    const radius2 = radius + radius

    function createPoisson(): number[] {
      // domain is the set of points which are still available to pick from
      // D = union{ [d_i, d_i+1] | i is even }
      const domain = [radius, 1 - radius]
      let measure = 1 - radius2
      const spline: number[] = [0, 1]

      while (measure) {
        let dart = measure * random()
        let i: number
        let l: number
        let interval: number
        let a: number
        let b: number

        // Find where dart lies
        for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
          a = domain[i]
          b = domain[i + 1]
          interval = b - a
          if (dart < measure + interval) {
            spline.push((dart += a - measure))
            break
          }
          measure += interval
        }
        const c = dart - radius
        const d = dart + radius

        // Update the domain
        for (i = domain.length - 1; i > 0; i -= 2) {
          l = i - 1
          a = domain[l]
          b = domain[i]
          // c---d          c---d  Do nothing
          //   c-----d  c-----d    Move interior
          //   c--------------d    Delete interval
          //         c--d          Split interval
          //       a------b
          if (a >= c && a < d) {
            if (b > d)
              domain[l] = d // Move interior (Left case)
            else domain.splice(l, 2)
          }
          // Delete interval
          else if (a < c && b > c) {
            if (b <= d)
              domain[i] = c // Move interior (Right case)
            else domain.splice(i, 0, c, d)
          } // Split interval
        }

        // Re-measure the domain
        for (i = 0, l = domain.length, measure = 0; i < l; i += 2) measure += domain[i + 1] - domain[i]
      }

      return spline.sort()
    }

    // Create the overarching container
    const container = document.createElement("div")
    container.id = containerId
    container.style.position = "fixed"
    container.style.top = "0"
    container.style.left = "0"
    container.style.width = "100%"
    container.style.height = "0"
    container.style.overflow = "visible"
    container.style.zIndex = "9999"

    // Confetto constructor
    class Confetto {
      frame: number = 0
      outer: HTMLDivElement = document.createElement("div")
      inner: HTMLDivElement = document.createElement("div")
      axis: string
      theta: number
      dTheta: number
      x: number
      y: number
      dx: number
      dy: number
      splineX: number[]
      splineY: number[]

      constructor(theme: () => string) {
        this.outer.appendChild(this.inner)

        const outerStyle = this.outer.style
        const innerStyle = this.inner.style
        outerStyle.position = "absolute"
        outerStyle.width = `${sizeMin + sizeMax * random()}px`
        outerStyle.height = `${sizeMin + sizeMax * random()}px`
        innerStyle.width = "100%"
        innerStyle.height = "100%"
        innerStyle.backgroundColor = theme()

        outerStyle.perspective = "50px"
        outerStyle.transform = `rotate(${360 * random()}deg)`
        this.axis = `rotate3D(${cos(360 * random())},${cos(360 * random())},0,`
        this.theta = 360 * random()
        this.dTheta = dThetaMin + dThetaMax * random()
        innerStyle.transform = `${this.axis + this.theta}deg)`

        this.x = window.innerWidth * random()
        this.y = -deviation
        this.dx = sin(dxThetaMin + dxThetaMax * random())
        this.dy = dyMin + dyMax * random()
        outerStyle.left = `${this.x}px`
        outerStyle.top = `${this.y}px`

        // Create the periodic spline
        this.splineX = createPoisson()
        this.splineY = []
        const l: number = this.splineX.length
        for (let i = 1, l = this.splineX.length - 1; i < l; ++i) this.splineY[i] = deviation * random()
        this.splineY[0] = this.splineY[l] = deviation * random()
      }

      update(height: number, delta: number): boolean {
        this.frame += delta
        this.x += this.dx * delta
        this.y += this.dy * delta
        this.theta += this.dTheta * delta

        // Compute spline and convert to polar
        const phi = (this.frame % 7777) / 7777
        let i = 0
        let j = 1
        while (phi >= this.splineX[j])
          i = j++

        const rho = interpolation(
          this.splineY[i],
          this.splineY[j],
          (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i]),
        )
        const phi2 = phi * PI2

        this.outer.style.left = `${this.x + rho * cos(phi2)}px`
        this.outer.style.top = `${this.y + rho * sin(phi2)}px`
        this.inner.style.transform = `${this.axis + this.theta}deg)`
        return this.y > height + deviation
      }
    }

    function poof() {
      if (!frame) {
        // Append the container
        document.body.appendChild(container)

        // Add confetti
        const theme = colorThemes[0];

        (function addConfetto() {
          const confetto = new Confetto(theme)
          confetti.push(confetto)
          container.appendChild(confetto.outer)
          timer = setTimeout(addConfetto, spread * random())
        })()

        // Start the loop
        let prev: number | undefined
        requestAnimationFrame(function loop(timestamp) {
          const delta = prev ? timestamp - prev : 0
          prev = timestamp
          const height = window.innerHeight

          for (let i = confetti.length - 1; i >= 0; --i) {
            if (confetti[i].update(height, delta)) {
              container.removeChild(confetti[i].outer)
              confetti.splice(i, 1)
            }
          }

          if (timer || confetti.length)
            return (frame = requestAnimationFrame(loop))

          // Cleanup
          document.body.removeChild(container)
          frame = undefined
        })
      }
    }

    poof()
  }

  const clear = () => {
    const container = document.getElementById(containerId)

    if (!container)
      return

    container.classList.add("animate-fade")

    const removeConfetti = () => {
      container.remove()

      clearTimeout(timer)
      timer = undefined

      if (frame) {
        cancelAnimationFrame(frame)
        frame = undefined
      }
    }

    setTimeout(() => {
      removeConfetti()
    }, 1000)
  }

  return { make, clear }
}
