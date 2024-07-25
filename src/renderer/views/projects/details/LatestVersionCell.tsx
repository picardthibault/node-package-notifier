import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '@renderer/components/Loading/Loading';
import ErrorIcon from '@renderer/components/Icon/ErrorIcon';
import PackageVersionTag, {
  PackageVersionTagColor,
} from '@renderer/components/Tag/Tag';
import i18n from '../../../i18n';

interface Props {
  dependencyName: string;
  dependencyCurrenVersion: string;
  registryUrl?: string;
}

const computeTagColor = (
  currentVersion: string,
  latestVersion?: string,
): PackageVersionTagColor | undefined => {
  if (!latestVersion) {
    return undefined;
  }

  const splitCurrentVersion = currentVersion.split('.');
  const splitLatestVersion = latestVersion.split('.');

  if (splitCurrentVersion.length !== 3 || splitLatestVersion.length !== 3) {
    return undefined;
  }

  if (splitCurrentVersion[0] < splitLatestVersion[0]) {
    return PackageVersionTagColor.RED;
  }

  if (splitCurrentVersion[1] < splitLatestVersion[1]) {
    return PackageVersionTagColor.BLUE;
  }

  if (splitCurrentVersion[2] < splitLatestVersion[2]) {
    return PackageVersionTagColor.GREEN;
  }

  return undefined;
};

const computeTagTooltip = (
  tagColor?: PackageVersionTagColor,
): string | undefined => {
  switch (tagColor) {
    case PackageVersionTagColor.RED:
      return i18n.t('project.details.tooltip.newMajor');
    case PackageVersionTagColor.BLUE:
      return i18n.t('project.details.tooltip.newMinor');
    case PackageVersionTagColor.GREEN:
      return i18n.t('project.details.tooltip.newPatch');
    default:
      return undefined;
  }
};

const LatestVersionCell: React.FunctionComponent<Props> = (props) => {
  const { dependencyName, dependencyCurrenVersion, registryUrl } = props;

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [latestVersion, setLatestVersion] = useState<string | undefined>();

  const [versionTagColor, setVersionTagColor] = useState<
    PackageVersionTagColor | undefined
  >(undefined);

  const fetchLatestVersion = useCallback(() => {
    setIsLoading(true);
    window.projectManagement
      .fetchLatestVersion({
        dependencyName: dependencyName,
        registryUrl: registryUrl,
      })
      .then((result) => {
        setIsLoading(false);
        setLatestVersion(result);
        setVersionTagColor(computeTagColor(dependencyCurrenVersion, result));
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [dependencyName, registryUrl, dependencyCurrenVersion]);

  useEffect(() => {
    fetchLatestVersion();
  }, [fetchLatestVersion]);

  return (
    <div className="last-version-cell">
      {isLoading ? (
        <Loading className="cell-loading" />
      ) : latestVersion ? (
        <PackageVersionTag
          content={latestVersion}
          color={versionTagColor}
          tooltip={computeTagTooltip(versionTagColor)}
        />
      ) : (
        <ErrorIcon tooltip={t('project.details.table.values.unableToFetch')} />
      )}
    </div>
  );
};

export default LatestVersionCell;
