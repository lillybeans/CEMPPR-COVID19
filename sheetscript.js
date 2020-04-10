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
  updateDropdownForColumn(col)
}

//Update a dropdown given the column number in the options worksheet
function updateDropdownForColumn(col){
  //1. Find the column header given the column number (i.e. find out which dropdown this is for)
  var dropdownTitle = getHeaderFromColumn(optionsWorksheet, col)
  //2. Get all the values (options) for this column
  var values = getValuesForColumn(optionsWorksheet, col)
  //3. Update the corresponding dropdown with the same title
  Logger.log("Updating dropdown column " + col + " - " + dropdownTitle + " with values " + printArray(values))
  updateDropdownByTitle(dropdownTitle, values)
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
