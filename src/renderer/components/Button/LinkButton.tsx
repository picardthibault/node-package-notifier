import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { FunctionComponent } from 'react';
import { navigateTo } from '@renderer/effects/MenuEffect';

interface LinkButtonProps {
  to: string;
  label: string;
  isBack?: boolean;
}

const LinkButton: FunctionComponent<LinkButtonProps> = (props) => {
  const { to, label, isBack } = props;

  return (
    <div className="linkButton">
      {isBack && <LeftOutlined />}
      <Button type="link" onClick={() => navigateTo(to)}>
        {label}
      </Button>
    </div>
  );
};

export default LinkButton;
