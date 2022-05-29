import { ReactiveController, ReactiveControllerHost } from 'lit';

export type EventType = Event;

export class EventController implements ReactiveController {
  host: ReactiveControllerHost & Element;
  type: Event["type"];
  onEvent!: (event: EventType) => void;

  constructor(
    host: ReactiveControllerHost & Element,
    type: EventType["type"],
    method: (event: EventType) => void,
  ) {
    (this.host = host).addController(this);
    this.type = type;
    this.onEvent = method;
  }

  hostConnected(): void {
    this.host.addEventListener(this.type, this.onEvent);
  }

  hostDisconnected() {
    this.host.removeEventListener(this.type, this.onEvent);
  }
};

export function addListener(
  host: ReactiveControllerHost & Element,
  type: Event["type"],
  method: (event: EventType) => void
) {
  const eventController = new EventController(host, type, method);
  host.addController(eventController);
}
