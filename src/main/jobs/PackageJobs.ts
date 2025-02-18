import { CronJob } from 'cron';
import { Notification } from 'electron';
import { updateAllStoredPackages } from '@main/services/package/PackageService';
import { PackageStore } from '@main/store/PackageStore';
import i18n from '../i18n';
import log from 'electron-log';
import { appIcon } from '@main/helpers/AppIconHelper';

export function launchUpdatePackageJob() {
  new CronJob(
    '0 0 */1 * * *',
    async function () {
      log.info('Update package job - start');
      const packagesWithNewVersion = await updateAllStoredPackages();
      packagesWithNewVersion.forEach((packageId) => {
        const packageData = PackageStore.get().getPackage(packageId);
        new Notification({
          title: i18n.t('package.newVersion.title', {
            name: packageData.name,
          }),
          body: i18n.t('package.newVersion.body', {
            version: packageData.latest,
            name: packageData.name,
          }),
          icon: appIcon,
        }).show();
      });
      log.info('Update Package job - end');
    },
    null,
    true,
    undefined,
    undefined,
    true,
  );
}
