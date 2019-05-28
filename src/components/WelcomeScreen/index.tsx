/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect } from 'react';
import { useOvermind } from '../../overmind';

import WebIDELogo from '../Icons/WebIDELogo';

const Button: React.FunctionComponent<{ onClick: VoidFunction }> = ({
  onClick,
  children
}) => {
  return (
    <div
      css={{
        cursor: 'pointer',
        padding: '.125em 0',
        color: '#2980b9',
        margin: '.125em .125em',
        ':hover': { color: '#3498db' }
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const WelcomeScreen: React.FunctionComponent = () => {
  const {
    state: {
      Storage: { project: currentProject }
    },
    actions: {
      Storage: { loadSampleData, openProject },
      askImportGist,
      askNewProject
    },
    effects: {
      Storage: { getProjectList }
    }
  } = useOvermind();

  const [projects, setProjects] = React.useState<string[]>();
  useEffect(() => {
    let unmounted = false;
    getProjectList().then(newProjects => {
      const projects = newProjects.filter(name => name !== currentProject);
      if (!unmounted) {
        setProjects(projects);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [currentProject]);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%'
      }}
    >
      <div css={{ height: '30%' }}>
        <WebIDELogo color={'rgba(0,0,0,0.2)'} css={{ height: '100%' }} />
      </div>

    </div>
  );
};

export default WelcomeScreen;
