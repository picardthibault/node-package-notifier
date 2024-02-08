import React, { useEffect } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import LatestVersionCell from './LatestVersionCell';
import { ParsedDependency } from '@type/ProjectInfo';
import ActionButton from '@renderer/components/Button/ActionButton';
import {
  EyeOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { routePaths } from '../../../routes';
import { updatePackageDetails } from '@renderer/stores/PackageDetailsStore';
import { Space } from 'antd';
import { useUnit } from 'effector-react';
import { packageListStore } from '@renderer/stores/PackageListStore';
import { createPackage, deletePackage } from '@renderer/effects/PackageEffect';
import { GetPackagesResult } from '@type/PackageListenerArgs';
import { openAlert } from '@renderer/components/Alert/Alert';
import { navigateTo } from '@renderer/effects/MenuEffect';

interface DependenciesTableProps {
  dependencies: ParsedDependency[];
  registryUrl: string;
}

const DependenciesTable: React.FunctionComponent<DependenciesTableProps> = (
  props,
) => {
  const { dependencies, registryUrl } = props;

  const { t } = useTranslation();

  const { fetchedPackages } = useUnit(packageListStore);

  useEffect(() => {
    return createPackage.done.watch(({ result }) => {
      if (!result) {
        openAlert(
          'success',
          t('project.details.alert.title.dependencyFollowed'),
        );
      } else {
        openAlert(
          'error',
          t('project.details.alert.title.dependencyFollowError'),
          t('project.details.alert.description.dependencyFollowError'),
        );
      }
    });
  });

  useEffect(() => {
    return deletePackage.done.watch(() => {
      openAlert(
        'success',
        t('project.details.alert.title.dependencyUnfollowed'),
      );
    });
  });

  const dependenciesTableColumns: (
    followedPackages: GetPackagesResult,
    registryUrl: string,
  ) => ColumnsType<ParsedDependency> = (
    followedPackages: GetPackagesResult,
  ) => [
    {
      title: t('project.details.table.columns.name'),
      dataIndex: 'name',
      key: 'name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('project.details.table.columns.version'),
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: t('project.details.table.columns.latestVersion'),
      key: 'latestVersion',
      dataIndex: 'name',
      render: (name: string) => (
        <LatestVersionCell dependencyName={name} registryUrl={registryUrl} />
      ),
    },
    {
      title: t('project.details.table.columns.actions'),
      key: 'actions',
      width: '110px',
      render: (record: ParsedDependency) => {
        let followedPackageId: string | undefined;
        for (const packageId of Object.keys(followedPackages)) {
          if (
            followedPackages[packageId].name === record.name &&
            followedPackages[packageId].registryUrl === registryUrl
          ) {
            followedPackageId = packageId;
            break;
          }
        }

        return (
          <Space>
            <ActionButton
              type="primary"
              toolTip={t('project.details.tooltip.viewPackage')}
              onClick={() => {
                updatePackageDetails({
                  packageName: record.name,
                  registryUrl: registryUrl,
                });
                void navigateTo(routePaths.packageDetails.generate());
              }}
            >
              <EyeOutlined />
            </ActionButton>
            {followedPackageId ? (
              <ActionButton
                type="default"
                danger={true}
                toolTip={t('project.details.tooltip.unfollowPackage')}
                onClick={() => {
                  void deletePackage(
                    followedPackageId ? followedPackageId : '',
                  );
                }}
              >
                <MinusCircleOutlined />
              </ActionButton>
            ) : (
              <ActionButton
                type="default"
                toolTip={t('project.details.tooltip.followPackage')}
                onClick={() => {
                  void createPackage({
                    packageName: record.name,
                    registryUrl: registryUrl,
                  });
                }}
              >
                <PlusCircleOutlined />
              </ActionButton>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={dependenciesTableColumns(fetchedPackages, registryUrl)}
      dataSource={dependencies.map((dependency) => ({
        ...dependency,
        key: dependency.name,
      }))}
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: true,
      }}
    />
  );
};

export default DependenciesTable;
