/** @jsx jsx */
import { jsx } from '@emotion/core';

import React from 'react';
import { useOvermind } from '../../overmind';
import { SidebarView } from '../../overmind/rootState';

import SidebarFileExplorer from '../SidebarFileExplorer';
import SidebarDebug from '../SidebarDebug';
import SidebarProjectExplorer from '../SidebarProjectExplorer';
import Button from '../Button';

const SidebarViewContainer: React.FunctionComponent = () => {
  const {
    state: { selectedSidebarView }
  } = useOvermind();

  switch (selectedSidebarView) {
    case SidebarView.FileExplorer:
      return <SidebarFileExplorer />;
    case SidebarView.Debug:
      return <SidebarDebug />;
    case SidebarView.ProjectExplorer:
      return <SidebarProjectExplorer />;
  }

  return null;
};

export default SidebarViewContainer;
