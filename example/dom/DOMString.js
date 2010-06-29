/**
http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core.html#ID-C74D1578
typedef sequence<unsigned short> DOMString;
**/
//DOMString
//  Class that wraps a String
module.exports = function(system,interfaces) {
  interfaces['DOMString'] = {
    constructor: function(closures,args) {
        if(args.length) {
          return String(args[0])
        }
        else {
          return String()
        }
    }
  }
}