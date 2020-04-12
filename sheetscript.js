/**

Sheet Script

This script runs whenever the Responses Google Sheet updates the Dynamic Options worksheet
Author: Lilly Tong

**/

//Global variables

var formId = "1manXOOsXt0VRXnODhRHKBTm4GXpsUkkB1dSik5d5LtU"; //Google Form: COVID-19 Survey Entry
var spreadsheetId = "1-FCuugGS9MTJvT9uCZiIVLhPTRMzdiSckEHveXRs-Vg"; //Google Sheet: Form Responses

//Worksheet Names
const QUESTIONS_N = "Questions_N (Form Responses)"
const FORM_ITEMS = "Form Items"
const QID_N = "QID_N"
const OPTIONS_N = "Options_N"
const KEYWORDS_N = "Keywords_N"

//Column names
const QUESTION_ID = "Question_ID"

//Google Sheets
var responseWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(QUESTIONS_N)
var formItemsWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(FORM_ITEMS)
var qidWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(QID_N)
var optionsWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(OPTIONS_N)
var keywordsWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(KEYWORDS_N)

//Survey Entry Google Form
var form = FormApp.openById(formId);
var formItems = form.getItems()

/*----------------*/
/* Event Triggers */
/*----------------*/

//Deletion of response row trigger action
function installableOnChange(e){
  //if we deleted a row from the response
  if(e.source.getActiveSheet().getName() == QUESTIONS_N && e.changeType == "REMOVE_ROW"){

    //1. Response worksheet: Grab all the new values in column Question_Id
    var questionIdColumn = getColumnFromName(responseWorksheet, QUESTION_ID)
    var qidsInResponse = getValuesForColumn(responseWorksheet, questionIdColumn)

    //2. QID_N worksheet: grab all the recorded Question_IDs
    var qids = getValuesForColumnNoHeader(qidWorksheet, 1)

    Logger.log("qidsInResponse:"+printArray(qidsInResponse))
    Logger.log("qids:"+printArray(qids))

    //3. Scan for the value not found in the response worksheet but found in qids. That is the one we deleted
    //Since both arrays sorted, scan for first difference
    //qidsInResponse: 253,254,256
    //qids:253,254,255,256
    //deleted: 255
    var deletedQid = -1
    for(var i in qidsInResponse){ //must use qidsInResponse here because it has one less value so the loop will run out first
      if(qidsInResponse[i] != qids[i]) {
        deletedQid = qids[i]
        Logger.log("Found deleted row: " + deletedQid)
        break
      }
    }

    if (deletedQid == -1) { //we didn't find any matches
      if(qids.length - qidsInResponse.length == 1) { //if qids is exactly one more than qidsInResponse
        deletedQid = qids[qids.length - 1] //last number in the array is the difference, which means we deleted the last row in the response
      }
    }

    //If we still didn't set the deletedQid, means we don't have a match
    if (deletedQid == -1){
      return
    }

    deleteOptions(deletedQid)
    deleteKeywords(deletedQid)
    deleteQID(deletedQid) //finally, remove the QID from our QID worksheet

    var lastResponseRow = responseWorksheet.getLastRow()
    if (lastResponseRow < 2) { //no responses
      form.setDescription("Status: Ready for submission\n--------------------------------------------\nNo Entries")
    }
  }
}

//This is called by our Installable Trigger - onEdit()
function installableOnEdit(e){
  //First make sure this was triggered from the Options worksheet
  if (e.range.getSheet().getName() != FORM_ITEMS){
    return
  }
  var col = e.range.getColumn() //find out which column was edited
  updateOptionsForColumn(col)
}

function updateOptionsForColumn(col){
  //1. Find the column header given the column number (i.e. find out which dropdown this is for)
  var title = getHeaderFromColumn(formItemsWorksheet, col)
  //2. Get all the values (options) for this column
  var values = getValuesForColumn(formItemsWorksheet, col)
  //3. Find out what type the item is, then update the item
  var item = getFormItemByTitle(title)

  switch(item.getType()){
    case FormApp.ItemType.LIST:
      updateDropdown(item, values)
      Logger.log("Updating Dropdown column - " + title + " - with values " + printArray(values))
      break
      case FormApp.ItemType.MULTIPLE_CHOICE:
      updateMultipleChoice(item, values)
      Logger.log("Updating Multiple Choice column - " + title + " - with values " + printArray(values))
      break
      case FormApp.ItemType.CHECKBOX:
      updateCheckbox(item, values)
      Logger.log("Updating Checkbox column - " + title + " - with values " + printArray(values))
      break
      default:
      return
  }
}

//Options worksheet: remove all records for the given questionId
function deleteOptions(questionId){
  //iterate through all the rows, delete rows where questionId matches the given one
  var lastOptionRow = optionsWorksheet.getLastRow()
  var questionIdColumn = 1
  if (lastOptionRow < 2) { //no records
    return
  }
  //go through the Question Id Column
  var foundMatch = false
  for(var row=2; row<=lastOptionRow;row++){ //start with row 2, our first record
    let cellVal = optionsWorksheet.getRange(row,questionIdColumn).getValue()
    if (!foundMatch && cellVal == questionId) {
      optionsWorksheet.deleteRow(row)
      foundMatch = true
      while(cellVal == questionId){
        optionsWorksheet.deleteRow(row)
        cellVal = optionsWorksheet.getRange(row,questionIdColumn).getValue() //this is now row+1 (from below) that shifted up to row
      }
    }
  }
}

//Keywords worksheet: remove all records for the given questionId
function deleteKeywords(questionId){
  var lastKeywordRow = keywordsWorksheet.getLastRow()
  var questionIdColumn = 1
  if (lastKeywordRow < 2) { //no records
    return
  }
  //go through the Question Id Column
  var foundMatch = false
  for(var row=2; row<=lastKeywordRow;row++){ //start with row 2, our first record
    let cellVal = keywordsWorksheet.getRange(row,questionIdColumn).getValue()
    if (!foundMatch && cellVal == questionId) {
      keywordsWorksheet.deleteRow(row)
      foundMatch = true
      while(cellVal == questionId){
        keywordsWorksheet.deleteRow(row)
        cellVal = keywordsWorksheet.getRange(row,questionIdColumn).getValue() //this is now row+1 (from below) that shifted up to row
      }
    }
  }
}

function deleteQID(questionId){
  var lastQIDRow = qidWorksheet.getLastRow()
  var questionIdColumn = 1
  if (lastQIDRow < 1) { //no records
    return
  }
  //go through the Question Id Column
  var foundMatch = false
  for(var row=1; row<=lastQIDRow;row++){ //start with row 1, our first record
    let cellVal = qidWorksheet.getRange(row,questionIdColumn).getValue()
    if (!foundMatch && cellVal == questionId) {
      qidWorksheet.deleteRow(row) //only one row to delete
      foundMatch = true
    }
  }
}

/*--------------------------*/
/* Private Helper Functions */
/*--------------------------*/

//update a dropdown options
function updateDropdown(item, values){
  item.asListItem().setChoiceValues(values)
}

//update a multiple choice item options
function updateMultipleChoice(item, values){
  item.asMultipleChoiceItem().setChoiceValues(values).showOtherOption(true)
}

//update a checkbox item options
function updateCheckbox(item, values){
  item.asCheckboxItem().setChoiceValues(values)
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

function getColumnFromName(sheet, name) {
  var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] == name) return i + 1;
  }
  return -1;
}

function getHeaderFromColumn(sheet, col) {
  var header = sheet.getRange(1,col).getValue() //first row is the header
  return header
}

function getValuesForColumn(sheet, column){
  var numRows = sheet.getLastRow(); //last row for the whole sheet

  if (numRows < 2){ //empty sheet
    return ["None"] //default
  }

  // Get all data for the given column
  var data = sheet.getRange(1, column, numRows).getValues();
  var values = []

  // Iterate through all the rows until we find an empty cell. Remember we are referencing by indices, so -1.
  for(var rowInd = 1; rowInd < numRows ; rowInd++){ //starting with row index = 1 since first row (ind=0) is header
    if (data[rowInd][0] != null && data[rowInd][0] != ""){ //col index is fixed at 0 since it's a single column
      values.push(data[rowInd][0])
    } else {
      //Found our first empty cell
      if(rowInd == 1){ //if this is the second row in this column, that means there are no entries in this column
        return ["None"]
      }
      break
    }
  }

  return values
}

function getValuesForColumnNoHeader(sheet, column){
  var numRows = sheet.getLastRow(); //last row for the whole sheet

  if (numRows == 0){ //empty sheet
    return [] //default
  }

  // Get all data for the given column
  var data = sheet.getRange(1, column, numRows).getValues();
  var values = []

  // Iterate through all the rows until we find an empty cell. Remember we are referencing by indices, so -1.
  for(var rowInd = 0; rowInd < numRows ; rowInd++){ //starting with first row (rowInd = 0)
    if (data[rowInd][0] != null && data[rowInd][0] != ""){ //col index is fixed at 0 since it's a single column
      values.push(data[rowInd][0])
    }
  }

  return values
}

function printArray(array){
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
