import { Button, Tooltip } from 'antd';
import React from 'react';

interface ActionButtonProps {
  children: string | React.JSX.Element;
  type: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  htmlType?: 'button' | 'submit' | 'reset';
  danger?: boolean;
  toolTip?: string;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

const ActionButton = (props: ActionButtonProps): React.JSX.Element => {
  const { children, type, htmlType, danger, toolTip, onClick, loading, className } = props;

  return (
    <Tooltip title={toolTip} placement="topLeft">
      <Button
        type={type}
        htmlType={htmlType}
        onClick={onClick}
        danger={danger}
        loading={loading}
        className={`px-3 ${className}`}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default ActionButton;
