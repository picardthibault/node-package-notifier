export enum PackageListenerChannel {
  CREATE = 'packageChannelCreate',
  DELETE = 'packageChannelDelete',
  GET_PACKAGES = 'packageChannelGetPackages',
  GET_PACKAGE = 'packageChannelGetPackage',
  GET_SUGGESTIONS = 'packageChannelGetSuggestion',
}

export enum ProjectListenerChannel {
  IS_PROJECT_NAME_USED = 'projectChannelIsProjectNameUsed',
  VALIDATE_PROJECT_PATH = 'projectChannelValidateProjectPath',
  VALIDATE_PROJECT_PATH_LISTENER = 'projectChannelValidateProjectPathListener',
  IMPORT_PROJECT = 'projectChannelImportProject',
  IMPORT_PROJECT_LISTENER = 'projectChannelImportProjectListener',
  GET_PROJECTS_DATA_FOR_MENU = 'projectChannelGetProjectDataForMenu',
  GET_PROJECTS_DATA_FOR_MENU_LISTENER = 'projectChannelGetProjectDataForMenuListener',
  GET_PROJECT_DETAILS = 'projectChannelGetProjectDetails',
  PARSE_PROJECT = 'projectChannelParseProject',
  FETCH_LATEST_VERSIONS = 'projectChannelFetchLatestVersions',
}
