import React, { useCallback, useEffect, useState } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import { ParsedDependency } from '../../../../types/ProjectListenerArgs';
import i18next from '../../../i18n';
import LatestVersionCell from './LatestVersionCell';
import { useCompare } from '../../../hooks/useCompare';

interface DependenciesTableProps {
  dependencies: ParsedDependency[];
}

const DependenciesTable: React.FunctionComponent<DependenciesTableProps> = (
  props,
) => {
  const { dependencies } = props;
  const hasDependenciesChanged = useCompare(dependencies);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const hasCurrentPageChanged = useCompare(currentPage);

  const [pageSize, setPageSize] = useState<number>(10);
  const hasPageSizeChanged = useCompare(pageSize);

  const [dependencyLatestVersions, setDependencyLatestVersions] = useState<
    Map<string, string | undefined>
  >(new Map<string, string | undefined>());

  const fetchLatestVersion = useCallback(() => {
    setIsLoading(true);
    const displayedDependencies = dependencies.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
    const dependenciesTofetch = displayedDependencies
      .filter((dependency) => !dependencyLatestVersions.has(dependency.name))
      .map((dependency) => dependency.name);

    window.projectManagement
      .fetchLatestVersions(dependenciesTofetch)
      .then((fetchedDependencyLatestVersions) => {
        setDependencyLatestVersions(
          new Map<string, string | undefined>([
            ...dependencyLatestVersions,
            ...fetchedDependencyLatestVersions,
          ]),
        );
        setIsLoading(false);
      });
  }, [dependencies, pageSize, currentPage, dependencyLatestVersions]);

  useEffect(() => {
    if (hasDependenciesChanged || hasCurrentPageChanged || hasPageSizeChanged) {
      fetchLatestVersion();
    }
  }, [
    dependencies,
    pageSize,
    currentPage,
    hasCurrentPageChanged,
    hasPageSizeChanged,
    dependencyLatestVersions,
  ]);

  const dependenciesTableColumns: ColumnsType<ParsedDependency> = [
    {
      title: i18next.t('project.details.table.columns.name'),
      dataIndex: 'name',
      key: 'name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: i18next.t('project.details.table.columns.currentVersion'),
      dataIndex: 'currentVersion',
      key: 'currentVersion',
    },
    {
      title: i18next.t('project.details.table.columns.latestVersion'),
      key: 'latestVersion',
      dataIndex: 'name',
      render: (name: string) => (
        <LatestVersionCell
          isLoading={isLoading}
          latestVersion={dependencyLatestVersions.get(name)}
        />
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
        current: currentPage,
        pageSize: pageSize,
        onChange: (page: number, pageSize: number) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        },
      }}
    />
  );
};

export default DependenciesTable;
