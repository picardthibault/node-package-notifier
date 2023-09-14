import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../../components/Title/Title';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Space } from 'antd';
import ActionButton from '../../components/Button/ActionButton';

const ProjectImport: FunctionComponent = () => {
  const { t } = useTranslation();

  const [formInstance] = useForm();

  const projectPathValidation = (value: string): Promise<void> => {
    if (!value) {
      return Promise.resolve();
    }

    const validationResult =
      window.projectManagement.validateProjectPath(value);

    if (!validationResult.isDirectory) {
      return Promise.reject(t('project.import.form.errors.notDirectory'));
    }

    if (!validationResult.hasPackageJson) {
      return Promise.reject(t('project.import.form.errors.noPackageJson'));
    }

    return Promise.resolve();
  };

  const onFinish = () => {
    console.log('Finished');
  };

  return (
    <>
      <Title content={t('project.import.title')} />
      <Form
        name="projectImport"
        form={formInstance}
        initialValues={{
          projectPath: '',
        }}
        labelAlign="left"
        labelCol={{ lg: 5, xl: 3 }}
        onFinish={onFinish}
      >
        <Form.Item
          label={t('project.import.form.field.projectPath')}
          name="projectPath"
          tooltip={t('project.import.tooltip.projectPath')}
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: t('common.form.rules.required'),
            },
            () => ({
              validator(_, value) {
                return projectPathValidation(value);
              },
            }),
          ]}
        >
          <Input
            placeholder={t('project.import.form.placeholder.projectPath')}
          />
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <ActionButton type="primary" htmlType="submit">
              {t('project.import.buttons.import')}
            </ActionButton>
          </Space>
        </div>
      </Form>
    </>
  );
};

export default ProjectImport;
