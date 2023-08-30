import { Button, Tooltip } from 'antd';
import React from 'react';

interface ActionButtonProps {
  children: string | JSX.Element;
  type: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  htmlType?: 'button' | 'submit' | 'reset';
  danger?: boolean;
  toolTip?: string;
  onClick?: () => void;
}

const ActionButton = (props: ActionButtonProps): JSX.Element => {
  const { children, type, htmlType, danger, toolTip, onClick } = props;

  return (
    <Tooltip title={toolTip} placement="topLeft">
      <Button
        type={type}
        htmlType={htmlType}
        onClick={onClick}
        danger={danger}
        style={{
          paddingRight: '10px',
          paddingLeft: '10px',
        }}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default ActionButton;
