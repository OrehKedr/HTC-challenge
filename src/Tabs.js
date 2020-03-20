export default class Tabs {
	constructor() {
		this.tabNav = document.querySelectorAll('.tabs-nav__item')
		this.tabContent = document.querySelectorAll('.tab')
		this.tabName = ''
	}

	init() {
		this.fixIE()
		this.tabNav.forEach(item => {
			item.addEventListener('click', this.handleTabClick.bind(this))
		})
	}

	//В EI не работает forEach для псевдомассива. Коллекции - не массивы.
	fixIE() {
		this.tabNav = [].slice.call(this.tabNav, 0)
		this.tabContent = [].slice.call(this.tabContent, 0)
	}

	handleTabClick(e) {
		let elem = e.target
		
		this.tabNav.forEach(item => {
				item.classList.remove('is-active')
		})

		elem.classList.add('is-active')
		this.tabName = elem.getAttribute('data-tab-name')
		this.selectTabContent(this.tabName)
	}

	selectTabContent(tabName) {
		this.tabContent.forEach(item => {
				item.classList.contains(tabName) ? item.classList.add('is-active') : item.classList.remove('is-active')
		})
	}
}