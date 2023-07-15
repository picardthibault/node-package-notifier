import React, { useEffect } from 'react';
import { Form, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionButton from '../components/Button/ActionButton';
import { IpcRendererEvent } from 'electron';
import Title from '../components/Title/Title';
import { routePaths } from '../routes';
import { openAlert } from '../components/Alert/Alert';

interface PackageFormField {
  packageName: string;
}

export const PackageCreation = (): JSX.Element => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [formInstance] = Form.useForm<PackageFormField>();

  useEffect(() => {
    const createListener = (
      event: IpcRendererEvent,
      errorMessage: string | undefined,
    ) => {
      if (!errorMessage) {
        openAlert('success', t('package.creation.alert.title.success'));
        navigate(routePaths.packageList.generate());
      } else {
        openAlert(
          'error',
          t('package.creation.alert.title.error'),
          t('package.creation.alert.description.error', {
            cause: errorMessage,
          }),
        );
      }
    };
    const cleanListener =
      window.packageManagement.createListener(createListener);
    return cleanListener;
  });

  const onFinish = () => {
    window.packageManagement.create(formInstance.getFieldsValue());
  };

  return (
    <>
      <Title content={t('package.creation.title')} />
      <Form
        name="packageCreationForm"
        form={formInstance}
        initialValues={{
          packageName: '',
          registryUrl: '',
        }}
        labelAlign="left"
        labelCol={{ lg: 5, xl: 3 }}
        onFinish={onFinish}
      >
        <Form.Item
          label={t('package.creation.form.field.name')}
          name="packageName"
          rules={[
            {
              required: true,
              message: t('package.creation.form.rules.required'),
            },
          ]}
        >
          <Input placeholder={t('package.creation.form.placeholder.name')} />
        </Form.Item>
        <Form.Item
          label={t('package.creation.form.field.registryUrl')}
          name="registryUrl"
          tooltip={t('package.creation.tooltip.registryUrl')}
          validateTrigger="onBlur"
          rules={[
            { type: 'url', message: t('package.creation.form.rules.url') },
          ]}
        >
          <Input
            placeholder={t('package.creation.form.placeholder.registryUrl')}
          />
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <ActionButton
              type="default"
              danger={true}
              onClick={() => navigate('/')}
            >
              {t('package.creation.buttons.cancel')}
            </ActionButton>
            <ActionButton type="primary" htmlType="submit">
              {t('package.creation.buttons.create')}
            </ActionButton>
          </Space>
        </div>
      </Form>
    </>
  );
};
