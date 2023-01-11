import { CronJob } from 'cron';
import { updateNotifiersData } from '../services/package/NotifierService';

export const updateNotifierJob = new CronJob(
  '0 */1 * * * *',
  async function () {
    const notifiersWithNewVersion = await updateNotifiersData();
    // TODO : Send a notifications to the user for each notifier with new version
    // new Notification({ title: 'Test', body: 'Test'}).show();
  },
  null,
  false,
);
