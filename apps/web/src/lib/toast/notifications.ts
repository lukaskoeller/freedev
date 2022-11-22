import {
  writable,
  derived,
} from "svelte/store";

export enum NotificationType {
  Default = 'default',
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
  Error = 'error',
  Success = 'success',
}

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
};

/**
 * @todo Disable timeout for errors
 * @todo Enable possibility to close Toast via Button
 */
const NOTIFICATION_TIMEOUT = 3000; // 3 sec

const createNotificationStore = () => {
  const _notifications = writable<Notification[]>([]);

  const send = (
    message: string,
    type: NotificationType = NotificationType.Default
  ) => {
    _notifications.update(state => {
      return [...state, { id: id(), type, message }]
    })
  }
	
	let timers = []

  const notifications = derived(_notifications, ($_notifications, set) => {
    set($_notifications)
    if ($_notifications.length > 0) {
      const timeout = setTimeout(() => {
        _notifications.update(state => {
          state.shift()
          return state
        })
      }, NOTIFICATION_TIMEOUT)
      return () => {
        clearTimeout(timeout)
      }
    }
  });

  const { subscribe } = notifications;

  return {
    subscribe,
    send,
    danger: (msg: string) => send(msg, NotificationType.Danger),
    error: (msg: string) => send(msg, NotificationType.Error),
    warning: (msg: string) => send(msg, NotificationType.Warning),
    info: (msg: string) => send(msg, NotificationType.Info),
    success: (msg: string) => send(msg, NotificationType.Success),
  };
};

function id(): string {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const notifications = createNotificationStore();