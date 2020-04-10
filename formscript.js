/**

Form Script

This script runs after submitting a Google Form Response
Author: Lilly Tong

**/

//Global variables

var formId = "1manXOOsXt0VRXnODhRHKBTm4GXpsUkkB1dSik5d5LtU"; //Google Form: COVID-19 Survey Entry
var spreadsheetId = "1-FCuugGS9MTJvT9uCZiIVLhPTRMzdiSckEHveXRs-Vg"; //Google Sheet: Form Responses

//Google Sheets
var responseWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0]
var optionsWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Options")

//Survey Entry Google Form
var form = FormApp.openById(formId);

//Constants: Dropdown/Column headers
const SURVEY_ITEM = "Survey Item #"
const EXISTING_SURVEY_ITEM = "Existing Survey Item #"

/*----------------*/
/* Event Triggers */
/*----------------*/

function onSubmit(){
  if(isExistingSurvey()){
    copyDataFromExistingSurvey()
  } else {
    updateSurveyItemNumbers() //We have added a new Survey Item #
  }
}

/*-------------------------*/
/* Form Processing Methods */
/*-------------------------*/

function copyDataFromExistingSurvey(){
  Logger.log("Copying data from existing survey...")
  var lastResponseRow = responseWorksheet.getLastRow() //get the last response

  //Grab the "Existing Survey Item #" answer entered by the user
  var existingSurveyItemColumn = getColumnFromName(responseWorksheet, EXISTING_SURVEY_ITEM)
  var existingSurveyItemAnswer = responseWorksheet.getRange(lastResponseRow, existingSurveyItemColumn).getValue() //get the existing survey item #

  //Loop through the column "Survey Item #", and Find first row where "Survey Item #" matches existingSurveyItemAnswer
  var surveyItemColumn = getColumnFromName(responseWorksheet, SURVEY_ITEM)
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

function updateSurveyItemNumbers(){
  Logger.log("Updating Survey Item Numbers...")

  //Response worksheet: get last response row
  var lastResponseRow = responseWorksheet.getLastRow()
  Logger.log("Last response is at row: " + lastResponseRow)

  //Response worksheet: get "Survey Item #" column and grab all the values in the column
  var surveyItemColumn = getColumnFromName(responseWorksheet, "Survey Item #")

  if (lastResponseRow >= 2) { //if there are responses
    var newSurveyItemNumber = responseWorksheet.getRange(lastResponseRow, surveyItemColumn).getValue() //get newly added survey item number

    //Options Worksheet - Existing Survey Item # column
    var existingSurveyItemColumn = getColumnFromName(optionsWorksheet, EXISTING_SURVEY_ITEM)
    var existingSurveyItemValues = getValuesForColumnWithName(optionsWorksheet, EXISTING_SURVEY_ITEM)

    if(existingSurveyItemValues.length > 0) { //If there are existing survey item #s
      if (existingSurveyItemValues.filter(v => v == newSurveyItemNumber).length == 0){ //Check for dups
        var lastSurveyItemRow = existingSurveyItemValues.length + 1 // +1 because of header
        optionsWorksheet.getRange(lastSurveyItemRow + 1, existingSurveyItemColumn).setValue(newSurveyItemNumber) //add a new row to the Survey Item # worksheet
        Logger.log("Options Worksheet - Existing Survey Item #: Added New Value - " + newSurveyItemNumber)
        existingSurveyItemValues.push(newSurveyItemNumber)
        updateDropdownByTitle(EXISTING_SURVEY_ITEM,existingSurveyItemValues)
      }
    } else { //add our first survey item number
        optionsWorksheet.getRange(2, existingSurveyItemColumn).setValue(newSurveyItemNumber) //second row is first entry
        Logger.log("Options Worksheet - Existing Survey Item #: Added First Value - " + newSurveyItemNumber)
        updateDropdownByTitle(EXISTING_SURVEY_ITEM,[newSurveyItemNumber])
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

/*--------------------------*/
/* Private Helper Functions */
/*--------------------------*/

//update a dropdown given the dropdown's title and new values
function updateDropdownByTitle(title, values){
  var item = getFormItemByTitle(title)
  item.asListItem().setChoiceValues(values)
}


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

function getValuesForColumnWithName(sheet, columnName){
  var col = getColumnFromName(sheet, columnName)
  return getValuesForColumn(sheet, col)
}

//Assuming there is a header in the column
function getValuesForColumn(sheet, column){
  var numRows = sheet.getLastRow() //last row for the whole sheet

  if (numRows < 2){ //no options populated since first row is header
    return []
  }

  // Get all data for the given column
  var data = sheet.getRange(1, column, numRows).getValues();
  var values = []

  // Iterate through all the rows until we find an empty cell. Remember we are referencing by indices, so -1.
  for(var row = 1; row < numRows ; row++){ //starting with row index = 1 since first row (ind=0) is header
    if (data[row][0] != null && data[row][0] != ""){ //col index is fixed at 0 since it's a single column
      values.push(data[row][0])
    } else {
      break
    }
  }

  return values
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
