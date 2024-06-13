import ErrorIcon from '@renderer/components/Icon/ErrorIcon';
import Loading from '@renderer/components/Loading/Loading';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  dependencyName: string;
  dependencyCurrentVersion: string;
  registryUrl?: string;
}

const delayAction = (callback: () => void) => {
  setTimeout(callback, 100);
};

const PublicationDateCell: React.FunctionComponent<Props> = (props) => {
  const { dependencyName, dependencyCurrentVersion, registryUrl } = props;

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [publicationDate, setPublicationDate] = useState<Date | undefined>();

  const fetchPublicationDate = useCallback(() => {
    setIsLoading(true);
    delayAction(
      () =>
        void window.projectManagement
          .fetchPublicationDate({
            dependencyName: dependencyName,
            dependencyVersion: dependencyCurrentVersion,
            registryUrl: registryUrl,
          })
          .then((result) => {
            setIsLoading(false);
            setPublicationDate(result ? new Date(result) : undefined);
          })
          .catch(() => {
            setIsLoading(false);
          }),
    );
  }, [dependencyName, dependencyCurrentVersion, registryUrl]);

  useEffect(() => {
    fetchPublicationDate();
  }, [fetchPublicationDate]);

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
