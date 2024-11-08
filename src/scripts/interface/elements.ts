export class Elements {
  public static findById<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = document.getElementById(id) as T | null;

    if (element === null) {
      throw new Error('Failed to find element with id ' + id);
    }

    return element;
  }
}
