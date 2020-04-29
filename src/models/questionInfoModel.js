//THIS IS BACKEND CODE
var groupOptions = ["Group1", "Group2", "Group3"]
var keywordsOptions = ["Keyword1", "Keyword2", "Keyword3"]
var themeOptions = ["Theme1", "Theme2", "Theme3"]

var questionInfoModel = {
  "formItems": [
    {
      "name": "survey_item",
      "title":"Survey Item #",
      "description": "Minimum 3 characters",
      "type":"text",
      "placeholder": "STGVTCV1"
    },
    {
      "name": "group",
      "title":"Group",
      "description": "Group description goes here",
      "type":"dropdown",
      "options": groupOptions
    },
    {
      "name": "theme",
      "title":"Theme",
      "description": "Theme description goes here",
      "type":"dropdown",
      "options": themeOptions
    },
    {
      "name": "keywords",
      "title":"Keywords",
      "description": "Keywords description goes here",
      "type":"checkbox",
      "options": keywordsOptions
    }
  ]
}

module.exports = questionInfoModel // alt: {questionInfoModel: questionInfoModel, key: value}
