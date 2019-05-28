/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import React, { useEffect } from 'react';
import FileTree from '../FileTree/index';
import { useOvermind } from '../../overmind';

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

const ProjectExplorer: React.FunctionComponent = () => {
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
      <section
        css={{
          display: 'flex',
          justifyContent: 'left',
          textAlign: 'left',
          flexDirection: 'column',
          background: 'var(--color-dark)',
          fontSize: '0.9rem',
          height: '100%'
        }}
      >
        {projects && projects.length > 0 && (
          <section css={{ 
            marginTop: '1em',
            marginLeft: '1em',
          }}>
            <header>Open Project:</header>
            <section css={{ display: 'flex', flexDirection: 'column' }}>
              {projects.map(name => (
                <Button key={name} onClick={() => openProject(name)}>
                  {name}
                </Button>
              ))}
            </section>
          </section>
        )}
        <section css={{ 
            marginTop: '1em',
            marginLeft: '1em',
          }}>
          <header>Actions:</header>
          <Button onClick={askNewProject}>Create a new Project</Button>
          <Button onClick={() => loadSampleData('')}>Load example data</Button>
          <Button onClick={askImportGist}>Import GitHub Gist</Button>
        </section>
      </section>
  );
};

export default ProjectExplorer;
