import React, { useCallback } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import LatestVersionCell from './LatestVersionCell';
import { ParsedDependency } from '../../../../types/ProjectInfo';
import ActionButton from '../../../components/Button/ActionButton';
import {
  EyeOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../../routes';
import { updatePackageDetails } from '../../../stores/PackageDetailsStore';
import { Space } from 'antd';
import { useStore } from 'effector-react';
import { packageListStore } from '../../../stores/PackageListStore';

interface DependenciesTableProps {
  dependencies: ParsedDependency[];
  registryUrl?: string;
}

const DependenciesTable: React.FunctionComponent<DependenciesTableProps> = (
  props,
) => {
  const { dependencies, registryUrl } = props;

  const { t } = useTranslation();

  const { fetchedPackages } = useStore(packageListStore);

  const navigation = useNavigate();

  const isFollowed = useCallback(
    (packageName: string) =>
      Object.keys(fetchedPackages).filter(
        (packageId) => fetchedPackages[packageId].name === packageName,
      ).length > 0,
    [fetchedPackages],
  );

  const dependenciesTableColumns: ColumnsType<ParsedDependency> = [
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
                navigation(routePaths.packageDetails.generate());
              }}
            >
              <EyeOutlined />
            </ActionButton>
            {isFollowed(record.name) ? (
              <ActionButton
                type="default"
                danger={true}
                toolTip={t('project.details.tooltip.unfollowPackage')}
                onClick={() => {
                  console.log('Unfollow');
                }}
              >
                <MinusCircleOutlined />
              </ActionButton>
            ) : (
              <ActionButton
                type="default"
                toolTip={t('project.details.tooltip.followPackage')}
                onClick={() => {
                  console.log('Follow');
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
      columns={dependenciesTableColumns}
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
