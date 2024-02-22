import { Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  toolTip: string;
}

const RegistryField: React.FunctionComponent<Props> = (props) => {
  const { toolTip } = props;

  const { t } = useTranslation();

  return (
    <Form.Item
      label={t('form.field.registryUrl')}
      name="registryUrl"
      tooltip={toolTip}
      validateTrigger="onBlur"
      rules={[{ type: 'url', message: t('form.rules.url') }]}
    >
      <Input placeholder={t('form.placeholder.registryUrl')} />
    </Form.Item>
  );
};

export default RegistryField;
