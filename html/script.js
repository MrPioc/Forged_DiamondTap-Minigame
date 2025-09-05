let diamonds = []
let currentIndex = 0
let isRunning = false

const diamondCount = 5
const diamondPositions = []
for(let i = 1; i <= diamondCount; i++) {
  diamondPositions.push(i * 100 / (diamondCount + 1))
}

const hitWindow = 3 // % tolerance around diamond to accept input
const totalDuration = 2000 // faster progress bar fill time in ms

let animationStartTime = null
let animationFrameId = null

// Hide game UI initially
document.getElementById('game').style.display = 'none'

window.addEventListener('message', (event) => {
  if(event.data.action === 'start') {
    startGame()
  }
})

function startGame() {
  document.getElementById('game').style.display = 'block'

  currentIndex = 0
  isRunning = true
  animationStartTime = performance.now()

  diamonds = []

  const diamondsContainer = document.getElementById('diamonds')
  diamondsContainer.innerHTML = ''

  diamondPositions.forEach(pos => {
    const d = document.createElement('div')
    d.classList.add('diamond')

    const fill = document.createElement('div')
    fill.classList.add('diamond-fill')
    d.appendChild(fill)

    d.style.left = `${pos}%`
    diamondsContainer.appendChild(d)
    diamonds.push({ el: d, fillEl: fill })
  })

  const progressBar = document.getElementById('progress-bar')
  progressBar.style.transition = 'none'
  progressBar.style.width = '0%'

  diamonds.forEach(d => {
    d.fillEl.style.height = '0%'
    d.el.classList.remove('unlocked')
  })

  animationFrameId = requestAnimationFrame(updateProgressBar)
  window.addEventListener('keydown', onKeyDown)
}

function updateProgressBar(timestamp) {
  if (!isRunning) return

  if (!animationStartTime) animationStartTime = timestamp
  const elapsed = timestamp - animationStartTime
  let progressPercent = (elapsed / totalDuration) * 100

  if (progressPercent > 100) progressPercent = 100

  const progressBar = document.getElementById('progress-bar')
  progressBar.style.width = progressPercent + '%'

  if (currentIndex < diamondPositions.length) {
    const diamondPos = diamondPositions[currentIndex]
    if (progressPercent > diamondPos + hitWindow) {
      fail()
      return
    }
  } else {
    if (progressPercent >= 100) {
      success()
      return
    }
  }

  animationFrameId = requestAnimationFrame(updateProgressBar)
}

function onKeyDown(e) {
  if (!isRunning) return

  if (e.code === 'Space' || e.key === ' ') {
    const progressBar = document.getElementById('progress-bar')
    const currentWidth = parseFloat(progressBar.style.width)
    const target = diamondPositions[currentIndex]
    const diff = Math.abs(currentWidth - target)

    if(diff <= hitWindow) {
      diamonds[currentIndex].el.classList.add('unlocked')
      diamonds[currentIndex].fillEl.style.height = '100%'

      const audio = document.getElementById('success-sound')
      if (audio) {
        audio.currentTime = 0
        audio.play()
      }

      currentIndex++
    } else {
      fail()
    }
  }
}

function success() {
  isRunning = false
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('keydown', onKeyDown)
  document.getElementById('game').style.display = 'none'

  fetch(`https://${GetParentResourceName()}/minigameResult`, {
    method: 'POST',
    body: JSON.stringify({ success: true })
  })
}

function fail() {
  isRunning = false
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('keydown', onKeyDown)
  document.getElementById('game').style.display = 'none'

  fetch(`https://${GetParentResourceName()}/minigameResult`, {
    method: 'POST',
    body: JSON.stringify({ success: false })
  })
}
