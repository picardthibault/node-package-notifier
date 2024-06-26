import { Form, Input, InputRef, notification } from 'antd';
import { FormInstance, Rule } from 'antd/es/form';
import React, { DragEvent, FunctionComponent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderOpenOutlined } from '@ant-design/icons';

interface Props {
  formInstance: FormInstance<unknown>;
  label: string;
  name: string;
  tooltip: string;
  placeholder: string;
  onChange: () => void;
  rules: Rule[];
}

const FilePathField: FunctionComponent<Props> = (props) => {
  const { formInstance, label, name, tooltip, placeholder, onChange, rules } =
    props;

  const { t } = useTranslation();

  const [openAlert, contextHolder] = notification.useNotification();

  const inputRef = useRef<InputRef | null>(null);

  const onDrop = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length === 1) {
      formInstance.setFieldValue(name, files[0].path);
      onChange();
      inputRef.current?.focus();
    } else {
      openAlert.error({
        message: t('project.creation.alert.title.invalidSelection'),
      });
    }
    event.dataTransfer.clearData();
  };

  const folderAddon = (
    <div
      onClick={() => {
        const currentPath = formInstance.getFieldValue(name) as string;
        void window.projectManagement
          .projectPathSelector(currentPath ? currentPath : '')
          .then((selection) => {
            if (selection) {
              formInstance.setFieldValue(name, selection);
              inputRef.current?.focus();
              onChange();
            }
          });
      }}
    >
      <FolderOpenOutlined />
    </div>
  );

  return (
    <>
      {contextHolder}
      <Form.Item label={label} name={name} tooltip={tooltip} rules={rules}>
        <Input
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          onDrop={onDrop}
          ref={inputRef}
          addonAfter={folderAddon}
        />
      </Form.Item>
    </>
  );
};

export default FilePathField;
