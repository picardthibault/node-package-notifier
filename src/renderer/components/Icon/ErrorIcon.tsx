import { CloseCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { FunctionComponent } from 'react';

interface Props {
  tooltip?: string;
}

const ErrorIcon: FunctionComponent<Props> = (props) => {
  const { tooltip } = props;
  return (
    <Tooltip title={tooltip}>
      <CloseCircleOutlined className="error-icon" />
    </Tooltip>
  );
};
export default ErrorIcon;
