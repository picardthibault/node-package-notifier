import { CronJob } from 'cron';
import { nativeImage, Notification } from 'electron';
import { updateNotifiersData } from '../services/package/NotifierService';
import { NotifierStore } from '../store/NotifierStore';
import * as path from 'path';
import { ressourcePathFolder } from '..';
import i18n from '../i18n';

export const updateNotifierJob = new CronJob(
  '0 */1 * * * *',
  async function () {
    const notifiersWithNewVersion = await updateNotifiersData();
    notifiersWithNewVersion.forEach((notifierId) => {
      const notifierData = NotifierStore.get().getNotifier(notifierId);
      new Notification({
        title: i18n.t('notification.newVersion.title', {
          name: notifierData.name,
        }),
        body: i18n.t('notification.newVersion.body', {
          version: notifierData.latest,
          name: notifierData.name,
        }),
        icon: nativeImage.createFromPath(
          path.join(ressourcePathFolder, 'logo.png'),
        ),
      }).show();
    });
  },
  null,
  false,
);
