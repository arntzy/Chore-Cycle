// Get our current sheet
const sheet = SpreadsheetApp.getActiveSheet()
const ranges = buildNamedRanges()

// Chore Chart Range
const chores = ranges['chores']
const moved_chores = ranges['moved_chores']

// Clipboard Col
const chore_clpbrd = ranges['chore_clpbrd']
const chore_clpbrd_paste = ranges['chore_clpbrd_paste']

// Irregular Ranges
const two_week = ranges['two_week']
const four_week = ranges['four_week']
const total_irr_with_clpbrd = ranges['total_irr_with_clpbrd']

// Run this!
function cycleChores() {
 moveChoresLeft()
 moveClpbrdCol()
 uncheckBoxes()
 cycleIrrTasks(2, two_week)
 cycleIrrTasks(4, four_week)
 moveClpbrdIrrCol(total_irr_with_clpbrd)
 addWeek()
}

function uncheckBoxes() {
let dataRange = sheet.getRange(chores);
let values = dataRange.getValues();
for (var i = 0; i < values.length; i++) {
  for (var j = 0; j < values[i].length; j++) {
    if (values[i][j] == true) {
      values[i][j] = false; 
    }
  }
}
dataRange.setValues(values);
}

function buildNamedRanges() {
  let named_ranges = sheet.getNamedRanges()
  let named_range_dict = {}
  for (let i=0; i<named_ranges.length; i++) {
    let current_range = named_ranges[i]
    named_range_dict[current_range.getName()] = current_range.getRange().getA1Notation()
  }
  return named_range_dict
}

function moveChoresLeft() {
  sheet.getRange(chores).moveTo(sheet.getRange(moved_chores));
}

function moveClpbrdCol() {
  sheet.getRange(chore_clpbrd).moveTo(sheet.getRange(chore_clpbrd_paste));
}

function cycleIrrTasks(num_weeks, week_range) {
 var selection=sheet.getRange(week_range);
 var columns=selection.getNumColumns();
 var rows=selection.getNumRows();
 for (var row=1; row <= rows; row++) { 
   for (var column=1; column <= columns; column++) {
   var cell=selection.getCell(row,column);
   var value=cell.getValue()
   if (value) {
     let cycledValue = cycleValue(value, num_weeks);
     if (value !== readyString(value, num_weeks)) {
       Logger.log("%s-week cycle: Setting %s to %s",num_weeks, value, cycledValue);
     cell.setValue(cycledValue);
     }
     else {
       Logger.log("%s-week cycle: Setting %s to %s, and moving left.",num_weeks, value, cycledValue);
     cell.setValue(cycledValue);
     cell.moveTo(cell.offset(0,-1));
     }
   }
  }
 }
}

function readyString(value, numWeekCycle) {
 return value[0].repeat(numWeekCycle) 
}

function cycleValue(value, numWeekCycle) {
  let readyString = value[0].repeat(numWeekCycle)
  if (value !== readyString) return value + value[0]
  else return value[0]
}

function moveClpbrdIrrCol(irrTaskRange) {
 let selection=sheet.getRange(irrTaskRange);
 let columns=selection.getNumColumns();
 let rows=selection.getNumRows();
 let lastColumn=selection.getLastColumn()
 let relativeLastColumn=lastColumn - (lastColumn - columns)
 for (var row=1; row <= rows; row++) {  
  let cell=selection.getCell(row,1);
  let destCell=selection.getCell(row, relativeLastColumn);
  let value=cell.getValue()
  if (value) {     
    destCell.setValue(value);
    cell.clear()
  }
 }
}

function addWeek() {
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  var date = new Date(sheet.getRange("T2").getValue()); 
  var newDate = addDays(date, 7);
  sheet.getRange("T2").setValue(newDate);
}
