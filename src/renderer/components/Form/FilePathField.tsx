import {
  Form,
  Input,
  InputRef,
  notification,
  FormInstance,
  FormRule,
  Space,
  Button,
} from 'antd';
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
  rules: FormRule[];
}

const FilePathField: FunctionComponent<Props> = (props) => {
  const { formInstance, label, name, tooltip, placeholder, onChange, rules } =
    props;

  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [openAlert, contextHolder] = notification.useNotification();

  const inputRef = useRef<InputRef | null>(null);

  const onDrop = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length === 1) {
      const filePath = window.fileManagement.getPathFromFile(files[0]);
      formInstance.setFieldValue(name, filePath);
      onChange();
      inputRef.current?.focus();
    } else {
      openAlert.error({
        title: t('project.creation.alert.title.invalidSelection'),
      });
    }
    event.dataTransfer.clearData();
  };

  const folderAddon = (
    <Button
      htmlType="button"
      style={{
        padding: "0 11px 0 11px",
        display: "flex",
        alignItems: "center",
        borderStyle: 'solid',
        borderWidth: '1px 1px 1px 0',
        borderColor: 'rgb(217, 217, 217)',
        borderBottomRightRadius: '6px',
        borderTopRightRadius: '6px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
      }}
      onClick={() => {
        const currentPath = formInstance.getFieldValue(name) as string;
        console.log(currentPath)
        void window.projectManagement
          .projectPathSelector(currentPath ? currentPath : '')
          .then((selection) => {
            console.log(selection)
            if (selection) {
              formInstance.setFieldValue(name, selection);
              inputRef.current?.focus();
              onChange();
            }
          });
      }}
    >
      <FolderOpenOutlined />
    </Button>
  );

  return (
    <>
      {contextHolder}
        <Space.Compact style={{width: "100%"}}>
          <Form.Item label={label} name={name} tooltip={tooltip} rules={rules} style={{width: "100%"}}>
            <Input
              name={name}
              placeholder={placeholder}
              onChange={onChange}
              onDrop={onDrop}
              ref={inputRef}
            />
        </Form.Item>
        {folderAddon}
      </Space.Compact>
    </>
  );
};

export default FilePathField;
