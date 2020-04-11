/**

Form Script

This script runs after submitting a Google Form Response
Author: Lilly Tong

**/

//Global variables

var formId = "1manXOOsXt0VRXnODhRHKBTm4GXpsUkkB1dSik5d5LtU"; //Google Form: COVID-19 Survey Entry
var spreadsheetId = "1-FCuugGS9MTJvT9uCZiIVLhPTRMzdiSckEHveXRs-Vg"; //Google Sheet: Form Responses

//Google Sheets
var responseWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Questions_N (Form Responses)")
var formItemsWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Form Items")
var optionsWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Options_N")
var keywordsWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Keywords_N")
var qidWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("QID_N") //hidden worksheet to keep track of all unique question numbers

var lastResponseRow = responseWorksheet.getLastRow() //get the last response's row

//Survey Entry Google Form
var form = FormApp.openById(formId);
var formItems = form.getItems()

//Constants: Dropdown/Column headers
const TIMESTAMP = "Timestamp"
const IS_EXISTING = "Is this question for an existing survey?"
const INITIAL = "Your Initial"
const KEYWORDS = "Keywords"
const QUESTION = "Question"
const SURVEY_ITEM = "Survey Item #"
const EXISTING_SURVEY_ITEM = "Existing Survey Item #"
const POLLING_GROUP = "Polling Group"
const QUESTION_ID = "Question_ID"
const OPTION_A = "Option A"
const OPTION_I = "Option I"

const QUESTION_ID_OFFSET = 253 //the first QID in the new records

/*----------------*/
/* Event Triggers */
/*----------------*/

function onSubmit(){
  if(isExistingSurvey()){
    copyDataFromExistingSurvey()
  } else {
    updateFormItem(EXISTING_SURVEY_ITEM, SURVEY_ITEM)
    updateFormItem(POLLING_GROUP)
  }

  updateFormDescription()
  assignQuestionID()

  //Update the two other relational worksheets
  updateOptionsWorksheet()
  updateKeywordsWorksheet()
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
  var questionColumn = getColumnFromName(responseWorksheet, QUESTION)
  var lastQuestion = responseWorksheet.getRange(lastResponseRow, questionColumn).getValue()

  var timestampColumn = getColumnFromName(responseWorksheet, TIMESTAMP)
  var lastTimestamp = responseWorksheet.getRange(lastResponseRow, timestampColumn).getValue()
  var lastTimestampFormatted = Utilities.formatDate(lastTimestamp, Session.getScriptTimeZone(), "EEEE, MMM dd, yyyy @ hh:mm:ss a")

  var initialColumn = getColumnFromName(responseWorksheet, INITIAL)
  var lastInitial = responseWorksheet.getRange(lastResponseRow, initialColumn).getValue()

  var description = "Last Submitted by: " + lastInitial + "\n" + lastQuestion + "\n" + lastTimestampFormatted

  form.setDescription(description)
}

function copyDataFromExistingSurvey(){
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
* Given an itemName (i.e. "Polling Group") in the form, this function updates the Form Items worksheet by copying over the last entered value for this item in the Response worksheet.
*
* @param {string} itemName: The item name in the Form Items worksheet.
* @param {string} itemNameInResponse: (optional) do not set this value unless copying from a different item in the Response worksheet.
*  currently, we are only using this when copying "Survey Item #" into "Existing Survey Item #"
*/

function updateFormItem(itemName, itemNameInResponse = itemName){
  if(lastResponseRow < 2) { //No responses
    return
  }

  //Response worksheet: get this item's column
  var itemColumn = getColumnFromName(responseWorksheet, itemNameInResponse)
  var newItemValue = responseWorksheet.getRange(lastResponseRow, itemColumn).getValue() //get newly added item value

  //Form Items worksheet - Existing Item column
  var existingItemOptionsColumn = getColumnFromName(formItemsWorksheet, itemName)
  var existingItemOptionValues = getValuesForColumnWithName(formItemsWorksheet, itemName)

  if(existingItemOptionValues.length > 0) { //If there are existing survey item #s
    if (doesNotContain(existingItemOptionValues, newItemValue)){ //Check for dups
      var lastItemOptionRow = existingItemOptionValues.length + 1 // +1 because of header
      formItemsWorksheet.getRange(lastItemOptionRow + 1, existingItemOptionsColumn).setValue(newItemValue) //append new value to the Item Options
      Logger.log("Form Items worksheet - " + itemName + " : Added New Value - " + newItemValue)
      existingItemOptionValues.push(newItemValue)
      updateItemOptionsByTitle(itemName,existingItemOptionValues) //update form
    }
  } else { //add our first survey item number
    formItemsWorksheet.getRange(2, existingItemOptionsColumn).setValue(newItemValue) //second row is first entry
    Logger.log("Form Items worksheet - " + itemName + " : Added First Value - " + newItemValue)
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

/*----------------------------*/
/* Relational Data Management */
/*----------------------------*/

function assignQuestionID(){
  var questionIdColumn = getColumnFromName(responseWorksheet, QUESTION_ID)

  var currentQuestionId = 0
  if(lastResponseRow <= 2){ //this is our first question entry, since first row is header
    currentQuestionId = QUESTION_ID_OFFSET
  } else { //ID = prev + 1
    var secondLastResponseRow = lastResponseRow - 1
    var prevQuestionId = responseWorksheet.getRange(secondLastResponseRow, questionIdColumn).getValue()
    currentQuestionId = prevQuestionId + 1
  }

  //1. Update response worksheet
  responseWorksheet.getRange(lastResponseRow, questionIdColumn).setValue(currentQuestionId)
  //2. Update QID_N worksheet (our hidden sheet)
  qidLastRow = qidWorksheet.getLastRow() //if no rows, this will return 0
  qidWorksheet.getRange(qidLastRow + 1, 1).setValue(currentQuestionId)
}

function updateOptionsWorksheet(){
  var lastRowOptionsWorksheet = optionsWorksheet.getLastRow() //last row in the options worksheet

  //loop through all the non-empty options from Option A to Option I in the response
  var optionAColumn = getColumnFromName(responseWorksheet, OPTION_A)
  var optionIColumn = getColumnFromName(responseWorksheet, OPTION_I)

  var options = []
  var optionPercentages = []

  for(var col=optionAColumn; col<=optionIColumn; col=col+2){
    //get the current option and %
    var currentOption = responseWorksheet.getRange(lastResponseRow,col).getValue()
    var currentPercentage = responseWorksheet.getRange(lastResponseRow,col+1).getValue()

    if (currentOption != null && currentOption != ""){
      options.push(currentOption)
      optionPercentages.push(currentPercentage)
    } else {
      break
    }
  }

  //now insert as many rows are there are options (i.e. if you have Option A, B, C, you will need to insert 3 rows after)
  var numOptions = options.length
  optionsWorksheet.insertRowsAfter(lastRowOptionsWorksheet, numOptions)

  //get Quesition_ID from response worksheet
  var questionIdColumn = getColumnFromName(optionsWorksheet, QUESTION_ID)
  var optionColumn = questionIdColumn + 1
  var percentageColumn = percentageColumn = questionIdColumn + 2

  //fill in our options
  var i = 0
  for(var row=lastRowOptionsWorksheet+1; row<=lastRowOptionsWorksheet+numOptions; row++) {
    optionsWorksheet.getRange(row, questionIdColumn).setValue(currentQuestionId) //Question_ID
    optionsWorksheet.getRange(row, optionColumn).setValue(options[i]) //Option
    optionsWorksheet.getRange(row, percentageColumn).setValue(optionPercentages[i]) //%
    i++
  }
}

function updateKeywordsWorksheet(){
  var lastRowKeywordsWorksheet = keywordsWorksheet.getLastRow()

  //get the keyword in the response, then split it by comma.
  var keywordColumn = getColumnFromName(responseWorksheet, KEYWORDS)
  var keywords = responseWorksheet.getRange(lastResponseRow,keywordColumn).getValue().toString().split(",") //comma separated array

  //now insert as many rows are there are keywords
  var numKeywords = keywords.length
  keywordsWorksheet.insertRowsAfter(lastRowKeywordsWorksheet, numKeywords)

  //Get question ID column
  var questionIdColumn = getColumnFromName(keywordsWorksheet, QUESTION_ID)
  var keywordColumn = questionIdColumn + 1

  //fill in our keywords
  var i = 0
  for(var row=lastRowKeywordsWorksheet+1; row<=lastRowKeywordsWorksheet+numKeywords; row++) {
    keywordsWorksheet.getRange(row, questionIdColumn).setValue(currentQuestionId) //Question_ID
    keywordsWorksheet.getRange(row, keywordColumn).setValue(keywords[i].trim())
    i++
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
