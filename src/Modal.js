import SessionStorageManager from './SessionStorageManager'

export default class Modal {
  constructor() {
    this.storageManager = SessionStorageManager.init()
    this.elemBody = document.querySelector('body')
    this.elemModal = document.getElementById('modal')
    this.btnOpen = document.getElementById('btnOpenModalLogin')
    this.btnConfirm = document.getElementById('btnConfirmModalLogin')
    this.btnExit = document.getElementById('btnExitProfile')
    this.inputName = document.getElementById('inputUserName')
    this.inputProfName = document.getElementById('inputProfName')
    this.bodyWidth = 0
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
    this.btnOpen.addEventListener('click', e => {
      e.preventDefault()
      this.changeCSS('open')
    })
  }

  addBtnExitHandlers() {
    this.btnExit.addEventListener('click', e => {
      e.preventDefault()
      this.storageManager.removeItem()
      this.storageManager.restoreFromStorage('exit')
    })
  }

  addBtnConfirmHandlers() {
    this.btnConfirm.addEventListener('click', e => {
      e.preventDefault()
      this.storageManager.setItem(this.inputName.value)
      this.storageManager.restoreFromStorage('confirm')
      this.changeCSS('confirm')
    })
  }

  addInpProfNameHandler() {
    this.inputProfName.addEventListener('blur', e => {
      console.log('Событие blur')
      e.preventDefault()
      this.storageManager.setItem(this.inputProfName.value)
    })
  }

  changeCSS(actionName) {
    if (actionName == 'open') {
      this.elemBody.classList.add('body-lock')
      this.elemBody.style.width = this.bodyWidth + 'px'      
      this.elemModal.classList.add('modal-open')
    } 
    if (actionName == 'confirm') {
      this.elemBody.classList.remove('body-lock')
      this.elemModal.classList.remove('modal-open')
    }
  }
}
