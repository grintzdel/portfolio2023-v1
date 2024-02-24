import Home from 'pages/Home'
import About from 'pages/About'
import Detail from 'pages/Detail'
import Collections from 'pages/Collections'

class App {
  constructor () {
    console.log('App is running')
  }

  createPages () {
    this.pages = {
      home: new Home(),
      about: new About(),
      detail: new Detail(),
      collections: new Collections()
    }
  }
}

new App()
