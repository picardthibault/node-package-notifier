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
  VALIDATE_PROJECT_PATH = 'projectChannelValidateProjectPath',
}
