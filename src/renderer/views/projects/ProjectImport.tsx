import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../../components/Title/Title';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Space } from 'antd';
import ActionButton from '../../components/Button/ActionButton';
import { IpcRendererEvent } from 'electron';
import {
  ProjectImportArgs,
  ProjectImportResult,
} from '../../../types/ProjectInfo';
import { openAlert } from '../../components/Alert/Alert';

const ProjectImport: FunctionComponent = () => {
  const { t } = useTranslation();

  const [formInstance] = useForm();

  const [projectNameValidationResult, setProjectNameValidationResult] =
    useState<string | undefined>(undefined);

  const [projectPathValidationResult, setProjectPathValidationResult] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    const listener = (event: IpcRendererEvent, validationResult: string) => {
      setProjectNameValidationResult(validationResult);
    };

    const cleanListener =
      window.projectManagement.validateProjectNameListener(listener);

    return cleanListener;
  });

  useEffect(() => {
    const listener = (event: IpcRendererEvent, validationResult: string) => {
      setProjectPathValidationResult(validationResult);
    };

    const cleanListener =
      window.projectManagement.validateProjectPathListener(listener);

    return cleanListener;
  });

  useEffect(() => {
    const listener = (
      event: IpcRendererEvent,
      importResult: ProjectImportResult,
    ) => {
      if (importResult.error) {
        openAlert(
          'error',
          t('project.import.alert.title.error'),
          importResult.error,
        );
      } else {
        // TODO : Open project view
        console.log('end');
      }
    };

    const cleanListener =
      window.projectManagement.projectImportListener(listener);

    return cleanListener;
  });

  const resetFieldError = (fieldName: string) => {
    const fieldErrors = formInstance.getFieldError(fieldName);
    if (fieldErrors.length > 0) {
      // Reset field errors
      formInstance.setFields([
        {
          name: fieldName,
          value: formInstance.getFieldValue(fieldName),
          errors: [],
        },
      ]);
    }
  };

  const onFinish = () => {
    // TODO : Set up a loading

    const projectImportArgs: ProjectImportArgs = {
      name: formInstance.getFieldValue('projectName'),
      path: formInstance.getFieldValue('projectPath'),
    };

    window.projectManagement.projectImport(projectImportArgs);
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
          label={t('project.import.form.field.projectName')}
          name="projectName"
          tooltip={t('project.import.tooltip.projectName')}
          rules={[
            {
              required: true,
              message: t('common.form.rules.required'),
            },
            () => ({
              validator() {
                if (projectNameValidationResult) {
                  return Promise.reject(projectNameValidationResult);
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <Input
            placeholder={t('project.import.form.placeholder.projectName')}
            onChange={() => resetFieldError('projectName')}
            onBlur={() => {
              const projectPath = formInstance.getFieldValue('projectName');
              if (projectPath) {
                // Launch project name validation
                window.projectManagement.validateProjectName(projectPath);
              }
            }}
          />
        </Form.Item>

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
                if (projectPathValidationResult) {
                  return Promise.reject(projectPathValidationResult);
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <Input
            placeholder={t('project.import.form.placeholder.projectPath')}
            onChange={() => resetFieldError('projectPath')}
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
