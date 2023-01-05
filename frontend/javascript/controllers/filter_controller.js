import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["city", "tag", "filterable"]
  static values = {
    currentFilters: {
      type: Object,
      default: {
        city: null,
        tag: null
      }
    },
    cities: {
      type: Array,
      default: ["Tutte"]
    },
    tags: {
      type: Array,
      default: ["Tutte"]
    },
  }

  apply({ params, currentTarget }) {
    const { options } = params
    const { name, value } = currentTarget

    if (value == this[`${options}Value`][0]) {
      this.currentFiltersValue[name] = null
    } else {
      this.currentFiltersValue[name] = value
    }

    this.filterableTargets.forEach(filterable => {
      filterable.classList.add("hidden")

      let matches = []

      Object.entries(this.currentFiltersValue).forEach(([key, value]) => {
        let filterableMatch

        // Parse matches array or return the string
        if (filterable.dataset[`filter-${key}`][0] == "[") {
          filterableMatch = JSON.parse(filterable.dataset[`filter-${key}`])
        } else {
          filterableMatch = filterable.dataset[`filter-${key}`]
        }

        if (!value || filterableMatch.includes(value)) {
          matches.push(true)
        } else {
          matches.push(false)
        }
      })

      if (!matches.includes(false)) filterable.classList.remove("hidden")
    })
  }

  reset() {
    this.currentFiltersValue.city = null
    this.currentFiltersValue.tag = null

    this.cityTarget.selectedIndex = 0
    this.tagTarget.selectedIndex  = 0
  }

  // Private

  filterableTargetConnected(filterable) {
    const city = filterable.dataset.filterCity
    if (!this.citiesValue.includes(city)) {
      this.citiesValue = [...this.citiesValue, city]
    }

    this.generateFilterOptions(this.cityTarget, this.citiesValue)

    const tags = JSON.parse(filterable.dataset.filterTag)
    tags.forEach(tag => {
      if (!this.tagsValue.includes(tag)) {
        this.tagsValue = [...this.tagsValue, tag]
      }
    })

    this.generateFilterOptions(this.tagTarget, this.tagsValue)
  }

  generateFilterOptions(select, options) {
    select.innerHTML = null

    options.forEach(option => {
      const element     = document.createElement("option")
      element.value     = option
      element.innerText = option

      select.appendChild(element)
    })
  }
}
