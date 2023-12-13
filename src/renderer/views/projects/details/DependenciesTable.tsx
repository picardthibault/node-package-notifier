import React from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import i18next from '../../../i18n';
import LatestVersionCell from './LatestVersionCell';
import { ParsedDependency } from '../../../../types/ProjectInfo';

interface DependenciesTableProps {
  dependencies: ParsedDependency[];
  registryUrl?: string;
}

const DependenciesTable: React.FunctionComponent<DependenciesTableProps> = (
  props,
) => {
  const { dependencies, registryUrl } = props;

  const dependenciesTableColumns: ColumnsType<ParsedDependency> = [
    {
      title: i18next.t('project.details.table.columns.name'),
      dataIndex: 'name',
      key: 'name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: i18next.t('project.details.table.columns.version'),
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: i18next.t('project.details.table.columns.latestVersion'),
      key: 'latestVersion',
      dataIndex: 'name',
      render: (name: string) => (
        <LatestVersionCell dependencyName={name} registryUrl={registryUrl} />
      ),
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
