import React, { useEffect, useState } from 'react';
import { PackageConfig } from '../../main/store/PackageStore';
import { IpcRendererEvent } from 'electron';
import { Button, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TableItemType {
  key: number;
  packageId: string;
  name: string;
  version: string;
}

export const PackagesView = (): JSX.Element => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [packages, setPackages] = useState<TableItemType[]>([]);

  useEffect(() => {
    // Load packages
    window.packageManagement.getAll();
  }, []);

  useEffect(() => {
    const packagesListener = (
      event: IpcRendererEvent,
      packages: { [key: string]: PackageConfig },
    ) => {
      const tableItems: TableItemType[] = Object.keys(packages).map(
        (packageId, index) => ({
          key: index,
          packageId,
          name: packages[packageId].name,
          version: packages[packageId].latest ? packages[packageId].latest : '',
        }),
      );

      setPackages(tableItems);
    };

    const cleanListener =
      window.packageManagement.getAllListener(packagesListener);

    return () => {
      cleanListener();
    };
  }, [setPackages]);

  const tableColumns: ColumnsType<TableItemType> = [
    {
      key: 'name',
      title: t('package.table.columns.name'),
      dataIndex: 'name',
    },
    {
      key: 'version',
      title: t('package.table.columns.version'),
      dataIndex: 'version',
    },
    {
      key: 'action',
      title: 'Action',
      width: '50px',
      render: (tableItem: TableItemType) => (
        <Button
          type="primary"
          onClick={() => navigate(`/package/${tableItem.packageId}`)}
        >
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  return (
    <>
      <h1>{t('package.title.list')}</h1>
      <Button type="primary" onClick={() => navigate('/package')}>
        {t('package.button.create')}
      </Button>
      <Table
        columns={tableColumns}
        dataSource={packages}
        pagination={{
          defaultPageSize: 10,
          position: ['bottomCenter'],
        }}
      />
    </>
  );
};
