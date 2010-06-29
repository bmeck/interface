//DOMImplementation
//  public -
//    * hasFeature(string feature[, string version])
//        returns true if this DOM implements feature and if version is included will return false
//        unless it has the same version implemented
//  closures -
//    * addFeature(string feature, string version)
//        makes it so hasFeature(feature) and hasFeature(feature,version) returns true
module.exports = function(system,interfaces) {
  interfaces['DOMImplementation'] = {
    constructor: function(closures,args) {
      var features = {}
      closures.addFeature = function(feature,version) {
        var features = closures['features'][feature] || closures['features'][feature] = {}
        features[version] = true
      }
      return {
        hasFeature:function(feature,version){
          feature = closures.features[String(feature.toLowerCase())]
          if(!feature || (version && !feature[version])) {
            return false
          }
          return true
        }
      }
    }
  }
}