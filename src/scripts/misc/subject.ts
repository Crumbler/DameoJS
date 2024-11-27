export type EventHandler<T> = (() => void) | ((arg: T) => void);

export class Subject<T> {
  private readonly _handlers: Array<EventHandler<T>> = [];
  public subscribe(handler: EventHandler<T>) {
    this._handlers.push(handler);
  }

  public raise(arg: T) {
    for (const handler of this._handlers) {
      handler(arg);
    }
  }
}
