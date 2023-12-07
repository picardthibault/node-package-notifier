import React, { useCallback, useState } from 'react';
import { AutoComplete, Form, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionButton from '../../components/Button/ActionButton';
import Title from '../../components/Title/Title';
import { routePaths } from '../../routes';
import { openAlert } from '../../components/Alert/Alert';
import LinkButton from '../../components/Button/LinkButton';
import RegistryField from '../../components/Form/RegistryField';

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
    window.packageManagement
      .getSuggestions({
        current,
        registryUrl,
      })
      .then((fetchedSuggestions) => {
        if (typeof fetchedSuggestions === 'string') {
          setSuggestions([
            { label: fetchedSuggestions, value: fetchedSuggestions },
          ]);
        } else {
          setSuggestions(
            fetchedSuggestions.map((sug) => ({ label: sug, value: sug })),
          );
        }
      });
  }, [formInstance]);

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
        <RegistryField toolTip={t('package.creation.tooltip.registryUrl')} />

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
