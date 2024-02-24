import Home from 'pages/Home'
import About from 'pages/About'
import Detail from 'pages/Detail'
import Works from 'pages/Works'

class App {
  constructor () {
    this.createContent()
    this.createPages()
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages () {
    this.pages = {
      home: new Home(),
      about: new About(),
      detail: new Detail(),
      works: new Works()
    }

    this.page = this.pages[this.template]
    this.page.create()

    console.log(this.page)
  }
}

new App()
