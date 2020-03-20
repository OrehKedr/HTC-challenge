export default class SessionStorageManager {
  constructor() {
    this.userInfo = {
      key: 'user-info',
      keyValue: ''
    }
    window.SessionStorageManager = this
  }

  static init() {
    if (window.SessionStorageManager) {
      return window.SessionStorageManager
    } else {
      return new SessionStorageManager()
    }
  }

  setItem(val) {    
    if (!this.validateValue(val)) {
      sessionStorage.setItem(this.userInfo.key, val)
    }
  }

  removeItem() {
    sessionStorage.removeItem(this.userInfo.key)
  }

  validateValue(val) {
    return (val.length === 0 || !val.trim());
  }

  restoreFromStorage(actionName) {
    let key = this.userInfo.key
    
    if (actionName == 'exit') {
      document.getElementById('inputProfName').value = ''
      this.changeCSS('exit')
      return
    }

    if (this.include(key)) {
      this.userInfo.keyValue = sessionStorage.getItem(key)
      document.getElementById('inputProfName').value = this.userInfo.keyValue
      this.changeCSS()
    }
  }

  include(storageKey) {
    let keys = Object.keys(sessionStorage)

    for (let key of keys) {
      if (key == storageKey) {
        return true
      }
    }
    return false
  }

  changeCSS(actionName) {
    const elemInput = document.getElementById('inputProfName')
    const elemBtnOpen = document.getElementById('btnOpenModalLogin')
    const elemBtnExit = document.getElementById('btnExitProfile')

    if (actionName == 'exit') {
      elemInput.classList.remove('is-filled')
      elemBtnOpen.classList.remove('hidden')
      elemBtnExit.classList.add('hidden')
      return
    }

    elemInput.classList.add('is-filled')
    elemBtnOpen.classList.add('hidden')
    elemBtnExit.classList.remove('hidden')
  }
}