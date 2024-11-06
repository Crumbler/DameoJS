import { PageIcon } from 'interface/pageIcon';
import { PageBackground } from 'interface/pageBackground';
import { InterfaceResizer } from 'interface/interfaceResizer';

function onLoad() {
  InterfaceResizer.register();
  PageBackground.generateAndSet();
  PageIcon.generateAndSet();
}

onLoad();
