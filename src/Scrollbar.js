export default class Scrollbar {
  constructor() {
    this.scroll = document.querySelector('.scroll')
    this.scrollArea = document.querySelector('.scroll-area')
    this.scrollHandle = document.querySelector('.scroll-handle')
    this.scrollTray = document.querySelector('.scroll-tray')
    window.Scrollbar = this
  }
  
  //Синтаксический сахар с проверкой условия.
  addClass(className, el) {
    if (el.classList && !el.classList.contains(className)) {
      el.classList.add(className)
    }
  }

  removeClass(className, el) {
    if (el.classList && el.classList.contains(className)) {
      el.classList.remove(className)
    }
  }

  //Переместить левый верхний угол (метрики: offsetLeft, offsetTop) ползунка скроллбара
  handleScrollAria(e) {
    const preventDefault = (e) => {
      e = e || window.event
      if (e.preventDefault)
          e.preventDefault()
      e.returnValue = false
    }

    //Временно отключаем реакцию окна на скроллинг
    window.onwheel = preventDefault(e)
    window.onmousewheel = document.onmousewheel = preventDefault(e) // Старые браузеры, IE
    window.ontouchmove  = preventDefault(e) // Мобилки
    

    let scrollbar = window.Scrollbar,
        scrollPos = scrollbar.scrollArea.scrollTop + e.deltaY / 20,
        scrollPerc = (scrollPos / scrollbar.scrollArea.scrollHeight) * 100

    scrollbar.scrollArea.scrollTop += e.deltaY
    scrollbar.scrollHandle.style.top = `${scrollPerc}%`
    
    //Возобновляем стандартное поведение окна на скролинг
    window.onmousewheel = document.onmousewheel = null 
    window.onwheel = null
    window.ontouchmove = null
  }

  //Если клик мыши попал по полоске скроллбара мимио ползунка
  handleTrayClick(e) {
    e.preventDefault()
    e.stopPropagation()

    let scrollbar = window.Scrollbar,
        handleHeight = parseFloat(scrollbar.scrollHandle.style.height.slice(0, -2)),
        posY = (e.offsetY === undefined) ? e.layerY : e.offsetY,
        correctedY = posY - (handleHeight / 2),
        scrollPerc = correctedY / scrollbar.scroll.clientHeight,
        destScrollY = scrollbar.scrollArea.scrollHeight * scrollPerc,
        diff = destScrollY - scrollbar.scrollArea.scrollTop

    scrollbar.scrollArea.scrollTop += diff
    scrollPerc = (scrollbar.scrollArea.scrollTop / scrollbar.scrollArea.scrollHeight) * 100
    scrollbar.scrollHandle.style.top = `${scrollPerc}%`
  }

  handleMouseDown(e) {
    e.preventDefault()
    e.stopPropagation()

    let scrollbar = window.Scrollbar,
        scrollHandlerTopCSSStr = scrollbar.scrollHandle.style.top ? scrollbar.scrollHandle.style.top : '0%',
        scrollHandlerTopPrc = parseFloat(scrollHandlerTopCSSStr.slice(0, -1)) / 100,
        scrollHandlerTop = scrollbar.scrollTray.clientHeight * scrollHandlerTopPrc,
        mousePosY = (e.offsetY === undefined) ? e.layerY : e.offsetY,
        offset = mousePosY - scrollHandlerTop,
        initialClientY = e.clientY - mousePosY

    //Перемещаем указатель мыши, удерживая кнопку
    window.addEventListener('mousemove', scrollbar.handleScrollThumbDrag(offset, initialClientY))
  }

  handleScrollThumbDrag(offset, initialClientY) {
    const browse = (e) => {
      e.preventDefault()
      e.stopPropagation()
      let scrollTray = window.Scrollbar.scrollTray, 
          scrollArea = window.Scrollbar.scrollArea, 
          scrollHandle = window.Scrollbar.scrollHandle,          

          //Пересчёт mousePosY, потому что event.tartget == window
          mousePosY = e.clientY - initialClientY,
          scrollRangeYPerc = (mousePosY - offset) / scrollTray.clientHeight,
          scrollAreaRange = scrollArea.scrollHeight * scrollRangeYPerc

      scrollArea.scrollTop = scrollAreaRange

      let scrollHandleTopPerc = (scrollArea.scrollTop / scrollArea.scrollHeight) * 100
      scrollHandle.style.top = `${scrollHandleTopPerc}%`
    }

    //Отжали кнопку мыши
    window.addEventListener('mouseup', (e) => {
      window.removeEventListener('mousemove', browse)
    })
  
    return browse
  }

  init() {

    let percentVisible = this.scroll.clientHeight / this.scrollArea.scrollHeight, 
        handleHeight = this.scroll.clientHeight * percentVisible

    this.scrollHandle.style.height = `${handleHeight}px`
    this.scrollArea.addEventListener('wheel', this.handleScrollAria)    
    this.scrollTray.addEventListener('mousedown', this.handleTrayClick)
    this.scrollHandle.addEventListener('mousedown', this.handleMouseDown)
    
  }
}







