/*** Start cross-compatibility ***/
// Used to detect if IDs include a direction, e.g. resize-top-left
if (!String.prototype.includes) {
  String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1
  }
}
Event.prototype.movementX = Event.prototype.movementX || Event.prototype.mozMovementX
Event.prototype.movementY = Event.prototype.movementY || Event.prototype.mozMovementY
/*** End cross-compatibility ***/

// https://stackoverflow.com/q/11409895
// Used to greatly simplify bbox translation by clamping cursor movement per-bbox
Number.prototype.clamp = function(min, max) {
  return this < min ? min : this > max ? max : this
}

// http://stackoverflow.com/q/901115
// @Cleanup: Unneeded? I need to implement daily puzzles somehow, though.
var urlParams
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {return decodeURIComponent(s.replace(pl, ' '))},
        query  = window.location.search.substring(1)

    urlParams = {}
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2])
})()

var tracks = {
  'start': new Audio('/data/panel_start_tracing.ogg'),
  'success': new Audio('/data/panel_success.ogg'),
  'fail': new Audio('/data/panel_failure.ogg'),
  'abort': new Audio('/data/panel_abort_tracing.ogg')
}

function PLAY_SOUND(track) {
  console.log('Playing sound:', track)
  for (var audio of Object.values(tracks)) {
    audio.pause()
    audio.currentTime = 0
  }
  tracks[track].volume = localStorage.volume
  tracks[track].play()
}

function TELEMETRY(type) {
  if (window.session_id == undefined) {
    return // No session -- possibly on the test page.
  }

  var request = new XMLHttpRequest()
  request.open('POST', '/telemetry', true)
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(
    'session_id=' + window.session_id +
    '&display_hash=' + window.display_hash +
    '&type=' + type
  )
}

window.LINE_PRIMARY = '#8FF'
window.LINE_SECONDARY = '#FF2'

if (localStorage.theme === 'true') { // Dark scheme
  window.BACKGROUND      = '#221' // '#000'
  window.FOREGROUND      = '#751' // '#873'
  window.BORDER          = '#666'
  window.LINE_DEFAULT    = '#888' // '#FD8'
  window.LINE_SUCCESS    = '#BBB' // '#FA0'
  window.LINE_FAIL       = '#000'
  window.CURSOR          = '#FFF'
  window.TEXT_COLOR      = '#CCC'
  window.PAGE_BACKGROUND = '#000'
} else { // Light scheme
  window.BACKGROUND      = '#0A8'
  window.FOREGROUND      = '#344'
  window.BORDER          = '#000'
  window.LINE_DEFAULT    = '#AAA'
  window.LINE_SUCCESS    = '#FFF'
  window.LINE_FAIL       = '#000'
  window.CURSOR          = '#FFF'
  window.TEXT_COLOR      = '#000'
  window.PAGE_BACKGROUND = '#FFF'
}
// pointer-events: none; allows for onclick events to bubble up
var animations =
'.line-1 {fill: ' + window.LINE_DEFAULT + '; pointer-events: none;}' +
'.line-2 {fill: ' + window.LINE_PRIMARY + '; pointer-events: none;}' +
'.line-3 {fill: ' + window.LINE_SECONDARY + '; pointer-events: none;}' +
'@keyframes line-success {to {fill: ' + window.LINE_SUCCESS + ';}}' +
'@keyframes line-fail {to {fill: ' + window.LINE_FAIL + ';}}' +
'@keyframes error {to {fill: red;}}' +
'@keyframes fade {to {opacity: 0.35;}}' +
'@keyframes start-grow {from {r:12;} to {r: 24;}}'
var style = document.createElement('style')
style.type = 'text/css'
style.title = 'animations'
style.appendChild(document.createTextNode(animations))
document.head.appendChild(style)

// Custom logging to allow leveling
var consoleError = console.error
var consoleWarn = console.warn
var consoleInfo = console.log
var consoleLog = console.log
var consoleDebug = console.log
var consoleSpam = console.log
var consoleGroup = console.group
var consoleGroupEnd = console.groupEnd

function setLogLevel(level) {
  console.error = function() {}
  console.warn = function() {}
  console.info = function() {}
  console.log = function() {}
  console.debug = function() {}
  console.spam = function() {}
  console.group = function() {}
  console.groupEnd = function() {}

  if (level === 'none') return

  // Instead of throw, but still red flags and is easy to find
  console.error = consoleError
  if (level === 'error') return

  // Less serious than error, but flagged nonetheless
  console.warn = consoleWarn
  if (level === 'warn') return

  // Default visible, important information
  console.info = consoleInfo
  if (level === 'info') return

  // Useful for debugging (mainly validation)
  console.log = consoleLog
  if (level === 'log') return

  // Useful for serious debugging (mainly graphics/misc)
  console.debug = consoleDebug
  if (level === 'debug') return

  // Useful for insane debugging (mainly tracing/recursion)
  console.spam = consoleSpam
  console.group = consoleGroup
  console.groupEnd = consoleGroupEnd
  if (level === 'spam') return
}
setLogLevel('info')

function hideSettings() {
  localStorage.settings = 'hidden'
  var settings = document.getElementById('settings')
  settings.style.display = 'none'
  var toggle = document.getElementById('settingsToggle')
  toggle.innerHTML = '+'
  toggle.onclick = function(){ showSettings() }
  toggle.parentElement.style.width = '20px'
  toggle.parentElement.style.height = '20px'
  toggle.style.top = '-11px'
}

function showSettings() {
  localStorage.settings = 'visible'
  var settings = document.getElementById('settings')
  settings.style.display = null
  var toggle = document.getElementById('settingsToggle')
  toggle.innerHTML = '&ndash; &nbsp; &nbsp; &nbsp; &nbsp;settings&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; '
  toggle.onclick = function(){ hideSettings() }
  toggle.parentElement.style.width = '250px'
  toggle.parentElement.style.height = null
  toggle.style.top = '-10px'
}

// @Cleanup: Settings should live in one variable in localStorage, it makes it easier to save them / persist them across clears
function loadSettings() {
  var parentDiv = document.createElement('div')
  document.body.appendChild(parentDiv)
  parentDiv.style.position = 'absolute'
  parentDiv.style.float = 'left'
  parentDiv.style.border = '2px solid ' + window.BORDER
  parentDiv.style.background = window.PAGE_BACKGROUND

  var toggle = document.createElement('label')
  parentDiv.appendChild(toggle)
  toggle.style.position = 'absolute'
  toggle.style.left = '2'
  toggle.style.cursor = 'pointer'
  toggle.id = 'settingsToggle'

  var settings = document.createElement('div')
  parentDiv.appendChild(settings)
  settings.id = 'settings'
  settings.style.margin = '10px'

  if (localStorage.settings === 'hidden') {
    hideSettings()
  } else {
    showSettings()
  }

  // Now, for the contents of the settings
  settings.appendChild(document.createElement('br'))

  // Theme
  var themeBox = document.createElement('input')
  settings.appendChild(themeBox)
  themeBox.className = 'checkbox'
  themeBox.type = 'checkbox'
  themeBox.id = 'theme'
  themeBox.onchange = function() {
    localStorage.theme = this.checked
    location.reload()
  }
  themeBox.checked = (localStorage.theme === 'true')
  // This needs to happen now, since the document body hasn't yet loaded.
  document.body.style.color = window.TEXT_COLOR
  document.body.style.background = window.PAGE_BACKGROUND

  var themeLabel = document.createElement('label')
  settings.appendChild(themeLabel)
  themeLabel.for = 'theme'
  themeLabel.innerText = ' Dark theme'

  settings.appendChild(document.createElement('br'))
  settings.appendChild(document.createElement('br'))

  // Sensitivity
  var sensLabel = document.createElement('label')
  settings.appendChild(sensLabel)
  sensLabel.for = 'sens'
  sensLabel.innerText = 'Mouse Speed 2D'

  if (localStorage.sensitivity == undefined) localStorage.sensitivity = 0.7
  var sens = document.createElement('input')
  settings.appendChild(sens)
  sens.style.width = '100%'
  sens.type = 'range'
  sens.id = 'sens'
  sens.min = '0.1'
  sens.max = '1.3'
  sens.step = '0.1'
  sens.value = localStorage.sensitivity
  sens.onchange = function() {
    localStorage.sensitivity = this.value
  }

  // Volume
  var volumeLabel = document.createElement('label')
  settings.appendChild(volumeLabel)
  volumeLabel.for = 'volume'
  volumeLabel.innerText = 'Volume'

  if (localStorage.volume == undefined) localStorage.volume = 0.12
  var volume = document.createElement('input')
  settings.appendChild(volume)
  volume.style.width = '100%'
  volume.type = 'range'
  volume.id = 'volume'
  volume.min = '0'
  volume.max = '0.24'
  volume.step = '0.02'
  volume.value = localStorage.volume
  volume.onchange = function() {
    localStorage.volume = this.value
  }
}
