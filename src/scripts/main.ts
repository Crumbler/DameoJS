import { PageIcon } from 'interface/pageIcon';
import { PageBackground } from 'interface/pageBackground';

function onLoad() {
  PageBackground.generateAndSet();
  PageIcon.generateAndSet();
}

onLoad();
