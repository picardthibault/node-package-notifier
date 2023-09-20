import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../../components/Title/Title';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Space } from 'antd';
import ActionButton from '../../components/Button/ActionButton';
import { IpcRendererEvent } from 'electron';
import { ProjectPathValidationResult } from '../../../types/ProjectInfo';

const ProjectImport: FunctionComponent = () => {
  const { t } = useTranslation();

  const [formInstance] = useForm();

  const [projectPathValidationResult, setProjectPathValidationResult] =
    useState<ProjectPathValidationResult | undefined>(undefined);

  useEffect(() => {
    const listener = (
      event: IpcRendererEvent,
      validationResult: ProjectPathValidationResult,
    ) => {
      setProjectPathValidationResult(validationResult);
    };

    const cleanListener =
      window.projectManagement.validateProjectPathListener(listener);

    return cleanListener;
  });

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
        validateTrigger="onSubmit"
      >
        <Form.Item
          label={t('project.import.form.field.projectPath')}
          name="projectPath"
          tooltip={t('project.import.tooltip.projectPath')}
          rules={[
            {
              required: true,
              message: t('common.form.rules.required'),
            },
            () => ({
              validator() {
                if (projectPathValidationResult === undefined) {
                  return Promise.resolve();
                }

                if (!projectPathValidationResult.isDirectory) {
                  return Promise.reject(
                    t('project.import.form.errors.notDirectory'),
                  );
                }

                if (!projectPathValidationResult.hasPackageJson) {
                  return Promise.reject(
                    t('project.import.form.errors.noPackageJson'),
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            placeholder={t('project.import.form.placeholder.projectPath')}
            onChange={() => {
              const fieldErrors = formInstance.getFieldError('projectPath');
              if (fieldErrors.length > 0) {
                // Reset field errors
                formInstance.setFields([
                  {
                    name: 'projectPath',
                    value: formInstance.getFieldValue('projectPath'),
                    errors: [],
                  },
                ]);
              }
            }}
            onBlur={() => {
              const projectPath = formInstance.getFieldValue('projectPath');
              if (projectPath) {
                // Launch project path validation
                window.projectManagement.validateProjectPath(projectPath);
              }
            }}
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
