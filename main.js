
import {initLightSwitch, registerServiceWorker} from './useful.js'

// let this be easy to read for anyone to see how the app is initialized
const log = console.log
initLightSwitch('css_light', 'btn_light')
registerServiceWorker('serviceWorker.js', {}, 'btn_install')

navigator.serviceWorker.addEventListener('message', (e) => {
  log('client message', e)
  document.getElementById('sw_build').innerText = 'sw build: '+e.data.build
})

navigator.serviceWorker.ready.then(registration => {
    // navigator.serviceWorker.controller.postMessage({
    registration.active.postMessage({
      msg: 'hello'
    })
  }
)
