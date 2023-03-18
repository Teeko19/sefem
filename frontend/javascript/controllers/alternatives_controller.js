import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  alternatives = [
    "un giro in bicicletta 🚴",
    "un giro nel bosco 🌲",
    "prendere un gelato con gli amici 🍦",
    "esercitare quell'ollie 🛹",
    "chiedere la rivincita ⛹️",
    "scaricare un po' di tensione 🧘",
    "esercitarsi con la pittura 🎨",
    "richiamare la band per una jam session 🎸",
    "sfidare il fratellino 🎮",
    "fare un po’ di giardinaggio 🌻"
  ]

  static targets = ["notice", "content", "events"]

  connect() {
    this.toggle()
  }

  toggle() {
    if (this.isEventsEmpty) {
      this.suggestAlternative()
      this.noticeTarget.classList.remove("hidden")

      return
    } else {
      this.noticeTarget.classList.add("hidden")
    }
  }

  suggestAlternative() {
    this.contentTarget.innerText = this.alternatives[Math.floor(Math.random()*this.alternatives.length)]
  }

  get isEventsEmpty() {
    if (this.eventsTarget.children.length == 0) return true

    let allHidden = true
    for (const event of this.eventsTarget.children) {
      if (!event.classList.contains("hidden")) {
        allHidden = false
      }
    }

    return allHidden ? true : false
  }
}
