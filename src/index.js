import SessionStorageManager from './SessionStorageManager'
import Tabs from './Tabs'
import Modal from './Modal'
import './styles/modal.scss'
import './styles/scrollbar.css'
import './styles/styles.scss'

const storageManager = SessionStorageManager.init()
storageManager.restoreFromStorage()

const tabs = new Tabs()
tabs.init()

const modal = new Modal()
modal.init()