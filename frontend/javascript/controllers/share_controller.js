import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    data: Object
  }

  async execute() {
    const shareData = this.dataValue

    try {
      if (shareData.hasOwnProperty("files") && this.canShareFiles) {
        shareData.files = await this.fetchFiles()

        delete shareData.title
        delete shareData.text
        delete shareData.url
      } else if (shareData.hasOwnProperty("url") && this.canShareLinks) {
        delete shareData.title
        delete shareData.text
        delete shareData.files
      } else {
        console.log("Cannot share")
        return
      }
    } catch (error) {
      console.error(error)
    }

    try {
      await navigator.share(shareData)
    } catch (error) {
      console.warn(error)
    }
  }

  // Private

  async fetchFiles() {
    const files = []

    for(const url of this.dataValue.files) {
      if (typeof url == "string") {
        const fileBlob = await this.fetchFile(url)

        files.push(fileBlob)
      }
    }

    return files
  }

  async fetchFile(url) {
    try {
      const response = await fetch(url)
      const blob     = await response.blob()
      let filename   = null

      if (this.dataValue.hasOwnProperty("title")) {
        filename = `${this.dataValue.title}.${url.split(".").pop()}`
      } else {
        filename = url.split("/").pop()
      }

      return new File([blob], filename)
    } catch (error) {
      console.error(error)
    }
  }

  get canShareLinks() {
    return navigator.canShare && navigator.canShare({
      url: ""
    })
  }

  get canShareFiles() {
    const file = new File([], "test.ics")

    return navigator.canShare && navigator.canShare({
      files: [file]
    })
  }
}
