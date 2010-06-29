/**
http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core.html#ID-1950641247
Node {

  // NodeType
  const unsigned short      ELEMENT_NODE                   = 1;
  const unsigned short      ATTRIBUTE_NODE                 = 2;
  const unsigned short      TEXT_NODE                      = 3;
  const unsigned short      CDATA_SECTION_NODE             = 4;
  const unsigned short      ENTITY_REFERENCE_NODE          = 5;
  const unsigned short      ENTITY_NODE                    = 6;
  const unsigned short      PROCESSING_INSTRUCTION_NODE    = 7;
  const unsigned short      COMMENT_NODE                   = 8;
  const unsigned short      DOCUMENT_NODE                  = 9;
  const unsigned short      DOCUMENT_TYPE_NODE             = 10;
  const unsigned short      DOCUMENT_FRAGMENT_NODE         = 11;
  const unsigned short      NOTATION_NODE                  = 12;

  readonly attribute DOMString        nodeName;
           attribute DOMString        nodeValue;
                                        // raises(DOMException) on setting
                                        // raises(DOMException) on retrieval

  readonly attribute unsigned short   nodeType;
  readonly attribute Node             parentNode;
  readonly attribute NodeList         childNodes;
  readonly attribute Node             firstChild;
  readonly attribute Node             lastChild;
  readonly attribute Node             previousSibling;
  readonly attribute Node             nextSibling;
  readonly attribute NamedNodeMap     attributes;
  readonly attribute Document         ownerDocument;
  Node               insertBefore(in Node newChild,
                                  in Node refChild)
                                        raises(DOMException);
  Node               replaceChild(in Node newChild,
                                  in Node oldChild)
                                        raises(DOMException);
  Node               removeChild(in Node oldChild)
                                        raises(DOMException);
  Node               appendChild(in Node newChild)
                                        raises(DOMException);
  boolean            hasChildNodes();
  Node               cloneNode(in boolean deep)
                                        raises(DOMException);
};

The values of nodeName, nodeValue, and attributes vary according to the node type as follows:
                         nodeName                   nodeValue                             attributes
Attr                     name of attribute          value of attribute                    null
CDATASection             #cdata-section             content of the CDATA Section          null
Comment                  #comment                   content of the comment                null
Document                 #document                  null                                  null
DocumentFragment         #document-fragment         null                                  null
DocumentType             document type name         null                                  null
Element                  tag name                   null                                  NamedNodeMap
Entity                   entity name                null                                  null
EntityReference          name of entity referenced  null                                  null
Notation                 notation name              null                                  null
ProcessingInstruction    target                     entire content excluding the target   null
Text                     #text                      content of the text node              null
**/
//  closures -
//    parentNode
//    nodeName
//    nodeValue
//    childNodesClosures
//
module.exports = function(system,interfaces,systemClosures,inherit) {
  interfaces['Node'] = {
    constructor = function (closures,args,interfaceClosures) {
      var result = {
        //readonly (siblings must be managed by parentNode)
        get childNodes() {return closures['childNodes']}
        , get firstChild() {return closures['firstChild'] }
        , get lastChild() {return closures['lastChild'] }
        , get nextSibling() {return closures['nextSibling'] }
        , get nodeName() {return closures['nodeName'] }
        , get nodeType() {return closures['nodeType'] }
        , get nodeValue() {return closures['nodeValue'] }
        , get previousSibling() {return closures['previousSibling'] }
        , get attributes() {return closures['attributes'] }
        , get ownerDocument() {return closures['ownerDocument'] }


        //accessors
        , hasChildren: function() {return this.childNodes.length > 0}


        //mutators
        , appendChild: function(newChild) {
          return this.insertBefore(newChild,null)
        }


        , insertBefore: function(newChild,referenceChild) {
          //check if this Node is readonly, try to removeChild on newChild to make sure it can be removed
          if(closures['readOnly']) {
            throw system.create('DOMException',interfaces['DOMException'].properties.NO_MODIFICATION_ALLOWED_ERR)
          }
          var parentNode = this
          while (parentNode) {
            if(parentNode === newChild) {
              throw system.create('DOMException',interfaces['DOMException'].properties.HIERARCHY_REQUEST_ERR)
            }
            parentNode = parentNode.parentNode
          }
          if (this.ownerDocument !== newChild.ownerDocument) {
              throw system.create('DOMException',interfaces['DOMException'].properties.WRONG_DOCUMENT_ERR)
          }
          if(newChild.parentNode) newChild.parentNode.removeChild(newChild)
          var childNodesArray = closures['childNodesClosures']['items']
          //not supposed to throw an error if reference isnt a child according to spec... but... seems dumb
          childNodesArray.splice(refrenceChild===null?childNodesArray.length:childNodesArray.indexOf(referenceChild),0,newChild)
          return newChild
        }


        , removeChild: function(child) {
          if(closures['readOnly']) {
            throw system.create('DOMException',interfaces['DOMException'].properties.NO_MODIFICATION_ALLOWED_ERR)
          }
          var childNodesArray = closures['childNodesClosures']['items']
            , childIndex = childNodesArray.indexOf(referenceChild)
          if(childIndex === -1) {
            throw system.create('DOMException',interfaces['DOMException'].properties.NOT_FOUND_ERR)
          }
          childNodesArray.splice(childIndex,1)
          return child
        }


        , replaceChild: function(newChild,oldChild) {
          //check if this Node is readonly, try to removeChild on newChild to make sure it can be removed
          if(closures['readOnly']) {
            throw system.create('DOMException',interfaces['DOMException'].properties.NO_MODIFICATION_ALLOWED_ERR)
          }
          var parentNode = this
          while (parentNode) {
            if(parentNode === newChild) {
              throw system.create('DOMException',interfaces['DOMException'].properties.HIERARCHY_REQUEST_ERR)
            }
            parentNode = parentNode.parentNode
          }
          if (this.ownerDocument !== newChild.ownerDocument) {
              throw system.create('DOMException',interfaces['DOMException'].properties.WRONG_DOCUMENT_ERR)
          }
          var childNodesArray = closures['childNodesClosures']['items']
            , childNodes = newChild instanceof system.getConstructor('DocumentFragment')?newChild.childNodes:[newChild]
          //remove will throw an error (TODO: Transactional?)
          childNodes.forEach(function(child) {
            if(child.parentNode) child.parentNode.removeChild(child)
          })
          //not supposed to throw an error if reference isnt a child according to spec... but... seems dumb
          Array.splice.apply(childNodesArray,[childNodesArray.indexOf(oldChild),1].concat(
            childNodes
          ))
          return newChild
        }
      }
        , childNodesClosures = closures['childNodesClosures'] = {}
        //get NodeList but store its closure in childNodesClosures
      var childNodes = closures['childNodes'] = inherit('NodeList',childNodesClosures)
      closures['nodeName'] = null
      closures['nodeValue'] = null
      closures['parentNode'] = null

      if(!'key' in interfaceClosures) {
        //give a unique key
        var $key = {}
        //TODO: make non-linear performance?
        //have to use an array for uniqueness... suck
        //LEAK!
        var closures = []
        //grab closures to mess w/ siblings and parentNodes w/o readOnly funny bussiness
        interfaceClosures.getClosures(key,node) {
          if(key === $key && node === result) {
            return closures
          }
        }
        interfaceClosures.addClosures(key,node) {
          if(key === $key) {
            return closures
          }
        }
      }
      var id = interfaceClosures.id++
      return result
    }
    , properties: {
      ELEMENT_NODE                   : 1,
      ATTRIBUTE_NODE                 : 2,
      TEXT_NODE                      : 3,
      CDATA_SECTION_NODE             : 4,
      ENTITY_REFERENCE_NODE          : 5,
      ENTITY_NODE                    : 6,
      PROCESSING_INSTRUCTION_NODE    : 7,
      COMMENT_NODE                   : 8,
      DOCUMENT_NODE                  : 9,
      DOCUMENT_TYPE_NODE             : 10,
      DOCUMENT_FRAGMENT_NODE         : 11,
      NOTATION_NODE                  : 12,

  }
}