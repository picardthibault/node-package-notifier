import React from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import LatestVersionCell from './LatestVersionCell';
import { ParsedDependency } from '../../../../types/ProjectInfo';
import ActionButton from '../../../components/Button/ActionButton';
import { EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../../routes';
import { updatePackageDetails } from '../../../stores/PackageDetailsStore';

interface DependenciesTableProps {
  dependencies: ParsedDependency[];
  registryUrl?: string;
}

const DependenciesTable: React.FunctionComponent<DependenciesTableProps> = (
  props,
) => {
  const { dependencies, registryUrl } = props;

  const { t } = useTranslation();

  const navigation = useNavigate();

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
      render: (record: ParsedDependency) => {
        return (
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
