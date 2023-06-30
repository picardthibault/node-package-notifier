import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title/Title';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Loading from '../components/Loading/Loading';

const PackageDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');

  const [formInstance] = Form.useForm();

  useEffect(() => {
    const packageInfo = window.packageManagement.get(id);
    setTitle(
      packageInfo.name.charAt(0).toUpperCase() + packageInfo.name.slice(1),
    );
    formInstance.setFieldsValue({
      registryUrl: packageInfo.registryUrl,
      licence: packageInfo.license,
      homePage: packageInfo.homePage,
      repository: packageInfo.repository,
      description: packageInfo.description,
    });
    setIsLoading(false);
  }, [id]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Title content={title} />
          <Form
            name="PackageDetails"
            form={formInstance}
            labelCol={{ span: 2, offset: 0 }}
          >
            <Form.Item label="Registry url" name="registryUrl">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Licence" name="licence">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Home page" name="homePage">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Repository" name="repository">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea disabled />
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};

export default PackageDetails;
