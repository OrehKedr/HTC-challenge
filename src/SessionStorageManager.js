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
      inputProfName.value = ''
      this.changeCSS('exit')
      return
    }

    if (this.include(key)) {
      this.userInfo.keyValue = sessionStorage.getItem(key)
      inputProfName.value = this.userInfo.keyValue
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
    if (actionName == 'exit') {
      inputProfName.classList.remove('is-filled')
      btnOpenModalLogin.classList.remove('hidden')
      btnExitProfile.classList.add('hidden')
      return
    }

    inputProfName.classList.add('is-filled')
    btnOpenModalLogin.classList.add('hidden')
    btnExitProfile.classList.remove('hidden')
  }
}