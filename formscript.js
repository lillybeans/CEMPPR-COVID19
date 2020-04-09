//Global variables

var formId = "1manXOOsXt0VRXnODhRHKBTm4GXpsUkkB1dSik5d5LtU"; //Google Form: COVID-19 Survey Entry
var spreadsheetId = "1-FCuugGS9MTJvT9uCZiIVLhPTRMzdiSckEHveXRs-Vg"; //Google Sheet: Form Responses

//Google Sheets
var responseWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0]
var surveyItemNumbersWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Survey Item #")

//Survey Entry Google Form
var form = FormApp.openById(formId);

function postSubmissionProcessing(){
  if(isExistingSurvey()){
    copyDataFromExistingSurvey()
  } else {
    updateExistingSurveyItemDropdown() //We have added a new Survey Item #
  }
}

function copyDataFromExistingSurvey(){
  var lastResponseRow = responseWorksheet.getLastRow() //get the last response

  //Grab the "Existing Survey Item #" answer entered by the user
  var existingSurveyItemColumn = getColumnFromName(responseWorksheet, "Existing Survey Item #")
  var existingSurveyItemAnswer = responseWorksheet.getRange(lastResponseRow, existingSurveyItemColumn).getValue() //get the existing survey item #

  //Loop through the column "Survey Item #", and Find first row where "Survey Item #" matches existingSurveyItemAnswer
  var surveyItemColumn = getColumnFromName(responseWorksheet, "Survey Item #")
  var surveyItemColumnValues = responseWorksheet.getRange(1, surveyItemColumn, lastResponseRow, 1).getValues() //start_row, start_col, num_rows, num_cols

  for (var row = 2; row < lastResponseRow; row++) { //since row=1 is header, we start with second row
    var surveyItemValue = responseWorksheet.getRange(row, surveyItemColumn).getValue()
    if(surveyItemValue == existingSurveyItemAnswer) { //found a response whose survey item # matches ours
      copySurveyMetadata(row, lastResponseRow)
      Logger.log("source row:" + row + ",destinationRow number:" + lastResponseRow)
      break
    }
  }
}

function isExistingSurvey(){
  var lastResponseRow = responseWorksheet.getLastRow() //get the last response

  //worksheet: find the answer to "Is this question for an existing survey?" for the last submitted response
  var isExistingColumn = getColumnFromName(responseWorksheet, "Is this question for an existing survey?")
  var isExistingAnswer = responseWorksheet.getRange(lastResponseRow, isExistingColumn).getValue()

  if (isExistingAnswer == "Yes") {
    return true
  } else {
    return false
  }
}

function updateExistingSurveyItemDropdown(){

  //form: find "Existing Survey Item #" Dropdown
  var existingSurveyItemDropdown = getFormItemByTitle("Existing Survey Item #")
  var existingSurveyItemId = existingSurveyItemDropdown.getId()

  //worksheet: get "Survey Item #" column and grab all the values
  var surveyItemColumn = getColumnFromName(responseWorksheet, "Survey Item #")
  var lastResponseRow = responseWorksheet.getLastRow()
  Logger.log("Last row:"+lastResponseRow)

  var uniqueValues = ["No Existing Survey Item"]

  if (lastResponseRow >= 2) { //if there are responses
    var newSurveyItemNumber = responseWorksheet.getRange(lastResponseRow, surveyItemColumn).getValue()

    //Survey Item # worksheet: check all the existing values, make sure this is not a dup
    var lastSurveyItemRow = surveyItemNumbersWorksheet.getLastRow()
    var currentSurveyItemNumbers = surveyItemNumbersWorksheet.getRange(1, 1, lastSurveyItemRow, 1).getValues() //get a list of current survey item numbers
    if (currentSurveyItemNumbers.filter(v => v == newSurveyItemNumber).length == 0){ //Duplicate prevention: if list doesn't already contain it
      currentSurveyItemNumbers.push(newSurveyItemNumber)
      updateDropdown(existingSurveyItemId,currentSurveyItemNumbers)
      surveyItemNumbersWorksheet.getRange(lastSurveyItemRow + 1, 1).setValue(newSurveyItemNumber) //update our spreadsheet to include the new value
    }
  }
}

// Private helper functions

function getFormItemByTitle(titleToSearch){
  var items = form.getItems()
  var itemTitles = items.map(function(item){
    return item.getTitle()
  })

  var index = itemTitles.indexOf(titleToSearch)
  return items[index]
}

function updateDropdown(id, values){
  var item = form.getItemById(id)
  item.asListItem().setChoiceValues(values)
}

function addOptionToDropdown(dropdownId, newOption){
  var listItem = form.getItemById(dropdownId).asListItem()
  var choices = listItem.getChoices().filter(choice => choice.getValue() != "") //filter out empty values
  choices.push(listItem.createChoice(newOption));
  listItem.setChoices(choices);
}

//returns column number
function getColumnFromName(sheet, name) {
  var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] == name) return i + 1;
  }
  return -1;
}

//Copy survey metadata from source row to destination row
function copySurveyMetadata(sourceRow, destinationRow){
  //copy every column from Polling Group up to (but not including) Question
  var pollingGroupColumn = getColumnFromName(responseWorksheet, "Polling Group")
  var questionColumn = getColumnFromName(responseWorksheet, "Question")
  for (var i = pollingGroupColumn; i < questionColumn; i++) {
    var sourceCell = responseWorksheet.getRange(sourceRow, i)
    var destinationCell = responseWorksheet.getRange(destinationRow, i)
    destinationCell.setValue(sourceCell.getValue())
  }
}

function removeDups(values) {
  let unique = {};
  values.forEach(function(value) {
    if(!unique[value]) {
      unique[value] = true; //"set" this to true so the keys will include it.
    }
  });
  return Object.keys(unique); //basically this will return all the indices that have been "set" to true. If an index is unset it won't be in the key.
}
