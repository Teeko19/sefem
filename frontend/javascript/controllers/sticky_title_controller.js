import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["visibility"]

  changeVisibility() {
    if (!this.hasVisibilityClass) return

    if (window.scrollY >= 120) {
      this.visibilityClasses.forEach(className => {
        this.element.classList.remove(className)
      })
    } else {
      this.visibilityClasses.forEach(className => {
        this.element.classList.add(className)
      })
    }
  }
}
