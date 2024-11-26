import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '@renderer/components/Loading/Loading';
import ErrorIcon from '@renderer/components/Icon/ErrorIcon';
import PackageVersionTag, {
  PackageVersionTagColor,
} from '@renderer/components/Tag/Tag';
import { computeTagColor, computeTagTooltip } from './LatestVersionCellUtils';

interface Props {
  dependencyName: string;
  dependencyCurrenVersion: string;
  registryUrl?: string;
}

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
