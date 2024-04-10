import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@renderer/components/Title/Title';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Space, notification } from 'antd';
import ActionButton from '@renderer/components/Button/ActionButton';
import { ProjectCreationArgs } from '@type/ProjectListenerArgs';
import { routePaths } from '../../routes';
import RegistryField from '@renderer/components/Form/RegistryField';
import { fetchProjectsSumUp } from '@renderer/effects/ProjectEffects';
import { navigateTo } from '@renderer/effects/MenuEffect';
import FilePathField from '@renderer/components/Form/FilePathField';

const ProjectCreation: FunctionComponent = () => {
  const { t } = useTranslation();

  const [openAlert, contextHolder] = notification.useNotification();

  const [formInstance] = useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetFieldError = (fieldName: string) => {
    const fieldErrors = formInstance.getFieldError(fieldName);
    if (fieldErrors.length > 0) {
      // Reset field errors
      formInstance.setFields([
        {
          name: fieldName,
          value: formInstance.getFieldValue(fieldName) as string,
          errors: [],
        },
      ]);
    }
  };

  const onFinish = () => {
    setIsLoading(true);

    const projectCreationArgs: ProjectCreationArgs = {
      name: formInstance.getFieldValue('projectName') as string,
      path: formInstance.getFieldValue('projectPath') as string,
      registryUrl: formInstance.getFieldValue('registryUrl') as string,
    };

    void window.projectManagement
      .create(projectCreationArgs)
      .then((projectCreationResult) => {
        setIsLoading(false);
        if (projectCreationResult.error) {
          openAlert.error({
            message: t('project.creation.alert.title.error'),
            description: projectCreationResult.error,
          });
        } else {
          openAlert.success({
            message: t('project.creation.alert.title.success'),
          });
          void fetchProjectsSumUp();
          void navigateTo(
            routePaths.projectDetails.generate(
              projectCreationResult.projectKey,
            ),
          );
        }
      });
  };

  return (
    <>
      {contextHolder}
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
                    await window.projectManagement.isProjectNameUsed(
                      value as unknown as string,
                    );
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
            onChange={() => {
              resetFieldError('projectName');
            }}
          />
        </Form.Item>

        <FilePathField
          formInstance={formInstance}
          label={t('project.creation.form.field.projectPath')}
          name="projectPath"
          tooltip={t('project.creation.tooltip.projectPath')}
          placeholder={t('project.creation.form.placeholder.projectPath')}
          onChange={() => {
            resetFieldError('projectPath');
          }}
          rules={[
            {
              required: true,
              message: t('common.form.rules.required'),
            },
            () => ({
              async validator(_, value: string) {
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
        />

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
