
import {initLightSwitch, registerServiceWorker} from './useful.js'

// let this be easy to read for anyone to see how the app is initialized
const log = console.log
initLightSwitch('css_light', 'btn_light')
registerServiceWorker('serviceWorker.js', {}, 'btn_install')

navigator.serviceWorker.addEventListener('message', ({source, data}) => {
  switch (data.cmd) {
    case 'hello': 
      document.getElementById('sw_build').innerText = 'sw build: '+data.build
    break
  }
})

navigator.serviceWorker.ready.then(registration => {
    // navigator.serviceWorker.controller.postMessage({
    registration.active.postMessage({cmd: 'hi'})
  }
)
