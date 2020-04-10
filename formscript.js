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
var formItems = form.getItems()

//Constants: Dropdown/Column headers
const IS_EXISTING = "Is this question for an existing survey?"
const QUESTION = "Question"
const SURVEY_ITEM = "Survey Item #"
const EXISTING_SURVEY_ITEM = "Existing Survey Item #"
const POLLING_GROUP = "Polling Group"

/*----------------*/
/* Event Triggers */
/*----------------*/

function onSubmit(){
  if(isExistingSurvey()){
    copyDataFromExistingSurvey()
  } else {
    updateOptions(EXISTING_SURVEY_ITEM, SURVEY_ITEM)
    updateOptions(POLLING_GROUP)
  }

  updateFormDescription()
}

/*-------------------------*/
/* Form Processing Methods */
/*-------------------------*/

/**
* Updates a Google Form item's options
*
* @param {string} title: The item name Google form
* @param {string} values: No options for the item
*/
function updateItemOptionsByTitle(title, values){
  var item = getFormItemByTitle(title)

  switch(item.getType()){
    case FormApp.ItemType.LIST:
      updateDropdown(item, values)
      //Logger.log("Updating Dropdown - " + title + " - with values " + arrayToString(values))
      break
    case FormApp.ItemType.MULTIPLE_CHOICE:
      updateMultipleChoice(item, values)
      //Logger.log("Updating Multiple Choice - " + title + " - with values " + arrayToString(values))
      break
    default: //we aren't updating any other data types
      return
  }
}

/**
* Updates the form description to show last submitted response
*/
function updateFormDescription(){
}

function copyDataFromExistingSurvey(){
  //Logger.log("Copying data from existing survey...")
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
  var isExistingColumn = getColumnFromName(responseWorksheet, IS_EXISTING)
  var isExistingAnswer = responseWorksheet.getRange(lastResponseRow, isExistingColumn).getValue()

  if (isExistingAnswer == "Yes") {
    return true
  } else {
    return false
  }
}

/**
* Given an itemName (i.e. "Polling Group") in the form, this function updates the Options worksheet by copying over the last entered value for this item in the Response worksheet.
*
* @param {string} itemName: The item name in the Options worksheet.
* @param {string} itemNameInResponse: (optional) do not set this value unless copying from a different item in the Response worksheet.
*  currently, we are only using this when copying "Survey Item #" into "Existing Survey Item #"
*/

function updateOptions(itemName, itemNameInResponse = itemName){
  //Response worksheet: get last response row
  var lastResponseRow = responseWorksheet.getLastRow()

  if(lastResponseRow < 2) { //No responses
    return
  }

  //Response worksheet: get this item's column
  var itemColumn = getColumnFromName(responseWorksheet, itemNameInResponse)
  var newItemValue = responseWorksheet.getRange(lastResponseRow, itemColumn).getValue() //get newly added item value

  //Options Worksheet - Existing Item column
  var existingItemOptionsColumn = getColumnFromName(optionsWorksheet, itemName)
  var existingItemOptionValues = getValuesForColumnWithName(optionsWorksheet, itemName)

  if(existingItemOptionValues.length > 0) { //If there are existing survey item #s
    if (doesNotContain(existingItemOptionValues, newItemValue)){ //Check for dups
      var lastItemOptionRow = existingItemOptionValues.length + 1 // +1 because of header
      optionsWorksheet.getRange(lastItemOptionRow + 1, existingItemOptionsColumn).setValue(newItemValue) //append new value to the Item Options
      Logger.log("Options Worksheet - " + itemName + " : Added New Value - " + newItemValue)
      existingItemOptionValues.push(newItemValue)
      updateItemOptionsByTitle(itemName,existingItemOptionValues) //update form
    }
  } else { //add our first survey item number
    optionsWorksheet.getRange(2, existingItemOptionsColumn).setValue(newItemValue) //second row is first entry
    Logger.log("Options Worksheet - " + itemName + " : Added First Value - " + newItemValue)
    updateItemOptionsByTitle(itemName,[newItemValue]) //update form
  }

}

//Copy survey metadata from source row to destination row
function copySurveyMetadata(sourceRow, destinationRow){
  //copy every column from Polling Group up to (but not including) Question
  var pollingGroupColumn = getColumnFromName(responseWorksheet, POLLING_GROUP)
  var questionColumn = getColumnFromName(responseWorksheet, QUESTION)
  for (var i = pollingGroupColumn; i < questionColumn; i++) {
    var sourceCell = responseWorksheet.getRange(sourceRow, i)
    var destinationCell = responseWorksheet.getRange(destinationRow, i)
    destinationCell.setValue(sourceCell.getValue())
  }
}

/*--------------------------*/
/* Private Helper Functions */
/*--------------------------*/

//update a dropdown given with new values
function updateDropdown(item, values){
  item.asListItem().setChoiceValues(values)
}

//update a multiple choice with new values
function updateMultipleChoice(item, values){
  item.asMultipleChoiceItem().setChoiceValues(values).showOtherOption(true)
}

//This function alone reduced overall runtime by 70%
function getFormItemByTitle(titleToSearch){
  for(var i in formItems){
    if(formItems[i].getTitle() == titleToSearch){
      return formItems[i]
    }
  }
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

function doesNotContain(values, valueToScan) {
  return values.filter(v => v == valueToScan).length == 0
}


function arrayToString(array){
  var str = "["
  for(var i=0; i<array.length; i++){
    str += array[i]
    if (i != array.length - 1) {
      str += ", "
    }
  }
  str += "]"
  return str
}
