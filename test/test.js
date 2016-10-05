const path = require('path');
const stackTrace = require('stack-trace');

function log(){
  var trace = stackTrace.get();
  console.log(trace[1].getFileName());
  
 //console.log(__dirname);
 //console.log(module.parent.filename)
//let caller = path.basename(stackTrace.get()[0]);
 
 //console.log(`[[${caller}]] ${msg}`);

}

 module.exports = log