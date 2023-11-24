import { CronJob } from 'cron';
import { nativeImage, Notification } from 'electron';
import { updateAllStoredPackages } from '../services/package/PackageService';
import { PackageStore } from '../store/PackageStore';
import * as path from 'path';
import { ressourcePathFolder } from '..';
import i18n from '../i18n';
import log from 'electron-log';

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
          icon: nativeImage.createFromPath(
            path.join(ressourcePathFolder, 'logo.png'),
          ),
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
