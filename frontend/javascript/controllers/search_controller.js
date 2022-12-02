import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "querable"]

  query({ currentTarget }) {
    this.querableTargets.forEach(el => {
      if (!el.dataset.searchKeys.includes(currentTarget.value.toLowerCase())) {
        el.classList.add("hidden")
      } else {
        el.classList.remove("hidden")
      }
    })
  }
}
