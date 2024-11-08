import { PageIcon } from 'interface/images/pageIcon';
import { PageBackground } from 'interface/images/pageBackground';
import { InterfaceResizer } from 'interface/interfaceResizer';
import { FullscreenIcon } from 'interface/images/fullscreenIcon';
import { RestartIcon } from 'interface/images/restartIcon';
import { UndoIcon } from 'interface/images/undoIcon';
import { Input } from 'interface/input';
import { Timer } from 'interface/timer';

function generateImages() {
  PageBackground.generateAndSet();
  PageIcon.generateAndSet();
  FullscreenIcon.generateAndSet();
  RestartIcon.generateAndSet();
  UndoIcon.generateAndSet();
}

function toggleFullscreen() {
  if (!document.fullscreenEnabled) {
    return;
  }

  if (document.fullscreenElement === null) {
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function onLoad() {
  generateImages();

  InterfaceResizer.register();

  Input.registerOnFullscreen(toggleFullscreen);

  Timer.restart();
}

onLoad();
