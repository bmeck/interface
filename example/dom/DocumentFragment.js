//DocumentFragment
//  closures -
//    * NodeClosures - same as the Node interface's closures
var ApplyInterface = require('interface').ApplyInterface
module.exports = function(system,interfaces,args,inherit) {
  interfaces['DocumentFragment'] = {
    constructor: function(closures,args) {
      var nodeClosures = closures['NodeClosures'] = {}
      return inherit('Node',nodeClosures,[interfaces['Node'].properties.DOCUMENT_FRAGMENT_NODE])
    }
  }
}