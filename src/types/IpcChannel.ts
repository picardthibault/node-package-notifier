export enum PackageListenerChannel {
  CREATE = 'packageChannelCreate',
  DELETE = 'packageChannelDelete',
  GET_PACKAGES = 'packageChannelGetPackages',
  GET_PACKAGE = 'packageChannelGetPackage',
  OPEN_HOME_PAGE = 'packageChannelOpenHomePage',
  GET_SUGGESTIONS = 'packageChannelGetSuggestion',
}

export enum ProjectListenerChannel {
  PROJECT_PATH_SELECTOR = 'projectChannelProjectPathSelector',
  IS_PROJECT_NAME_USED = 'projectChannelIsProjectNameUsed',
  IS_PROJECT_PATH_VALID = 'projectChannelIsProjectPathValid',
  CREATE = 'projectChannelCreate',
  DELETE = 'projectChannelDelete',
  GET_PROJECTS_SUM_UP = 'projectChannelGetProjectsSumUp',
  GET_PROJECT_DETAILS = 'projectChannelGetProjectDetails',
  FETCH_LATEST_VERSION = 'projectChannelFetchLatestVersion',
  FETCH_PUBLICATION_DATE = 'projectChannelFetchPublicationDate',
}
