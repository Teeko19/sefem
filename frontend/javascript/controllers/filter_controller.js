import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["filterable"]
  static values = {
    cities: Array,
    tags: Array
  }

  filterableTargetConnected(filterable) {
    const city = filterable.dataset.filterCity
    if (!this.citiesValue.includes(city)) {
      this.citiesValue = [...this.citiesValue, city]
    }

    const tags = JSON.parse(filterable.dataset.filterTags)
    tags.forEach(tag => {
      if (!this.tagsValue.includes(tag)) {
        this.tagsValue = [...this.tagsValue, tag]
      }
    })
  }
}
