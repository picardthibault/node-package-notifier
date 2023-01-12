import { CronJob } from 'cron';
import { nativeImage, Notification } from 'electron';
import { updateNotifiersData } from '../services/package/NotifierService';
import { NotifierStore } from '../store/NotifierStore';
import * as path from 'path';
import { ressourcePathFolder } from '..';

export const updateNotifierJob = new CronJob(
  '0 */1 * * * *',
  async function () {
    const notifiersWithNewVersion = await updateNotifiersData();
    notifiersWithNewVersion.forEach((notifierId) => {
      const notifierData = NotifierStore.get().getNotifier(notifierId);
      new Notification({
        title: `${notifierData.name} new version !`,
        body: `Version ${notifierData.latest} of ${notifierData.name} has been released, feel free to update your project !`,
        icon: nativeImage.createFromPath(
          path.join(ressourcePathFolder, 'logo.png'),
        ),
      }).show();
    });
  },
  null,
  false,
);
