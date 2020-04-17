// Get testing library
if ((typeof GasTap)==='undefined') { // GasT Initialization. (only if not initialized yet.)
  var cs = CacheService.getScriptCache().get('gast');
  if(!cs){
    cs = UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText();
    CacheService.getScriptCache().put('gast', cs, 21600);
  }
  eval(cs);
}
const test = new GasTap()


// Unit tests
function testRunner() {
  test('buildNamedRanges', function (t) {
    t.equal(two_week, ranges['two_week'], `two_week should be ${ranges['two_week']}`)
  })
  
  test('readyString', function (t) {
    t.equal(readyString('X',4), 'XXXX', `X ready string for 4 weeks should be XXXX`)
    t.equal(readyString('O',3), 'OOO', `O ready string for 3 weeks should be OOO`)
    t.equal(readyString('!',2), '!!', `! ready string for 2 weeks should be !!`)
  })
  
  test('cycleValue', function (t) {
    t.equal(cycleValue('X',3), 'XX', `X cycles to XX on a 3 week cycle`)
    t.equal(cycleValue('XX',3), 'XXX', `XX cycles to XXX on a 3 week cycle`)
    t.equal(cycleValue('XXX',3), 'X', `XXX cycles back to to X on a 3 week cycle`)
    t.equal(cycleValue('XXXX',4), 'X', `XXXX cycles back to X on a 4 week cycle`)
  })
  
  test.finish()
}

// Integration tests using 'the eyeball method': Did it work? Look at it and see.
function test_cycleIrrTasks(){
 //set up a test task by placing X's in a cell in the four_week range
 cycleIrrTasks(4, four_week) 
}
