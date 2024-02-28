import GSAP from 'gsap'

import Component from 'classes/Component'

import each from 'lodash/each'

export default class Preloader extends Component {
  constructor () {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        images: document.querySelectorAll('img')
      }
    })

    this.length = 0

    console.log(this.element, this.elements)

    this.createLoader()
  }

  createLoader () {
    each(this.elements.images, element => {
      element.onload = _ => this.onAssetLoaded(element)
      element.src = element.getAttribute('data-src')
    })
  }

  onAssetLoaded (image) {
    this.length += 1

    const percent = this.length / this.elements.images.length

    this.elements.number.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded () {
    return new Promise(resolve => {
      this.animatedOut = GSAP.timeline({
        delay: 2
      })

      this.animatedOut.to(this.element, {
        autoAlpha: 0
      })

      this.animatedOut.call(_ => {
        this.emit('completed')
      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}
