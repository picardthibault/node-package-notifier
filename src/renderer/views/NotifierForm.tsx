import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NotifierForm {
  packageName: string;
}

export const NotifierForm = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

  const [formInstance] = Form.useForm<NotifierForm>();

  const [notifier, setNotifier] = useState<{ name: string } | null>(null);

  useEffect(() => {
    if (id) {
      const notifierData = window.notifierManagement.get(id);
      setNotifier(notifierData);
      formInstance.setFieldsValue({
        packageName: notifierData.name,
      });
    }
  }, [id]);

  const onFinish = () => {
    window.notifierManagement.create(formInstance.getFieldsValue());
  };

  return (
    <>
      <h1>{t(`notifier.title.${notifier === null ? 'create' : 'update'}`)}</h1>
      <Form
        name="notifierForm"
        form={formInstance}
        initialValues={{
          packageName: '',
        }}
        onFinish={onFinish}
      >
        <Form.Item label="Package name" name="packageName">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          {t(`notifier.button.${notifier === null ? 'create' : 'update'}`)}
        </Button>
      </Form>
    </>
  );
};
