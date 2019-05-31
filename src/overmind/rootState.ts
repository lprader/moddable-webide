export enum SidebarView {
  Hidden,
  ProjectExplorer,
  FileExplorer,
  Debug
}

export type State = {
  selectedSidebarView: ProjectExplorer;
};

const state: State = {
  selectedSidebarView: SidebarView.ProjectExplorer
};

export default state;
