import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PackageFormField {
  packageName: string;
}

interface packageData {
  name: string;
}

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

  const onFinish = () => {
    if (packageData === null) {
      window.packageManagement.create(formInstance.getFieldsValue());
    } else {
      window.packageManagement.update({
        packageId: id,
        ...formInstance.getFieldsValue(),
      });
    }
    navigate('/');
  };

  return (
    <>
      <h1>
        {t(`package.title.${packageData === null ? 'create' : 'update'}`)}
      </h1>
      <Button type="primary" onClick={() => navigate('/')}>
        {t('package.button.back')}
      </Button>
      <Form
        name="packageForm"
        form={formInstance}
        initialValues={{
          packageName: '',
        }}
        onFinish={onFinish}
      >
        <Form.Item label={t('package.form.fieldLabel.name')} name="packageName">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          {t(`package.button.${packageData === null ? 'create' : 'update'}`)}
        </Button>
      </Form>
    </>
  );
};
