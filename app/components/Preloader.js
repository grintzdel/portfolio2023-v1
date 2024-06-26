import GSAP from 'gsap'

import Component from 'classes/Component'

import each from 'lodash/each'

import { split } from 'utils/text'

export default class Preloader extends Component {
  constructor () {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
        images: document.querySelectorAll('img')
      }
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    this.elements.titleSpans = this.elements.title.querySelectorAll('span span')

    this.length = 0

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

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded () {
    return new Promise(resolve => {
      this.animatedOut = GSAP.timeline({
        delay: 2
      })

      this.animatedOut.to(this.elements.titleSpans, {
        duration: 1.5,
        expo: 'expo.out',
        stagger: 0.1,
        y: '100%'
      })

      this.animatedOut.to(this.elements.numberText, {
        duration: 1.5,
        expo: 'expo.out',
        stagger: 0.1,
        y: '100%'
      }, '-=1.4')

      this.animatedOut.to(this.element, {
        duration: 1.5,
        expo: 'expo.out',
        scaleY: 0,
        transformOrigin: '100% 100%'
      }, '-=1')

      this.animatedOut.call(_ => {
        this.emit('completed')
      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}
