/**
http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core.html#ID-1780488922
interface NamedNodeMap {
  Node               getNamedItem(in DOMString name);
  Node               setNamedItem(in Node arg)
                                        raises(DOMException);
  Node               removeNamedItem(in DOMString name)
                                        raises(DOMException);
  Node               item(in unsigned long index);
  readonly attribute unsigned long    length;
};
**/
//NamedNodeMap(Node owner)
//  public -
//    * getNamedItem(DOMString name) raises DOMException
//    * setNamedItem(Node arg) raises DOMException
//    * removeNamedItem(DOMString name)
//    * item(Number index)
//    * readonly Number length
//  closures -
//    * bool 'readonly' - set to true if node map is readonly
module.exports = function(system,interfaces) {
  interfaces['NamedNodeMap'] = {
    constructor: function(closures,args) {
      var owner = args[0]
        , ownerDocument = args[0].ownerDocument
        , mapping = {/*DOMString,Node*/}
      return {
        getNamedItem(name) {
          name = system.create('DOMString',name)
          return name in mapping?mapping[name]:null;
        }


        //uses Node.nodeName to tell where to put it
        , setNamedItem(arg) {
          if (arg.ownerDocument != ownerDocument) {
            throw system.create('DOMException',interfaces['DOMException'].properties.WRONG_DOCUMENT_ERR)
          }
          if (closures['readonly']) {
            throw system.create('DOMException',interfaces['DOMException'].properties.NO_MODIFICATION_ALLOWED_ERR)
          }
          if (arg.parentNode && arg.parentNode !== owner) {
            throw system.create('DOMException',interfaces['DOMException'].properties.INUSE_ATTRIBUTE_ERR)
          }
          mapping[arg.nodeName] = arg
        }


        , removeNamedItem(name) {
          if (closures['readonly']) {
            throw system.create('DOMException',interfaces['DOMException'].properties.NO_MODIFICATION_ALLOWED_ERR)
          }
          name = system.create('DOMString',name)
          //use in, raw value test wont return true for values that are falsey
          if (name in mapping) {
            var node = mapping[name]
            delete mapping[name]
            return node
          }
          else {
          	throw system.create('DOMException',interfaces['DOMException'].properties.NOT_FOUND_ERR)
          }
        }


        , item: function(index) {
          return Object.keys(mapping)[Number(index)]
        }


        , get length() {
          return Object.keys(mapping).length;
        }
      }
    }
  }
}