import { Tag, Tooltip } from 'antd';
import React, { FunctionComponent } from 'react';

export enum PackageVersionTagColor {
  RED = 'red',
  ORANGE = 'orange',
  BLUE = 'blue',
}

interface Props {
  content: string;
  tooltip?: string;
  color?: PackageVersionTagColor;
}

const computeClassName = (color?: PackageVersionTagColor) => {
  if (!color) {
    return '';
  }

  return `${color}-tag`;
};

const PackageVersionTag: FunctionComponent<Props> = (props) => {
  const { content, tooltip, color } = props;
  return (
    <Tooltip title={tooltip}>
      <Tag className={computeClassName(color)}>{content}</Tag>
    </Tooltip>
  );
};

export default PackageVersionTag;
