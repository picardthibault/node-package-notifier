import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '@renderer/components/Loading/Loading.js';
import ErrorIcon from '@renderer/components/Icon/ErrorIcon.js';
import PackageVersionTag, {
  PackageVersionTagColor,
} from '@renderer/components/Tag/Tag.js';
import {
  computeTagColor,
  computeTagTooltip,
} from './LatestVersionCellUtils.js';

const useLatestVersion = (
  dependencyName: string,
  dependencyCurrenVersion: string,
  registryUrl?: string,
) => {
  const [state, setState] = useState<{
    isLoading: boolean;
    latestVersion: string | undefined;
    versionTagColor: PackageVersionTagColor | undefined;
  }>({
    isLoading: true,
    latestVersion: undefined,
    versionTagColor: undefined,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchLatestVersion = async () => {
      const result = await window.projectManagement.fetchLatestVersion({
        dependencyName: dependencyName,
        registryUrl: registryUrl,
      });

      if (!cancelled) {
        setState({
          isLoading: false,
          latestVersion: result,
          versionTagColor: computeTagColor(dependencyCurrenVersion, result),
        });
      }
    };

    void fetchLatestVersion();

    return () => {
      cancelled = true;
    };
  }, [dependencyName, dependencyCurrenVersion, registryUrl]);

  return state;
};

interface Props {
  dependencyName: string;
  dependencyCurrenVersion: string;
  registryUrl?: string;
}

const LatestVersionCell: React.FunctionComponent<Props> = (props) => {
  const { dependencyName, dependencyCurrenVersion, registryUrl } = props;

  const { t } = useTranslation();

  const { isLoading, latestVersion, versionTagColor } = useLatestVersion(
    dependencyName,
    dependencyCurrenVersion,
    registryUrl,
  );

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
