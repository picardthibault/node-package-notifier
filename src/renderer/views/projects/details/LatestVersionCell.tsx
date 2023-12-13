import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../../components/Loading/Loading';
import ErrorIcon from '../../../components/Icon/ErrorIcon';

interface Props {
  dependencyName: string;
  registryUrl: string;
}

const LatestVersionCell: React.FunctionComponent<Props> = (props) => {
  const { dependencyName, registryUrl } = props;

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [latestVersion, setLatestVersion] = useState<string | undefined>();

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
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [dependencyName, registryUrl]);

  useEffect(() => {
    fetchLatestVersion();
  }, [fetchLatestVersion]);

  return (
    <>
      {isLoading ? (
        <Loading className="cell-loading" />
      ) : latestVersion ? (
        <p>{latestVersion}</p>
      ) : (
        <ErrorIcon tooltip={t('project.details.table.values.unableToFetch')} />
      )}
    </>
  );
};

export default LatestVersionCell;
