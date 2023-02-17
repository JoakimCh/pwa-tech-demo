
export function initLightSwitch(stylesheetId, buttonId) {
  const stylesheet_ = document.getElementById(stylesheetId)
  const lightSwitch = document.getElementById(buttonId)
  function colorSchemeChange(dark) {
    if (typeof dark == 'string') dark = dark == 'true'
    stylesheet_.disabled = dark
    lightSwitch.innerText = dark ? 'Lights on' : 'Lights off'
    localStorage.setItem('dark', dark)
  }
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  mql.addEventListener('change', e => colorSchemeChange(e.matches))
  colorSchemeChange(localStorage.getItem('dark') ?? mql.matches)
  lightSwitch.addEventListener('click', () => colorSchemeChange(!stylesheetId.disabled))
}

export async function registerServiceWorker(url, options, installButtonId) {
  let registration
  try {
    if ('serviceWorker' in navigator) registration = await navigator.serviceWorker.register(url, {
      type: 'module',
      ...options
    })
  } catch {} // ignore any error
  if (registration && installButtonId) {
    window.addEventListener('beforeinstallprompt', async e => {
      e.preventDefault()
      const deferredPrompt = e
      const installButton = document.getElementById(installButtonId)
      installButton.hidden = false
      installButton.addEventListener('click', async () => {
        deferredPrompt.prompt()
        if (await deferredPrompt.userChoice == 'accepted') {
          installButton.hidden = true
        }
      })
    })
  }
  return registration
}
