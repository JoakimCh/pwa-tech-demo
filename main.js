
import {initLightSwitch, registerServiceWorker} from './useful.js'

// let this be easy to read for anyone to see how the app is initialized
initLightSwitch('css_light', 'btn_light')
registerServiceWorker('serviceWorker.js', {}, 'btn_install')
