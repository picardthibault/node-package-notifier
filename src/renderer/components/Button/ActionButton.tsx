import { Button } from 'antd';
import React from 'react';

interface ActionButtonProps {
  children: string | JSX.Element;
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  onClick: () => void;
}

const ActionButton = (props: ActionButtonProps): JSX.Element => {
  const { children, type, danger, onClick } = props;

  return (
    <Button
      type={type}
      onClick={onClick}
      danger={danger}
      style={{
        paddingRight: '10px',
        paddingLeft: '10px',
      }}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
