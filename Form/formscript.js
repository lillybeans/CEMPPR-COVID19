/**

This script runs to process the Google Sheet containing the COVID-19 Survey Entry Form Responses
Author: Lilly Tong

**/

//Global variables

var formId = "1manXOOsXt0VRXnODhRHKBTm4GXpsUkkB1dSik5d5LtU"; //Google Form: COVID-19 Survey Entry
var spreadsheetId = "1-FCuugGS9MTJvT9uCZiIVLhPTRMzdiSckEHveXRs-Vg"; //Google Sheet: Form Responses

//Google Sheets
var responseWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0]
var surveyItemNumbersWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Survey Item #")

//Survey Entry Google Form
var form = FormApp.openById(formId);

/********************/
/** Event Triggers **/
/********************/

function onSubmit(){
  if(isExistingSurvey()){
    copyDataFromExistingSurvey()
  } else {
    updateSurveyItemNumbers() //We have added a new Survey Item #
  }
}

/*****************************/
/** Form Processing Methods **/
/*****************************/

function copyDataFromExistingSurvey(){
  Logger.log("Copying data from existing survey...")
  var lastResponseRow = responseWorksheet.getLastRow() //get the last response

  //Grab the "Existing Survey Item #" answer entered by the user
  var existingSurveyItemColumn = getColumnFromName(responseWorksheet, "Existing Survey Item #")
  var existingSurveyItemAnswer = responseWorksheet.getRange(lastResponseRow, existingSurveyItemColumn).getValue() //get the existing survey item #

  //Loop through the column "Survey Item #", and Find first row where "Survey Item #" matches existingSurveyItemAnswer
  var surveyItemColumn = getColumnFromName(responseWorksheet, "Survey Item #")
  var surveyItemColumnValues = responseWorksheet.getRange(1, surveyItemColumn, lastResponseRow, 1).getValues() //start_row, start_col, num_rows, num_cols

  for (var row = 2; row < lastResponseRow; row++) { //first response is at row=2
    var surveyItemValue = responseWorksheet.getRange(row, surveyItemColumn).getValue()
    if(surveyItemValue == existingSurveyItemAnswer) { //found a response whose survey item # matches ours
      copySurveyMetadata(row, lastResponseRow)
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
    Logger.log("Is Existing Survey: True")
  } else {
    return false
    Logger.log("Is Existing Survey: False")
  }
}

// Run this function if you manually update "Survey Item #" worksheet
function updateExistingSurveyItemDropdown(){
  Logger.log("Updating Existing Survey Item # Dropdown...")

  //form: find "Existing Survey Item #" Dropdown
  var existingSurveyItemDropdown = getFormItemByTitle("Existing Survey Item #")
  var existingSurveyItemId = existingSurveyItemDropdown.getId()

  var newValues = ["No Existing Surveys Found"]

  //Survey Item # worksheet: check all the existing values, make sure this is not a dup
  var lastSurveyItemRow = surveyItemNumbersWorksheet.getLastRow()
  if (lastSurveyItemRow > 0) { //if this is not an empty sheet
    var currentSurveyItemNumbers = surveyItemNumbersWorksheet.getRange(1, 1, lastSurveyItemRow, 1).getValues() //get a list of current survey item numbers
    newValues = currentSurveyItemNumbers
  }

  updateDropdown(existingSurveyItemId,newValues)
}

function updateSurveyItemNumbers(){
  Logger.log("Updating Survey Item Numbers...")

  //Response worksheet: get last response row
  var lastResponseRow = responseWorksheet.getLastRow()
  Logger.log("Last response is at row: " + lastResponseRow)

  //Response worksheet: get "Survey Item #" column and grab all the values in the column
  var surveyItemColumn = getColumnFromName(responseWorksheet, "Survey Item #")

  if (lastResponseRow >= 2) { //if there are responses
    var newSurveyItemNumber = responseWorksheet.getRange(lastResponseRow, surveyItemColumn).getValue() //get newly added survey item number

    //Survey Item # worksheet: check all the existing values, make sure this is not a dup
    var lastSurveyItemRow = surveyItemNumbersWorksheet.getLastRow()

    if(lastSurveyItemRow > 0) { //If survey item # worksheet is not empty
      var currentSurveyItemNumbers = surveyItemNumbersWorksheet.getRange(1, 1, lastSurveyItemRow, 1).getValues() //get a list of current survey item numbers
      if (currentSurveyItemNumbers.filter(v => v == newSurveyItemNumber).length == 0){ //Duplicate prevention: if list doesn't already contain this survey item number
        surveyItemNumbersWorksheet.getRange(lastSurveyItemRow + 1, 1).setValue(newSurveyItemNumber) //add a new row to the Survey Item # worksheet
        Logger.log("Survey Item # Worksheet: Added New Value - " + newSurveyItemNumber)
        updateExistingSurveyItemDropdown()
      }
    } else { //add our first survey item number
      surveyItemNumbersWorksheet.getRange(1, 1).setValue(newSurveyItemNumber)
      Logger.log("Survey Item # Worksheet: Added First Value - " + newSurveyItemNumber)
      updateExistingSurveyItemDropdown()
    }

  }
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

/******************************/
/** Private Helper Functions **/
/******************************/

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

function removeDups(values) {
  let unique = {};
  values.forEach(function(value) {
    if(!unique[value]) {
      unique[value] = true; //"set" this to true so the keys will include it.
    }
  });
  return Object.keys(unique); //basically this will return all the indices that have been "set" to true. If an index is unset it won't be in the key.
}
