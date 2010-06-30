var System=require('interface').System
  , sys = require('sys')
var inst=System([
	function(system,interfaces) {
		interfaces['foo'] = {}
	}
])
var a=inst.create('foo')
var bar = inst.getConstructorOf('foo')
bar.prototype.print = function(){return 444}
var c = new bar
sys.puts(a.print(),c.print())
