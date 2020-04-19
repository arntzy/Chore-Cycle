// Constants
const weekly='W'
const two_weekly='2W'
const four_weekly='4W'

// Get our current sheet
const sheet = SpreadsheetApp.getActiveSheet()
const ranges = buildNamedRanges()

// Chore Chart Range
const chores = ranges['chores']
const weekCell = ranges['weekCell']
const rowObjs = buildRows()

function cycleChores() {
  processRows()
  uncheckBoxes()
  addWeek(weekCell)
}

function processRows() {
  for (let i=0; i<rowObjs.length; i++){
    let row = rowObjs[i]
    switch(row.rowType) {
      case 'W':
        cycleWeeklyRow(row)
        break;
      case '2W':
        cycleIrrRow(row, 2)
        break;
      case '4W':
        cycleIrrRow(row, 4)
      default:
        break;
    }
  }
}

function cycleWeeklyRow(row){
  cycleWeek = moduloMove(row.rowVals)
//  Logger.log(`cycleWeek is ${cycleWeek} with length ${cycleWeek.length}`)
//  Logger.log(row.rowRange)
  let pasteRange = sheet.getRange(row.rowRange)
  pasteRange.setValues([cycleWeek])
  renderCheckboxes(cycleWeek,pasteRange)
}

function cycleIrrRow(row, num_weeks){
  let cycledVals = row.rowVals.map(val => cycleValue(val, num_weeks))
  let shouldMove = cycledVals.filter(val => (val && val.length === 1)? true : false ).length > 0
  if (shouldMove) {
//    Logger.log(`moving irregular task left`)
    cycledVals = moduloMove(cycledVals)
  }
//  Logger.log(`cycledVals are ${cycledVals}`)
  let pasteRange = sheet.getRange(row.rowRange)
  pasteRange.setValues([cycledVals])
}

function renderCheckboxes(values, range) {
  let checkboxRange = range
  let numColumns = checkboxRange.getNumColumns()
  for (let col=0; col < numColumns; col++) {
//    Logger.log(`cell is (1,${col + 1})`)
    let val = values[col]
//    Logger.log(`cell (1,${col + 1}) = ${val}`)
    let cell = checkboxRange.getCell(1, col+1)
    if (val || val === false) {
//      Logger.log(`found a value, ${val}`)
      cell.insertCheckboxes()
      cell.setValue(val)
      }
    else { 
      cell.clearDataValidations()
      cell.clearContent()
    }
  }
}

function buildRows() {
 let selection=sheet.getRange(chores)
 let numColumns=selection.getNumColumns()
 let numRows=selection.getNumRows()
 let firstRow=selection.getRow() 
 let lastColumn=selection.getLastColumn()
 let relativeLastColumn=lastColumn - (lastColumn - numColumns)
 let sheetRange = sheet.getRange(firstRow, 1, numRows, lastColumn)
 let sheetValues = sheetRange.getValues()
// Logger.log(`firstRow is ${firstRow}`)
// Logger.log(`number of rows to process is ${numRows}`)
// Logger.log(`lastcolumn is ${lastColumn}`)
// Logger.log(`relativeLastColumn is ${relativeLastColumn}`)
// Logger.log(`sheetRange is ${sheetRange.getA1Notation()}`)
 let rows = []
 for (let row=0; row < numRows; row++) {  
   let rowValues = sheetValues[row]
   let rowType = rowValues[1]
   let rowIndex = row + firstRow
   let rowRange = sheet.getRange(rowIndex, 5, 1, relativeLastColumn).getA1Notation()
   let rowVals = rowValues.slice(4)
//   Logger.log(`rowValues are ${rowValues}`)
//   Logger.log(`rowIndex is ${rowIndex}`)
//   Logger.log(`rowRange is ${rowRange.getA1Notation()}`)
   let rowObject = {
     rowIndex,
     rowType,
     rowVals,
     rowRange, 
   }
   rows.push(rowObject)
 }
return rows
}

function moduloMove(valArray) {
  let clone = [...valArray]
//  Logger.log(`original array length: ${valArray.length}`)
  let newArray = new Array(valArray.length).fill(null)
//  Logger.log(`newArray is ${newArray} with length ${newArray.length}`)
  let popper = clone.shift()
//  Logger.log(`popper is ${popper}`)
//  Logger.log(`clone after shift is ${clone}`)
  if (popper || popper === false) {
    clone.push(popper)
    newclone = [...clone]
//    Logger.log(`clone after valid push is ${newclone}`)
  }
  else {
    newclone = [].concat(clone, newArray).slice(0, valArray.length)
//    Logger.log(`clone after cat/slice is ${newclone} with length ${newclone.length}`)
  }
  return newclone
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

function readyString(value, numWeekCycle) {
 return value[0].repeat(numWeekCycle) 
}

function cycleValue(value, numWeekCycle) {
  if (value) {
    let readyString = value[0].repeat(numWeekCycle)
    if (value !== readyString) return value + value[0]
    else return value[0]
  }
  else return value
}

function addWeek(weekCell) {
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  var date = new Date(sheet.getRange(weekCell).getValue()); 
  var newDate = addDays(date, 7);
  sheet.getRange(weekCell).setValue(newDate);
}
