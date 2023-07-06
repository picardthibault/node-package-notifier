import { LeftOutlined } from '@ant-design/icons';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

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
      <Link to={to}>{label}</Link>
    </div>
  );
};

export default LinkButton;
