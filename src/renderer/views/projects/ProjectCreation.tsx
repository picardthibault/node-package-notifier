import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../../components/Title/Title';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Space } from 'antd';
import ActionButton from '../../components/Button/ActionButton';
import { openAlert } from '../../components/Alert/Alert';
import { ProjectCreationArgs } from '../../../types/ProjectListenerArgs';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../routes';
import RegistryField from '../../components/Form/RegistryField';

const ProjectCreation: FunctionComponent = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [formInstance] = useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const onFinish = async () => {
    setIsLoading(true);

    const projectCreationArgs: ProjectCreationArgs = {
      name: formInstance.getFieldValue('projectName'),
      path: formInstance.getFieldValue('projectPath'),
      registryUrl: formInstance.getFieldValue('registryUrl'),
    };

    window.projectManagement
      .create(projectCreationArgs)
      .then((projectCreationResult) => {
        setIsLoading(false);
        if (projectCreationResult.error) {
          openAlert(
            'error',
            t('project.creation.alert.title.error'),
            projectCreationResult.error,
          );
        } else {
          openAlert('success', t('project.creation.alert.title.success'));
          window.projectManagement.getProjectsSumUp();
          navigate(
            routePaths.projectDetails.generate(
              projectCreationResult.projectKey,
            ),
          );
        }
      });
  };

  return (
    <>
      <Title content={t('project.creation.title')} />
      <Form
        name="projectCreation"
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
          label={t('project.creation.form.field.projectName')}
          name="projectName"
          tooltip={t('project.creation.tooltip.projectName')}
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
                    throw new Error(
                      t('project.creation.form.rules.projectName'),
                    );
                  }
                }
              },
            }),
          ]}
        >
          <Input
            placeholder={t('project.creation.form.placeholder.projectName')}
            onChange={() => resetFieldError('projectName')}
          />
        </Form.Item>

        <Form.Item
          label={t('project.creation.form.field.projectPath')}
          name="projectPath"
          tooltip={t('project.creation.tooltip.projectPath')}
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
            placeholder={t('project.creation.form.placeholder.projectPath')}
            onChange={() => resetFieldError('projectPath')}
          />
        </Form.Item>

        <RegistryField toolTip={t('project.creation.tooltip.registryUrl')} />

        <div style={{ textAlign: 'center' }}>
          <Space>
            <ActionButton type="primary" loading={isLoading} htmlType="submit">
              {t('project.creation.buttons.create')}
            </ActionButton>
          </Space>
        </div>
      </Form>
    </>
  );
};

export default ProjectCreation;
