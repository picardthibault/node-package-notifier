import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NotifierFormField {
  packageName: string;
}

interface NotifierData {
  name: string;
}

export const NotifierForm = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [formInstance] = Form.useForm<NotifierFormField>();

  const [notifier, setNotifier] = useState<NotifierData | null>(null);

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
    if (notifier === null) {
      window.notifierManagement.create(formInstance.getFieldsValue());
    } else {
      window.notifierManagement.update({
        notifierId: id,
        ...formInstance.getFieldsValue(),
      });
    }
  };

  return (
    <>
      <h1>{t(`notifier.title.${notifier === null ? 'create' : 'update'}`)}</h1>
      <Button type="primary" onClick={() => navigate('/')}>
        {t('notifier.button.back')}
      </Button>
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
