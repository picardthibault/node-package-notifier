export enum PackageListenerChannel {
  CREATE = 'packageChannelCreate',
  CREATE_LISTENER = 'packageChannelCreateListener',
  UPDATE = 'packageChannelUpdate',
  UPDATE_LISTENER = 'packageChannelUpdateListener',
  DELETE = 'packageChannelDelete',
  DELETE_LISTENER = 'packageChannelDeleteListener',
  GET_ALL = 'packageChannelGetAll',
  GET_ALL_LISTENER = 'packageChannelGetAllListener',
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
}
