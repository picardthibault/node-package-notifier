import React from 'react';
import { Button, Form, Input } from 'antd';
import { useParams } from 'react-router-dom';

interface NotifierForm {
  packageName: string;
}

export const NotifierForm = (): JSX.Element => {
  const { id } = useParams();

  const [formInstance] = Form.useForm<NotifierForm>();

  const onFinish = () => {
    window.notifierManagement.create(formInstance.getFieldsValue());
  };

  return (
    <>
      <h1>Notifier Form</h1>
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
          Create
        </Button>
      </Form>
    </>
  );
};
