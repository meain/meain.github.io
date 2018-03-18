// For animating the background particles
var Particle,
  addParticle,
  animationLoop,
  backingStoreRatio,
  canvas,
  context,
  destroyParticlesOutsideCanvasBounds,
  devicePixelRatio,
  maxVelocity,
  oldHeight,
  oldWidth,
  particlesArray,
  particlesIds,
  particlesOrigin,
  random,
  randomColor,
  randomInteger,
  ratio,
  updateParticlesOrigin

canvas = document.getElementById('dots')

context = canvas.getContext('2d')

maxVelocity = 10

particlesArray = []

particlesIds = []

particlesOrigin = {
  x: 0,
  y: 0,
}

Particle = (function() {
  function Particle() {
    this.id = Math.random()
      .toString(36)
      .substr(2, 5)
    this.alpha = random(0.75, 1)
    this.rgb = randomColor()
    this.diameter = Math.round(random(50))
    this.radius = Math.round(this.diameter / 2)
    this.position = {
      x: particlesOrigin.x - this.radius,
      y: particlesOrigin.y - this.radius,
    }
    this.velocity = {
      x: random(0, maxVelocity) - maxVelocity / 2,
      y: random(0, maxVelocity) - maxVelocity / 2,
    }
    return this
  }

  Particle.prototype.updateValues = function() {
    this.position.x += this.velocity.x
    return (this.position.y += this.velocity.y)
  }

  Particle.prototype.draw = function() {
    context.fillStyle = 'rgba(' + this.rgb + ', ' + this.alpha + ')'
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, true)
    context.closePath()
    return context.fill()
  }

  Particle.prototype.withinCanvasBounds = function() {
    var result
    result = true
    if (this.position.x < -this.diameter) {
      result = false
    } else if (this.position.x > canvas.width + this.diameter) {
      result = false
    }
    if (this.position.y < -this.diameter) {
      result = false
    } else if (this.position.y > canvas.height + this.diameter) {
      result = false
    }
    return result
  }

  return Particle
})()

addParticle = function() {
  var particle
  particle = new Particle()
  particlesArray.unshift(particle)
  particlesIds.unshift(particle.id)
}

animationLoop = function() {
  var particle, particlesToDelete, _i, _len
  window.requestAnimationFrame(animationLoop)
  particlesToDelete = []
  context.clearRect(0, 0, canvas.width, canvas.height)
  for (_i = 0, _len = particlesArray.length; _i < _len; _i++) {
    particle = particlesArray[_i]
    if (particle.withinCanvasBounds()) {
      particle.updateValues()
      particle.draw()
    } else {
      particlesToDelete.push(particle.id)
    }
  }
  destroyParticlesOutsideCanvasBounds(particlesToDelete)
}

destroyParticlesOutsideCanvasBounds = function(particlesToDelete) {
  var id, index, particle, _i, _len
  for (_i = 0, _len = particlesToDelete.length; _i < _len; _i++) {
    id = particlesToDelete[_i]
    index = particlesIds.indexOf(id)
    particle = particlesArray[index]
    if (particle != null) {
      particlesArray.splice(index, 1)
      particlesIds.splice(index, 1)
    }
  }
}

random = function(min, max) {
  if (min == null) {
    min = 0
    max = 1
  } else if (max == null) {
    max = min
    min = 0
  }
  return Math.random() * (max - min) + min
}

randomColor = function() {
  var b, g, r
  r = randomInteger(0, 200)
  g = randomInteger(0, 200)
  b = randomInteger(0, 200)
  return r + ', ' + g + ', ' + b
}

randomInteger = function(min, max) {
  if (max == null) {
    max = min
    min = 0
  }
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

updateParticlesOrigin = function(event) {
  particlesOrigin.x = event.pageX
  particlesOrigin.y = event.pageY
  addParticle()
}

canvas.width = document.body.clientWidth

canvas.height = document.body.clientHeight

devicePixelRatio = window.devicePixelRatio || 1

backingStoreRatio = context.webkitBackingStorePixelRatio || context.backingStorePixelRatio || 1

ratio = devicePixelRatio / backingStoreRatio

if (devicePixelRatio !== backingStoreRatio) {
  oldWidth = canvas.width
  oldHeight = canvas.height
  canvas.width = oldWidth * ratio
  canvas.height = oldHeight * ratio
  canvas.style.width = oldWidth + 'px'
  canvas.style.height = oldHeight + 'px'
  context.scale(ratio, ratio)
}

document.addEventListener('mousemove', updateParticlesOrigin)

document.addEventListener('touchmove', updateParticlesOrigin)

animationLoop()
