import { Controller } from "@hotwired/stimulus"
import { useClickOutside } from "stimulus-use"

export default class extends Controller {
  connect() {
    useClickOutside(this, { element: this.element })
  }

  show() {
    this.element.open = true
  }

  hide() {
    this.element.open = false
  }

  clickOutside(event) {
    this.hide()
  }
}
