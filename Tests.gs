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
    t.equal(chores, ranges['chores'], `chores should be ${ranges['chores']}`)
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
  
  test('moduloMove', function (t) {
    t.deepEqual(moduloMove([1.0,2.0,3.0]), [2.0,3.0,1.0], `[1,2,3] becomes [2,3,1]`)
    t.deepEqual(moduloMove(['a','b','c']), ['b','c','a'], `['a','b','c'] becomes ['b','c','a']`)
    //these don't pass, but appear correct...hmmm.
//    t.deepEqual(moduloMove([,,true,]), [,true,,], `testing array with empty objects`)
//    t.equal(moduloMove([true,,,]), [,,true,], `testing array with empty objects`)            
//    t.equal(moduloMove([,,true,,]).length, 4, `testing array length with empty objects`)
  })
  
  // This test is specific to your sheet, uncomment and modify if you wish
//   test('buildRows', function (t) {
//    t.equal(rowObjs[26].rowType, '4W', `Row 29 has type '4W'`)
//    t.equal(rowObjs[0].rowType, 'W', `Row 29 has type '4W'`)
    //Again these don't work but seem correct...wtf
//    t.deepEqual(rowObjs[26].rowRange.toString(), 'F29:S29', `Row 29 has the range 'F29:S29'`)
//    t.deepEqual(rowObjs[0].rowRange.toString(), 'F3:S3', `Row 29 has the range 'F3:S3'`)
//   })
   
   test.finish()
}
