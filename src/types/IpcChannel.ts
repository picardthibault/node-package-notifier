export enum PackageListenerChannel {
  CREATE = 'packageChannelCreate',
  DELETE = 'packageChannelDelete',
  GET_PACKAGES = 'packageChannelGetPackages',
  GET_PACKAGE = 'packageChannelGetPackage',
  GET_SUGGESTIONS = 'packageChannelGetSuggestion',
}

export enum ProjectListenerChannel {
  IS_PROJECT_NAME_USED = 'projectChannelIsProjectNameUsed',
  IS_PROJECT_PATH_VALID = 'projectChannelIsProjectPathValid',
  CREATE = 'projectChannelCreate',
  GET_PROJECTS_SUM_UP = 'projectChannelGetProjectsSumUp',
  GET_PROJECT_DETAILS = 'projectChannelGetProjectDetails',
  FETCH_LATEST_VERSIONS = 'projectChannelFetchLatestVersions',
}
