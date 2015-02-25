module.exports = {
  DATA_SOURCE_TYPE_SERVICE: "service",
  DATA_SOURCE_TYPE_EXTERNAL: "external",
  DATA_TARGET_TYPE_POST_PROCESSING: "postProcessing",
  DATA_TARGET_TYPE_REAL_TIME: "realTime",
  ERROR_CODES: {
    FH_FORMS_NOT_FOUND: "FH_FORMS_NOT_FOUND",
    FH_FORMS_INVALID_PARAMETERS: "FH_FORMS_INVALID_PARAMETERS",
    FH_FORMS_UNEXPECTED_ERROR: "FH_FORMS_UNEXPECTED_ERROR",
    FH_FORMS_ERR_CODE_NOT_SET: "FH_FORMS_ERR_CODE_NOT_SET",
    FH_FORMS_ERR_CODE_PDF_GENERATION: "FH_FORMS_ERR_PDF_GENERATION",
    FH_FORMS_ERR_CODE_SUBMISSION_EXPORT: "FH_FORMS_ERR_SUBMISSION_EXPORT"
  },
  MIDDLEWARE: {
    resultTypes: {
      forms: "formsResult",
      themes: "themesResult",
      submissions: "submissionsResult",
      formProjects: "formsProjectsResult",
      formProjectsConfig: "formsProjectsConfigResult",
      dataSources: "dataSourcesResult",
      dataTargets: "dataTargetsResult",
      themeTemplate: "themeTemplate",
      formTemplate: "formTemplate"
    }
  }
};