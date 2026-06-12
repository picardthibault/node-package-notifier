import React from 'react';
import LatestVersionCell from './LatestVersionCell.js';
import { ParsedDependency } from '@type/ProjectInfo.js';
import ActionButton from '@renderer/components/Button/ActionButton.js';
import {
  EyeOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { routePaths } from '../../../../routes.js';
import { Space, Table, TableColumnsType } from 'antd';
import { useUnit } from 'effector-react';
import { $packageList } from '@renderer/stores/packages/PackageListStore.js';
import { GetPackagesResult } from '@type/PackageListenerArgs.js';
import { navigateTo } from '@renderer/stores/menu/MenuStore.js';
import {
  TabPageConfiguration,
  TabKey,
  updateTabPageConfig,
} from '@renderer/stores/projects/DependenciesTabStore.js';
import PackageVersionTag from '@renderer/components/Tag/Tag.js';
import PublicationDateCell from './PublicationDateCell.js';
import { selectPackageDetails } from '@renderer/stores/packages/events/PackagesEvents.js';
import {
  createPackageFx,
  deletePackageFx,
} from '@renderer/stores/packages/effects/PackagesEffects.js';

interface DependenciesTableProps {
  tabKey: TabKey;
  dependencies: ParsedDependency[];
  registryUrl: string;
  pageConfig: TabPageConfiguration;
}

const DependenciesTable: React.FunctionComponent<DependenciesTableProps> = (
  props,
) => {
  const { tabKey, dependencies, registryUrl, pageConfig: tabConfig } = props;

  const { t } = useTranslation();

  const { fetchedPackages } = useUnit($packageList);

  const dependenciesTableColumns: (
    followedPackages: GetPackagesResult,
    registryUrl: string,
  ) => TableColumnsType<ParsedDependency> = (
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
      render: (version: string) => <PackageVersionTag content={version} />,
    },
    {
      title: 'Publication date',
      key: 'publicationDate',
      render: (record: ParsedDependency) => (
        <PublicationDateCell
          dependencyName={record.name}
          dependencyCurrentVersion={record.version}
          registryUrl={registryUrl}
        />
      ),
    },
    {
      title: t('project.details.table.columns.latestVersion'),
      key: 'latestVersion',
      render: (record: ParsedDependency) => (
        <LatestVersionCell
          dependencyName={record.name}
          dependencyCurrenVersion={record.version}
          registryUrl={registryUrl}
        />
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
                selectPackageDetails({
                  packageName: record.name,
                  registryUrl: registryUrl,
                });
                navigateTo(routePaths.packageDetails.generate());
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
                  void deletePackageFx(
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
                  void createPackageFx({
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
        current: tabConfig.page,
        defaultPageSize: tabConfig.pageSize,
        position: ['bottomCenter'],
        showSizeChanger: true,
        onChange(page: number, pageSize: number) {
          updateTabPageConfig({ tabKey, page, pageSize });
        },
      }}
    />
  );
};

export default DependenciesTable;
