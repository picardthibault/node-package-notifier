export enum PackageListenerChannel {
  CREATE = 'packageChannelCreate',
  DELETE = 'packageChannelDelete',
  GET_PACKAGES = 'packageChannelGetPackages',
  GET = 'packageChannelGet',
  FETCH_TAGS = 'packageChannelFetchTags',
  FETCH_TAGS_LISTENER = 'packageChannelFetchTagsListener',
  GET_SUGGESTIONS = 'packageChannelGetSuggestion',
  GET_SUGGESTIONS_LISTENER = 'packageChannelGetSuggestionListener',
}

export enum ProjectListenerChannel {
  VALIDATE_PROJECT_NAME = 'projectChannelValidateProjectName',
  VALIDATE_PROJECT_NAME_LISTENER = 'projectChannelValidateProjectNameListener',
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
