import { UIAbility } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';

export default class EntryAbility extends UIAbility {
  onWindowStageCreate(windowStage: window.WindowStage): void {
    try {
      windowStage.loadContent('pages/Index', (error) => {
        if (error.code) {
          console.error('Unable to load encyclopedia page');
          return;
        }
        try {
          const mainWindow = windowStage.getMainWindowSync();
          mainWindow.setWindowSystemBarProperties({
            statusBarColor: '#0B202B',
            navigationBarColor: '#0B202B',
            statusBarContentColor: '#E8EFED',
            navigationBarContentColor: '#DEC17D'
          }).catch(() => console.error('Unable to style system bars'));
        } catch {
          console.error('Unable to style encyclopedia window');
        }
      });
    } catch {
      console.error('Unable to initialize encyclopedia window');
    }
  }
}
