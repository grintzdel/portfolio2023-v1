import each from 'lodash/each'

import Preloader from 'components/Preloader'

import Home from 'pages/Home'
import About from 'pages/About'
import Detail from 'pages/Detail'
import Works from 'pages/Works'

class App {
  constructor () {
    this.createPreloader()
    this.createContent()
    this.createPages()

    this.addLinkListeners()

    this.update()
  }

  createPreloader () {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
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
  }

  onPreloaded () {
    this.preloader.destroy()
    this.page.show()
  }

  async onChange (url) {
    await this.page.hide()

    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()

      this.addLinkListeners()
    } else {
      console.log('error')
    }
  }

  update () {
    if (this.page && this.page.update) {
      this.page.update()
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()

        const { href } = link

        this.onChange(href)
      }
    })
  }
}

new App()
