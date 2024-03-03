import GSAP from 'gsap'

import Animation from 'classes/Animation'

import { calculate, split } from 'utils/text'

export default class Paragraph extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    this.elementLinesSpans = split({
      append: true,
      element: this.element
    })
  }

  animateIn () {
    GSAP.fromTo(
      this.element,
      {
        autoAlpha: 0,
        delay: 0.5
      },
      {
        autoAlpha: 1,
        duration: 1
      }
    )
  }

  animateOut () {
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize () {
    if (Array.isArray(this.elementLinesSpans)) {
      this.elementLinesSpans = this.elementLinesSpans.filter(element => element !== undefined)
      this.elementsLines = calculate(this.elementLinesSpans)
    }
  }
}
