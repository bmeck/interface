var sys = require('sys')
  , System = require('interface').System
System([
  function(system,interfaces,closures) {
    interfaces["Hello"] = {properties:
      {print:
        {value:function(){
          sys.puts("Hello World!")
       }}
     }
    }
  }
]).create("Hello").print()