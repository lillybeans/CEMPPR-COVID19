//THIS IS BACKEND CODE

var submitSurveyModel = {
  "formItems": [
    {
      "name": "polling_group",
      "title":"Polling Group",
      "type":"text",
      "placeholder": "NPR",
      "required": true
    },
    {
      "name": "poll_name",
      "title":"Poll Name",
      "type":"text",
      "placeholder": "NPR_20200317",
      "required": true
    },
    {
      "name": "country",
      "title":"Country",
      "type":"dropdown",
      "options": ["United States", "Canada", "Italy"],
      "required": true
    },
    {
      "name": "subnational",
      "title":"Sub-national",
      "type":"text",
      "placeholder": "New York",
      "required": false
    },
    {
      "name": "population",
      "title":"Population",
      "type":"dropdown",
      "options": ["Population 1", "Population 2", "Population 3"],
      "required": true
    },
    {
      "name": "language",
      "title":"Language",
      "type":"dropdown",
      "options": ["Language 1", "Language 2", "Language 3"],
      "required": true
    },
    {
      "type": "column_break"
    },
    {
      "name": "sample_size",
      "title":"Sample Size",
      "type":"text",
      "placeholder": "1800",
      "required": false
    },
    {
      "name": "sample_method",
      "title":"Sample Method",
      "type":"dropdown",
      "options": ["Method 1", "Method 2", "Method 3"],
      "required": false
    },
    {
      "name": "type_of_study",
      "title":"Type of Study",
      "type":"dropdown",
      "options": ["One-time", "Longitudinal"],
      "required": true
    },
    {
      "name": "url",
      "title":"URL",
      "type":"text",
      "placeholder": "https://samplesurvey.com/survey1",
      "required": true
    },
    {
      "name": "created_by",
      "title":"Your Initial",
      "type":"text",
      "placeholder": "SK",
      "required": true,
      "special_font": true
    },
    {
      "type": "column_break"
    },
    {
      "name": "publication_date",
      "title":"Publication Date",
      "type":"date",
      "placeholder": "Ex: 2020/03/01",
      "required": true
    },
    {
      "name": "start_date",
      "title":"Start Date",
      "type":"date",
      "placeholder": "Ex: 2020/02/01",
      "required": true
    },
    {
      "name": "end_date",
      "title":"End Date",
      "type":"date",
      "placeholder": "Ex: 2020/02/02",
      "required": true
    },
  ]
}

module.exports = submitSurveyModel
