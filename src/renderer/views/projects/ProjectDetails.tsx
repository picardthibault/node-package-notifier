import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  return <p>{id}</p>;
};

export default ProjectDetails;
