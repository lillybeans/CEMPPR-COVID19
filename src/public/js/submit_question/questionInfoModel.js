var groupOptions = ["Group1", "Group2", "Group3"]
var keywordsOptions = ["Keyword1", "Keyword2", "Keyword3"]
var themeOptions = ["Theme1", "Theme2", "Theme3"]

var questionInfoTemplate = {
  "formItems" = [
    {
      "title":"Survey Item #"
      "description": "Ex. STGVTCV1"
      "type":"text"
    },
    {
      "title":"Group"
      "description": "Group description goes here"
      "type":"dropdown"
      "options": groupOptions
    },
    {
      "theme":"Theme"
      "description": "Theme description goes here"
      "type":"dropdown"
      "options": themeOptions
    },
    {
      "title":"Keywords"
      "description": "Keywords description goes here"
      "type":"checkbox"
      "options": keywordsOptions
    }
  ]
}
