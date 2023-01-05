import { NotifierConfig } from '../../store/NotifierStore';
import { NpmRegistryApi } from '../api/NpmRegistryApi';

export async function updatePackageData(
  notifierConfig: NotifierConfig,
): Promise<void> {
  try {
    const notifierData = await NpmRegistryApi.getPackageInfo(
      notifierConfig.name,
    );
  } catch (err) {
    console.error(
      `Error while fetching ${notifierConfig.name} package data`,
      err,
    );
  }
}
