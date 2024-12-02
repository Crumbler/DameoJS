/**
 * DOM Element utility class
 */
export class Elements {
  /**
   * Finds a DOM element by id, otherwise throws an {@link Error}
   * @param id Element id
   * @returns Element
   * @throws {Error} When the element cannot be found
   */
  public static findById<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = document.getElementById(id) as T | null;

    if (element === null) {
      throw new Error('Failed to find element with id ' + id);
    }

    return element;
  }
}
