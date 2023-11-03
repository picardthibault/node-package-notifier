import { LoadingOutlined } from '@ant-design/icons';
import React, { FunctionComponent } from 'react';

interface Props {
  className?: string;
}

const Loading: FunctionComponent<Props> = (props) => {
  const { className } = props;

  return (
    <div className={`loading ${className ? className : ''}`}>
      <LoadingOutlined />
    </div>
  );
};

export default Loading;
