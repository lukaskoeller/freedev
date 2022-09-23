import { ReactiveController, ReactiveControllerHost } from "lit";

export class SlotController implements ReactiveController {
  constructor(protected host: ReactiveControllerHost & HTMLElement, protected slotName: string = "") {
    this.host = host
    host.addController(this)
    this.slotName = slotName
  }

  hostConnected() {
    this.host.shadowRoot?.addEventListener("slotchange", this.handleSlotChange)
  }

  hostDisconnected() {
    this.host.shadowRoot?.removeEventListener("slotchange", this.handleSlotChange)
  }

  get hasContent() {
    return this.content.length !== 0
  }

  get content() {
    const selector = this.slotName ? `[slot="${this.slotName}"]` : `:not([slot])`
    return this.host.querySelectorAll(selector)
  }

  private handleSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement

    if (slot.name === this.slotName) {
      this.onChange(e)
    }
  }

  protected onChange(_e: Event) {
    this.host.requestUpdate()
  }
}