import { NotifierConfig, NotifierStore } from '../../store/NotifierStore';
import { NpmRegistryApi } from '../api/NpmRegistryApi';

export async function updateNotifiersData(): Promise<string[]> {
  const notifierWithNewVersion: string[] = [];

  const notifiers = NotifierStore.get().getNotifiers();
  for (const key of Object.keys(notifiers)) {
    try {
      console.debug(`Update notifier "${notifiers[key].name}" start`);
      const notifierData = await NpmRegistryApi.getPackageInfo(
        notifiers[key].name,
      );
      const newNotifierConfig: NotifierConfig = {
        ...notifiers[key],
        latest: notifierData['dist-tags'].latest,
      };
      if (notifiers[key].latest !== newNotifierConfig.latest) {
        notifierWithNewVersion.push(key);
      }
      NotifierStore.get().updateNotifier(key, newNotifierConfig);
      console.debug(`Update notifier "${notifiers[key].name}" end`);
    } catch (err) {
      console.error(
        `Error while updating ${notifiers[key].name} package data`,
        err,
      );
    }
  }

  return notifierWithNewVersion;
}
