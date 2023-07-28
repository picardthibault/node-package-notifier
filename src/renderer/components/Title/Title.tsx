import React from 'react';

interface TitleProps {
  content: string;
}

const Title: React.FC<TitleProps> = (props) => {
  const { content } = props;

  return <h1 style={{ fontSize: '2em' }}>{content}</h1>;
};

export default Title;
