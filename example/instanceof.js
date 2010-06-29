var System=require('interface').System
  , sys = require('sys')
var inst=System([
	function(system,interfaces) {
		interfaces['foo'] = {}
	}
	, function(system,interfaces) {
		interfaces['bar'] = {
			inherits: ['foo']
		}
	}
])
var a=inst.create('bar')
var bar = inst.getConstructorOf('bar')
var c = new bar
sys.puts(c instanceof inst.getConstructorOf('foo'),6)
