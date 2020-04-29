//THIS IS BACKEND CODE

var submitSurveyModel = {
  "formItems": [
    {
      "name": "polling_group",
      "title":"Polling Group",
      "type":"text",
      "placeholder": "Ex: NPR"
    },
    {
      "name": "poll_name",
      "title":"Poll Name",
      "type":"text",
      "placeholder": "Ex: NPR_20200317"
    },
    {
      "name": "country",
      "title":"Country",
      "type":"dropdown",
      "options": ["United States", "Canada", "Italy"]
    },
    {
      "name": "subnational",
      "title":"Sub-national",
      "type":"text",
      "placeholder": "Ex: Chicago"
    },
    {
      "name": "population",
      "title":"Population",
      "type":"dropdown",
      "options": ["Population 1", "Population 2", "Population 3"]
    },
    {
      "name": "publication_date",
      "title":"Publication Date",
      "type":"date",
      "placeholder": "Ex: 2020/03/01"
    },
    {
      "name": "start_date",
      "title":"Start Date",
      "type":"date",
      "placeholder": "Ex: 2020/02/01"
    },
    {
      "name": "end_date",
      "title":"End Date",
      "type":"date",
      "placeholder": "Ex: 2020/02/02"
    },
    {
      "name": "sample_size",
      "title":"Sample Size",
      "type":"text",
      "placeholder": "Ex: 1800"
    },
    {
      "name": "sample_method",
      "title":"Sample Method",
      "type":"dropdown",
      "options": ["Method 1", "Method 2", "Method 3"]
    },
    {
      "name": "type_of_study",
      "title":"Type of Study",
      "type":"dropdown",
      "options": ["One-time", "Longitudinal"]
    },
    {
      "name": "url",
      "title":"URL",
      "type":"text",
      "placeholder": "Ex: https://samplesurvey.com/someSurvey"
    },
    {
      "name": "initial",
      "title":"Your Initial",
      "type":"text",
      "placeholder": "Ex: SK"
    }
  ]
}

module.exports = submitSurveyModel // alt: {questionInfoModel: questionInfoModel, key: value}
