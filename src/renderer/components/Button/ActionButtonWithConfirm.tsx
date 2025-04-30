import React, { JSX } from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';

interface Props {
  children: string | React.JSX.Element;
  type: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  htmlType?: 'button' | 'submit' | 'reset';
  danger?: boolean;
  toolTip?: string;
  onClick?: () => void;
  loading?: boolean;
  popConfirmIcon: JSX.Element;
  popConfirmTitle: string;
  popConfirmDescription: string;
  popConfirmOnConfirm: () => void;
  popConfirmOkText: string;
  popConfirmCancelText: string;
}

const ActionButtonWithConfirm: React.FunctionComponent<Props> = (
  props: Props,
) => {
  const {
    children,
    type,
    htmlType,
    danger,
    toolTip,
    onClick,
    loading,
    popConfirmIcon,
    popConfirmTitle,
    popConfirmDescription,
    popConfirmOnConfirm,
    popConfirmOkText,
    popConfirmCancelText,
  } = props;

  return (
    <Tooltip title={toolTip} placement="topLeft">
      <Popconfirm
        icon={popConfirmIcon}
        title={popConfirmTitle}
        description={popConfirmDescription}
        onConfirm={popConfirmOnConfirm}
        okText={popConfirmOkText}
        cancelText={popConfirmCancelText}
      >
        <Button
          type={type}
          htmlType={htmlType}
          onClick={onClick}
          danger={danger}
          className="px-3"
          loading={loading}
        >
          {children}
        </Button>
      </Popconfirm>
    </Tooltip>
  );
};

export default ActionButtonWithConfirm;
