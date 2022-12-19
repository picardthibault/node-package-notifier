import React, { useEffect, useState } from 'react';
import { NotifierConfig } from '../../main/Store/NotifierStore';
import { IpcRendererEvent } from 'electron';
import { Button, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TableItemType {
  key: number;
  notifierId: string;
  name: string;
}

export const Notifiers = (): JSX.Element => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [notifiers, setNotifiers] = useState<TableItemType[]>([]);

  useEffect(() => {
    // Load Notifiers
    window.notifierManagement.getAll();
  }, []);

  useEffect(() => {
    const notifiersListener = (
      event: IpcRendererEvent,
      notifiers: { [key: string]: NotifierConfig },
    ) => {
      const tableItems: TableItemType[] = Object.keys(notifiers).map(
        (notifierId, index) => ({
          key: index,
          notifierId,
          name: notifiers[notifierId].name,
        }),
      );

      setNotifiers(tableItems);
    };

    const cleanListener =
      window.notifierManagement.getAllListener(notifiersListener);

    return () => {
      cleanListener();
    };
  }, [setNotifiers]);

  const tableColumns: ColumnsType<TableItemType> = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'action',
      title: 'Action',
      width: '50px',
      render: (tableItem: TableItemType) => (
        <Button
          type="primary"
          onClick={() => navigate(`/notifier/${tableItem.notifierId}`)}
        >
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  return (
    <>
      <h1>{t('notifier.title.list')}</h1>
      <Button type="primary" onClick={() => navigate('/notifier')}>
        {t('notifier.button.create')}
      </Button>
      <Table
        columns={tableColumns}
        dataSource={notifiers}
        pagination={{
          defaultPageSize: 10,
          position: ['bottomCenter'],
        }}
      />
    </>
  );
};
