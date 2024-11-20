import { GameInfo } from 'domain/gameInfo';
import { Elements } from './elements';

export class InputHandler {
  private readonly _game: GameInfo;
  private readonly _container = Elements.findById('game-container');

  private registerHandlers() {
    this._container.addEventListener(
      'click',
      (event) => this.handleClick(event),
      true,
    );

    this._container.addEventListener(
      'mousemove',
      (event) => this.handleMove(event),
      true,
    );
  }

  private handleMove(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
  }

  private handleClick(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
  }

  public constructor(game: GameInfo) {
    this._game = game;

    this.registerHandlers();
  }
}
