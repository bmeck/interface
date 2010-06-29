/**
http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core.html#ID-17189187
exception DOMException {
  unsigned short   code;
};
// ExceptionCode
const unsigned short      INDEX_SIZE_ERR                 = 1;
const unsigned short      DOMSTRING_SIZE_ERR             = 2;
const unsigned short      HIERARCHY_REQUEST_ERR          = 3;
const unsigned short      WRONG_DOCUMENT_ERR             = 4;
const unsigned short      INVALID_CHARACTER_ERR          = 5;
const unsigned short      NO_DATA_ALLOWED_ERR            = 6;
const unsigned short      NO_MODIFICATION_ALLOWED_ERR    = 7;
const unsigned short      NOT_FOUND_ERR                  = 8;
const unsigned short      NOT_SUPPORTED_ERR              = 9;
const unsigned short      INUSE_ATTRIBUTE_ERR            = 10;
**/
//DOMException
//  Class that holds the code for an exception
module.exports = function(system,interfaces) {
  interfaces['DOMException'] = {
    constructor: function(closures,args) {
      return {
        //cast code to number
        code: Number(args[0])
      }
    }
    , properties: {
      // ExceptionCode
      INDEX_SIZE_ERR                 : 1,
      DOMSTRING_SIZE_ERR             : 2,
      HIERARCHY_REQUEST_ERR          : 3,
      WRONG_DOCUMENT_ERR             : 4,
      INVALID_CHARACTER_ERR          : 5,
      NO_DATA_ALLOWED_ERR            : 6,
      NO_MODIFICATION_ALLOWED_ERR    : 7,
      NOT_FOUND_ERR                  : 8,
      NOT_SUPPORTED_ERR              : 9,
      INUSE_ATTRIBUTE_ERR            : 10
    }
  }
}