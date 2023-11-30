import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../../components/Title/Title';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Space } from 'antd';
import ActionButton from '../../components/Button/ActionButton';
import { IpcRendererEvent } from 'electron';
import { openAlert } from '../../components/Alert/Alert';
import {
  ProjectImportArgs,
  ProjectImportResult,
} from '../../../types/ProjectListenerArgs';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../routes';
import RegistryField from '../../components/Form/RegistryField';

const ProjectImport: FunctionComponent = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [formInstance] = useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const listener = (
      event: IpcRendererEvent,
      importResult: ProjectImportResult,
    ) => {
      setIsLoading(false);
      if (importResult.error) {
        openAlert(
          'error',
          t('project.import.alert.title.error'),
          importResult.error,
        );
      } else {
        openAlert('success', t('project.import.alert.title.success'));
        window.projectManagement.getProjectsDataForMenu();
        navigate(routePaths.projectDetails.generate(importResult.projectKey));
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
    setIsLoading(true);

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
        validateTrigger="onBlur"
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
              async validator(_, value): Promise<void> {
                if (value) {
                  const isProjectNameUsed =
                    await window.projectManagement.isProjectNameUsed(value);
                  if (isProjectNameUsed) {
                    throw new Error(t('project.import.form.rules.projectName'));
                  }
                }
              },
            }),
          ]}
        >
          <Input
            placeholder={t('project.import.form.placeholder.projectName')}
            onChange={() => resetFieldError('projectName')}
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
              async validator(_, value) {
                if (value) {
                  const projectPathValidationError =
                    await window.projectManagement.isProjectPathValid(value);
                  if (projectPathValidationError) {
                    throw new Error(projectPathValidationError);
                  }
                }
              },
            }),
          ]}
        >
          <Input
            placeholder={t('project.import.form.placeholder.projectPath')}
            onChange={() => resetFieldError('projectPath')}
          />
        </Form.Item>

        <RegistryField toolTip={t('project.import.tooltip.')} />

        <div style={{ textAlign: 'center' }}>
          <Space>
            <ActionButton type="primary" loading={isLoading} htmlType="submit">
              {t('project.import.buttons.import')}
            </ActionButton>
          </Space>
        </div>
      </Form>
    </>
  );
};

export default ProjectImport;
