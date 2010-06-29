/**
http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core.html#ID-536297177
interface NodeList {
  Node               item(in unsigned long index);
  readonly attribute unsigned long    length;
};
**/
//NodeList
//  does not support live nor indexing
//  public -
//    * Node item(Number index)
//    * readonly Number length
//  closures -
//    * Node[] items
//Use ApplyInterface to get a hold of closures for containing classes (example in Node)
exports.NodeList = function(system,interfaces) {
  interfaces['NodeList'] = {
    constructor: function(closures,args) {
      closures['items'] = args
      return {
        item: function(i) {return closures['items'][i]}
        , get length() {return closures['items'].length;}
      }
    }
  }
}
//Makes NodeLists indexable using ES-Harmony's Proxy API, http://wiki.ecmascript.org/doku.php?id=harmony:proxies#api
//  api implemented w/ node-overload for now (not 1-1 but close enough for most purposes)
exports.IndexableNodeList = function(system,interfaces) {
  var oldConstructor = interfaces['NodeList'].constructor
  interfaces['NodeList'].constructor = function() {
    var toProxy = oldConstructor.apply(this,arguments)
    return Proxy.create(toProxy,{
      'has':function(property) { return property in toProxy; }
      'get':function(property) { return toProxy[property]; }
      //cannot set values, use the closure
      //'set':function(property,value) { toProxy[property] = value; }
      'enumerate':function() { return Object.keys(toProxy); }
    })
  }
}