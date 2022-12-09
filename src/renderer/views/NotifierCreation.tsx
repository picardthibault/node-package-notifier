import React from 'react';
import { Button, Form, Input } from 'antd';

interface NotifierCreationForm {
  packageName: string;
}

export const NotifierCreation = (): JSX.Element => {
  const [formInstance] = Form.useForm<NotifierCreationForm>();

  const onFinish = () => {
    window.notifierManagement.create(formInstance.getFieldsValue());
  };

  return (
    <>
      <h1>Notifier Creation</h1>
      <Form
        name="notifierCreation"
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
