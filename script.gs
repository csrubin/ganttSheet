function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Custom Menu')
      .addItem('Show alert', 'showAlert')
      .addToUi();
  SpreadsheetApp.getUi()
      .createMenu('Custom Menu')
      .addItem('Show prompt', 'showPrompt')
      .addToUi();
}

function addRow(type){
  var sheet = SpreadsheetApp.getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  var lastCol = sheet.getLastColumn();
  var targetRow = (type == 'Task')? 11 : 10;
  var targetRange = sheet.getRange(targetRow, 1, 1, lastCol);
  var lastRow = sheet.getLastRow();
  var destinationRange = sheet.getRange(lastRow + 1, 1, 1, lastCol);
  
  var result = ui.prompt(
      'Please enter a title for the ' + type,
      type + ' Title:',
      ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var input = result.getResponseText();
  if (button == ui.Button.OK) {
    targetRange.copyTo(destinationRange);
    targetRange = destinationRange.getCell(1, 3);
    targetRange.setValue(input);
  } 
}

function addTask(){
  addRow('Task');
}

function addStage(){
  addRow('Stage');
}

function addWeek(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  var weekCount = 1;
  
  var result = ui.prompt(
      'How many weeks would you like to add?',
      'Number of Weeks:',
      ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var input = result.getResponseText();
  if (button == ui.Button.OK) {
    if (input != '') weekCount = parseInt(input);
    for (i = 1; i <= weekCount; i++){
      var lastCol = sheet.getLastColumn();
      var lastRow = sheet.getLastRow();
      var tableRows = lastRow - 8;
      var week = sheet.getRange(8, lastCol - 4, lastRow - 7, 5);
      var destinationRange = sheet.getRange(8, lastCol + 1);
      var maxCol = sheet.getMaxColumns();
      if (maxCol < (lastCol + 5)) sheet.insertColumnsAfter(maxCol, 5);
      week.copyTo(destinationRange); 
    }
  } 
}

function deleteSelected() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSheet();
  var result = ui.alert(
     'This will erase the selected data and cells',
     'Are you sure you want to continue?',
      ui.ButtonSet.YES_NO);
  
  if (result == ui.Button.YES) {
    var selectedCells = sheet.getActiveRange();
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    var lastRangeRow = selectedCells.getLastRow();
    if (lastRangeRow < lastRow){
      var bottomTable = sheet.getRange(lastRangeRow + 1, 1, lastRow - lastRangeRow, lastCol);
      bottomTable.copyTo(selectedCells);
      var lastRange = sheet.getRange(lastRow, 1, 1, lastCol);
      lastRange.clear();
      lastRange.deleteCells(SpreadsheetApp.Dimension.COLUMNS);
    } else{
      selectedCells.clear();
      selectedCells.deleteCells(SpreadsheetApp.Dimension.COLUMNS);
    }
  }
}

function swapRows(){
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var rows = [];
  var overflow = false;

  for (var i = 11; i <= lastRow; i++){
    var cell = sheet.getRange(i, 1);
    if(cell.getValue() == '1'){
      if(rows.length < 2) rows.push(i);
      else overflow = true;
    }
  }
  if(rows.length == 1){
    var result = ui.prompt(
      'What row would you like to put this row under? ',
      'Row: ',
      ui.ButtonSet.OK_CANCEL);
  
    var button = result.getSelectedButton();
    var input = result.getResponseText();
    if (button == ui.Button.OK) {
      var end = parseInt(input) + 1;
      var secondary = rows[0] - 1
    } 
  } else if (overflow) ui.alert('Please select no more than two rows!');
  else if (rows.length == 0) ui.alert('Please select at least one row!');
  else{
    var end = rows[1]
    var secondary = rows[1];
  }
  var primary = rows[0];
  for (var i = secondary; i >= end; i--){
    var tempRange = sheet.getRange(lastRow + 1, 1, 1, lastCol);
    var primaryRange = sheet.getRange(primary, 1, 1, lastCol);
    var secondaryRange = sheet.getRange(i, 1, 1, lastCol);
    primaryRange.copyTo(tempRange);
    secondaryRange.copyTo(primaryRange);
    tempRange.copyTo(secondaryRange);
    tempRange.clearContent();
    tempRange.deleteCells(SpreadsheetApp.Dimension.COLUMNS);  
    primary--;
  }
    
}
