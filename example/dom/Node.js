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
var ApplyInterface = require('interface').ApplyInterface
module.exports = function(system,interfaces) {
  interfaces['Node'] = {
    constructor = function (closures,args) {
      var type = args[0]
      var result = {}
        , childNodesClosures = closures['childNodesClosures'] = {}
        //get NodeList but store its closure in childNodesClosures
        ApplyInterface(system,'NodeList',interfaces,childNodesClosures)
        closures['parentNode'] = null
        closures['nodeName'] =
      return result;
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
      NOTATION_NODE                  : 12
  }
}