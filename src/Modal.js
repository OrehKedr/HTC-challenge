import SessionStorageManager from './SessionStorageManager'

export default class Modal {
  constructor() {
    this.bodyWidth = 0
    this.elemBody = document.querySelector('body')
    this.storageManager = SessionStorageManager.init()
  }

  init() {
    //Запоминаем размер body, чтобы устранить ненужный сдвиг при открытии модального окна
    //Используется в методе changeCSS()
    this.bodyWidth = document.documentElement.clientWidth
    this.addEventHandlers()
  }

  addEventHandlers() {
    this.addBtnOpenHandlers()
    this.addBtnConfirmHandlers()
    this.addBtnExitHandlers()
    this.addInpProfNameHandler()
  }

  addBtnOpenHandlers() {
    btnOpenModalLogin.addEventListener('click', e => {
      e.preventDefault()
      this.changeCSS('open')
    })
  }

  addBtnExitHandlers() {
    btnExitProfile.addEventListener('click', e => {
      e.preventDefault()
      this.storageManager.removeItem()
      this.storageManager.restoreFromStorage('exit')
    })
  }

  addBtnConfirmHandlers() {
    btnConfirmModalLogin.addEventListener('click', e => {
      e.preventDefault()
      let inputUserName = document.getElementById('inputUserName') //Fix for IE
      this.storageManager.setItem(inputUserName.value)
      this.storageManager.restoreFromStorage('confirm')
      this.changeCSS('confirm')
    })
  }

  addInpProfNameHandler() {
    inputProfName.addEventListener('blur', e => {
      console.log('Событие blur')
      e.preventDefault()
      let inputProfName = document.getElementById('inputProfName') //Fix for IE
      this.storageManager.setItem(inputProfName.value)
    })
  }

  changeCSS(actionName) {
    if (actionName == 'open') {
      this.elemBody.classList.add('body-lock')
      this.elemBody.style.width = this.bodyWidth + 'px'
      modal.classList.add('modal-open')
    } 
    if (actionName == 'confirm') {
      this.elemBody.classList.remove('body-lock')
      modal.classList.remove('modal-open')
    }
  }
}
