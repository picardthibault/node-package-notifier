import React, { useCallback, useEffect, useState } from 'react';
import { AutoComplete, Form, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionButton from '../../components/Button/ActionButton';
import { IpcRendererEvent } from 'electron';
import Title from '../../components/Title/Title';
import { routePaths } from '../../routes';
import { openAlert } from '../../components/Alert/Alert';
import LinkButton from '../../components/Button/LinkButton';

interface PackageFormField {
  packageName: string;
}

export const PackageCreation = (): JSX.Element => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState<
    { label: string; value: string }[]
  >([]);
  const [suggestionTimeout, setSuggestionTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const [formInstance] = Form.useForm<PackageFormField>();

  const fetchSuggestions = useCallback(() => {
    const current = formInstance.getFieldValue('packageName');
    const registryUrl = formInstance.getFieldValue('registryUrl');
    window.packageManagement.getSuggestions({
      current,
      registryUrl,
    });
  }, [formInstance]);

  useEffect(() => {
    const suggestionListener = (
      event: IpcRendererEvent,
      fetchedSuggestions: string[] | string,
    ) => {
      if (typeof fetchedSuggestions === 'string') {
        setSuggestions([
          { label: fetchedSuggestions, value: fetchedSuggestions },
        ]);
      } else {
        setSuggestions(
          fetchedSuggestions.map((sug) => ({ label: sug, value: sug })),
        );
      }
    };
    const cleanListener =
      window.packageManagement.getSuggestionsListener(suggestionListener);
    return cleanListener;
  });

  const debounce = useCallback(() => {
    if (suggestionTimeout) {
      clearTimeout(suggestionTimeout);
    }
    setSuggestionTimeout(setTimeout(fetchSuggestions, 200));
  }, [suggestionTimeout, setSuggestionTimeout]);

  const onFinish = () => {
    window.packageManagement
      .create(formInstance.getFieldsValue())
      .then((errorMessage: string | undefined) => {
        if (!errorMessage) {
          openAlert('success', t('package.creation.alert.title.success'));
          navigate(routePaths.packageList.generate());
        } else {
          openAlert(
            'error',
            t('package.creation.alert.title.error'),
            t('package.creation.alert.description.error', {
              cause: errorMessage,
            }),
          );
        }
      });
  };

  return (
    <>
      <LinkButton
        to={routePaths.packageList.generate()}
        label={t('common.back')}
        isBack
      />
      <Title content={t('package.creation.title')} />
      <Form
        name="packageCreationForm"
        form={formInstance}
        initialValues={{
          packageName: '',
          registryUrl: '',
        }}
        labelAlign="left"
        labelCol={{ lg: 5, xl: 3 }}
        onFinish={onFinish}
      >
        <Form.Item
          label={t('package.creation.form.field.name')}
          name="packageName"
          rules={[
            {
              required: true,
              message: t('common.form.rules.required'),
            },
          ]}
        >
          <AutoComplete
            placeholder={t('package.creation.form.placeholder.name')}
            onChange={() => debounce()}
            options={suggestions}
          />
        </Form.Item>
        <Form.Item
          label={t('package.creation.form.field.registryUrl')}
          name="registryUrl"
          tooltip={t('package.creation.tooltip.registryUrl')}
          validateTrigger="onBlur"
          rules={[
            { type: 'url', message: t('package.creation.form.rules.url') },
          ]}
        >
          <Input
            placeholder={t('package.creation.form.placeholder.registryUrl')}
          />
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <ActionButton type="primary" htmlType="submit">
              {t('package.creation.buttons.create')}
            </ActionButton>
          </Space>
        </div>
      </Form>
    </>
  );
};
