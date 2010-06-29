/**
http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core.html#ID-102161490
interface DOMImplementation {
  boolean            hasFeature(in DOMString feature,
                                in DOMString version);
};
**/
//DOMImplementation
//  public -
//    * hasFeature(DOMString feature[, DOMString version])
//        returns true if this DOM implements feature and if version is included will return false
//        unless it has the same version implemented
//  closures -
//    * addFeature(DOMString feature, DOMString version)
//        makes it so hasFeature(feature) and hasFeature(feature,version) returns true
**/
module.exports = function(system,interfaces) {
  interfaces['DOMImplementation'] = {
    constructor: function(closures,args) {
      var features = {}
      closures['addFeature'] = function(feature,version) {
        //convert arguments to DOMString for possible features
        feature = system.create('DOMString',feature)
        version = system.create('DOMString',version)
        var features = closures.features[feature] || closures.features[feature] = {}
        features[version] = true
      }
      return {
        hasFeature:function(feature,version){
          //convert arguments to DOMString for possible features
          feature = system.create('DOMString',feature)
          feature = closures.features[feature]
          //lazy convert version
          if(!feature || (version && !feature[system.create('DOMString',version)])) {
            return false
          }
          return true
        }
      }
    }
  }
}