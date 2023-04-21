import React, { useEffect, useState } from 'react';
import { Form, Input, notification, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionButton from '../components/Button/ActionButton';
import { IpcRendererEvent } from 'electron';
import Title from '../components/Title/Title';

interface PackageFormField {
  packageName: string;
}

interface packageData {
  name: string;
}

const openAlert = (title: string, description: string) => {
  notification.error({
    message: title,
    description,
    placement: 'topRight',
  });
};

export const PackageForm = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [formInstance] = Form.useForm<PackageFormField>();

  const [packageData, setPackageData] = useState<packageData | null>(null);

  useEffect(() => {
    if (id) {
      const fetchedPackageData = window.packageManagement.get(id);
      setPackageData(fetchedPackageData);
      formInstance.setFieldsValue({
        packageName: fetchedPackageData.name,
      });
    }
  }, [id]);

  useEffect(() => {
    const createListener = (event: IpcRendererEvent, isAdded: boolean) => {
      if (isAdded) {
        navigate('/');
      } else {
        openAlert(
          t('package.alert.title.create'),
          t('package.alert.description.createOrUpdate'),
        );
      }
    };
    const cleanListener =
      window.packageManagement.createListener(createListener);
    return cleanListener;
  });

  useEffect(() => {
    const updateListener = (event: IpcRendererEvent, isUpdated: boolean) => {
      if (isUpdated) {
        navigate('/');
      } else {
        openAlert(
          t('package.alert.title.update'),
          t('package.alert.description.createOrUpdate'),
        );
      }
    };
    const cleanListener =
      window.packageManagement.updateListener(updateListener);
    return cleanListener;
  });

  const onFinish = () => {
    if (packageData === null) {
      window.packageManagement.create(formInstance.getFieldsValue());
    } else {
      window.packageManagement.update({
        packageId: id,
        ...formInstance.getFieldsValue(),
      });
    }
  };

  return (
    <>
      <Title
        content={t(
          `package.title.${packageData === null ? 'create' : 'update'}`,
        )}
      />

      <Form
        name="packageForm"
        form={formInstance}
        initialValues={{
          packageName: '',
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label={t('package.form.fieldLabel.name')}
          name="packageName"
          rules={[
            { required: true, message: t('package.form.rules.required') },
          ]}
        >
          <Input />
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <ActionButton
              type="default"
              danger={true}
              onClick={() => navigate('/')}
            >
              {t('package.button.cancel')}
            </ActionButton>
            <ActionButton type="primary" htmlType="submit">
              {t(
                `package.button.${packageData === null ? 'create' : 'update'}`,
              )}
            </ActionButton>
          </Space>
        </div>
      </Form>
    </>
  );
};
