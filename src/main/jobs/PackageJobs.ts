import { CronJob } from 'cron';
import { nativeImage, Notification } from 'electron';
import { updatePackagesData } from '../services/package/PackageService';
import { PackageStore } from '../store/PackageStore';
import * as path from 'path';
import { ressourcePathFolder } from '..';
import i18n from '../i18n';

export function launchUpdatePackageJob() {
  new CronJob(
    '0 0 */1 * * *',
    async function () {
      const packagesWithNewVersion = await updatePackagesData();
      packagesWithNewVersion.forEach((packageId) => {
        const packageData = PackageStore.get().getPackage(packageId);
        // TODO : Voir pour modifier le nom de l'appli sur la notification
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
    },
    null,
    true,
    undefined,
    undefined,
    true,
  );
}
