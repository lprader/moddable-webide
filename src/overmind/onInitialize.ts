import { OnInitialize } from 'overmind';

export const onInitialize: OnInitialize = async ({
  state,
  effects,
  actions
}) => {
  actions.Compiler.load();
  const urlParams = new URLSearchParams(window.location.search);
  await actions.Storage.openProject('light');
  await actions.importGist('c2e638a2e8ebaff796d67f2d2dd0783d');
  await actions.Storage.openProject('sign');
  await actions.importGist('9f526d43030bd3c96fead27eebaf5303');
  await actions.Storage.openProject('thermometer');
  await actions.importGist('514a010e7acff8520f60839ecc749da5');
  const projectName = urlParams.get('light');
  if (await effects.Storage.hasProject(projectName)) {
    actions.Storage.openProject(projectName);
  }
};