import { Controller } from "@hotwired/stimulus"
import {
  parseISO,
  format,
  isValid,
  getMonth,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  startOfTomorrow,
  endOfTomorrow,
  nextMonday,
  nextSaturday,
  nextSunday,
  previousSaturday,
  areIntervalsOverlapping
} from "date-fns"

export default class extends Controller {
  static targets = ["city", "tag", "time", "filterable"]
  static values = {
    currentFilters: {
      type: Object,
      default: {
        city: null,
        tag: null,
        time: null
      }
    },
    cities: {
      type: Array,
      default: ["🏔️ qualsiasi località"]
    },
    times: {
      type: Array,
      default: ["month"]
    },
    tags: {
      type: Array,
      default: ["🎪 qualunque attività"]
    },
    currentMonth: Number
  }

  connect() {
    if (this.currentMonthValue == getMonth(Date.now()) + 1) {
      this.timeTarget.classList.remove("hidden")
    }
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
        switch (key) {
          case "city":
            const city = filterable.dataset.filterCity

            if (!value || city.includes(value)) {
              matches.push(true)
            } else {
              matches.push(false)
            }
            break
          case "tag":
            const tags = JSON.parse(filterable.dataset.filterTag)

            if (!value || tags.includes(value)) {
              matches.push(true)
            } else {
              matches.push(false)
            }
            break
          case "time":
            const starts_at = parseISO(filterable.dataset.filterTimeStarts)
            const ends_at   = parseISO(filterable.dataset.filterTimeEnds)

            const timeInterval = {
              start: starts_at,
              end: isValid(ends_at) ? ends_at : starts_at
            }

            const now = Date.now()
            let filterInterval

            switch (value) {
              case "today":
                filterInterval = {
                  start: startOfDay(now),
                  end: endOfDay(now)
                }
                break
              case "tomorrow":
                filterInterval = {
                  start: startOfTomorrow(now),
                  end: endOfTomorrow(now)
                }
                break
              case "saturday":
                filterInterval = {
                  start: startOfDay(nextSaturday(now)),
                  end: endOfDay(nextSaturday(now))
                }
                break
              case "sunday":
                filterInterval = {
                  start: startOfDay(nextSunday(now)),
                  end: endOfDay(nextSunday(now))
                }
                break
              case "weekend":
                filterInterval = {
                  start: startOfDay(previousSaturday(nextSunday(now))),
                  end: endOfDay(nextSunday(now))
                }
                break
              case "next_week":
                filterInterval = {
                  start: startOfDay(nextMonday(now)),
                  end: endOfDay(nextSunday(nextMonday(now)))
                }
                break
              default:
                filterInterval = {
                  start: startOfMonth(now),
                  end: endOfMonth(now)
                }
                break
            }

            if (!value || areIntervalsOverlapping(filterInterval, timeInterval, { inclusive: false })) {
              matches.push(true)
            } else {
              matches.push(false)
            }
            break
        }
      })

      if (!matches.includes(false)) filterable.classList.remove("hidden")
    })

    this.dispatch("applied")
  }

  reset() {
    this.currentFiltersValue.city = null
    this.currentFiltersValue.tag  = null
    this.currentFiltersValue.time = null

    this.cityTarget.selectedIndex = 0
    this.tagTarget.selectedIndex  = 0
    this.timeTarget.selectedIndex = 0
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
