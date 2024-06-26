import GSAP from 'gsap'

import Component from 'classes/Component'

import { COLOR_WHITE, COLOR_BLACK } from 'utils/colors'

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })

    this.onChange(template)
  }

  onChange (template) {
    if (template === 'about') {
      GSAP.to(this.element, {
        color: COLOR_BLACK,
        duration: 1.5
      })

      GSAP.to(this.elements.items[0], {
        autoAlpha: 1,
        delay: 0.75,
        duration: 0.75
      })

      GSAP.to(this.elements.items[1], {
        autoAlpha: 0,
        duration: 0.75
      })
    } else {
      GSAP.to(this.element, {
        color: COLOR_BLACK,
        duration: 1.5
      })

      GSAP.to(this.elements.items[0], {
        autoAlpha: 0,
        duration: 0.75
      })

      GSAP.to(this.elements.items[1], {
        autoAlpha: 1,
        delay: 0.75,
        duration: 0.75
      })
    }
  }
}
