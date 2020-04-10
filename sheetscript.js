/**

Sheet Script

This script runs whenever the Responses Google Sheet updates the Dynamic Options worksheet
Author: Lilly Tong

**/

//Global variables

var formId = "1manXOOsXt0VRXnODhRHKBTm4GXpsUkkB1dSik5d5LtU"; //Google Form: COVID-19 Survey Entry
var spreadsheetId = "1-FCuugGS9MTJvT9uCZiIVLhPTRMzdiSckEHveXRs-Vg"; //Google Sheet: Form Responses

//Google Sheets
var optionsWorksheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Options")

//Survey Entry Google Form
var form = FormApp.openById(formId);
var formItems = form.getItems()

/*----------------*/
/* Event Triggers */
/*----------------*/

//This is called by our Installable Trigger - onEdit()
function installableOnEdit(e){
  //First make sure this was triggered from the Options worksheet
  if (e.range.getSheet().getName() != "Options"){
    return
  }
  var col = e.range.getColumn() //find out which column was edited
  updateOptionsForColumn(col)
}

function updateOptionsForColumn(col){
  //1. Find the column header given the column number (i.e. find out which dropdown this is for)
  var title = getHeaderFromColumn(optionsWorksheet, col)
  //2. Get all the values (options) for this column
  var values = getValuesForColumn(optionsWorksheet, col)
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

function getColumnNumberFromHeader(sheet, name) {
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
