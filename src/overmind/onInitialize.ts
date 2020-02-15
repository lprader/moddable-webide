import { OnInitialize } from 'overmind';

export const onInitialize: OnInitialize = async ({
  state,
  effects,
  actions
}) => {
  actions.Compiler.load();
  const urlParams = new URLSearchParams(window.location.search);
  const projectName = urlParams.get('project');
  if (await effects.Storage.hasProject(projectName)) {
    actions.Storage.openProject(projectName);
  } else if (await effects.Storage.hasProject('time-date-weather')) {
	actions.Storage.openProject('time-date-weather');
  } else {
	await actions.Storage.openProject('time-date-weather');
	await actions.importGist('68f581c1067a1d71ad7e2f7f5a7bdfec');
	await actions.Storage.openProject('colored-circles');
	await actions.importGist('1abbd984db8b087db14b49e143d40480');
	await actions.Storage.openProject('motion-sensor');
	await actions.importGist('a38d385727d03291d892938c59ab359c');
	actions.Storage.openProject('time-date-weather');
  }
};