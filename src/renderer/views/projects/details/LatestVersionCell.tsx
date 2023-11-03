import React, { useEffect, useState } from 'react';
import { openAlert } from '../../../components/Alert/Alert';
import { useTranslation } from 'react-i18next';
import Loading from '../../../components/Loading/Loading';
import ErrorIcon from '../../../components/Icon/ErrorIcon';

interface Props {
  isLoading: boolean;
  latestVersion: string | undefined;
}

const LatestVersionCell: React.FunctionComponent<Props> = (props) => {
  const { isLoading, latestVersion } = props;

  const { t } = useTranslation();

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
