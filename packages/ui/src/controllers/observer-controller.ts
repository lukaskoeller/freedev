import { ReactiveController, ReactiveElement } from "lit"

type ObserveFunction = (value: any, oldValue: any, name: PropertyKey) => void

class PropertyObserverController<T extends ReactiveElement> implements ReactiveController {
  private _value?: any

  set value(value: any) {
    if (this._value !== value) {
      const oldValue = this._value
      this._value = value

      this.callback(value, oldValue, this.propertyName)
    }
  }

  constructor(private host: T, private propertyName: PropertyKey, private callback: ObserveFunction) {
    host.addController(this)
  }

  hostUpdated() {
    this.value = this.host[this.propertyName as keyof T]
  }
}

export function observe(propertyName: string) {
  return function observer(target: any, methodName: string) {
    const proto = target.constructor as typeof ReactiveElement

    proto.addInitializer(el => {
      const method = el[methodName as keyof typeof el] as ObserveFunction
      el.addController(new PropertyObserverController(el, propertyName, method.bind(el)))
    })
  }
}