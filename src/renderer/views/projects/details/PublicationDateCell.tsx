import ErrorIcon from '@renderer/components/Icon/ErrorIcon.js';
import Loading from '@renderer/components/Loading/Loading.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const usePublicationDate = (
  dependencyName: string,
  dependencyCurrentVersion: string,
  registryUrl?: string,
) => {
  const [state, setState] = useState<{
    isLoading: boolean;
    publicationDate: Date | undefined;
  }>({
    isLoading: true,
    publicationDate: undefined,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchPublicationDate = async () => {
      const result = await window.projectManagement.fetchPublicationDate({
        dependencyName: dependencyName,
        dependencyVersion: dependencyCurrentVersion,
        registryUrl: registryUrl,
      });

      if (!cancelled) {
        setState({
          isLoading: false,
          publicationDate: result ? new Date(result) : undefined,
        });
      }
    };

    void fetchPublicationDate();

    return () => {
      cancelled = true;
    };
  }, [dependencyName, dependencyCurrentVersion, registryUrl]);

  return state;
};

interface Props {
  dependencyName: string;
  dependencyCurrentVersion: string;
  registryUrl?: string;
}

const PublicationDateCell: React.FunctionComponent<Props> = (props) => {
  const { dependencyName, dependencyCurrentVersion, registryUrl } = props;

  const { t } = useTranslation();

  const { isLoading, publicationDate } = usePublicationDate(
    dependencyName,
    dependencyCurrentVersion,
    registryUrl,
  );

  return (
    <div>
      {isLoading ? (
        <Loading className="cell-loading" />
      ) : publicationDate ? (
        publicationDate.toLocaleDateString()
      ) : (
        <ErrorIcon tooltip={t('project.details.table.values.unableToFetch')} />
      )}
    </div>
  );
};

export default PublicationDateCell;
