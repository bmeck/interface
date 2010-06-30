var System=require('interface').System
  , sys = require('sys')
var inst=System([
	function(system,interfaces) {
		interfaces['foo'] = {}
		interfaces['bar'] = {inherits:['foo']}
	}
])
var a=inst.create('foo')
var foo = inst.getConstructorOf('foo')
var bar = inst.getConstructorOf('bar')
foo.prototype.print = function(){return 'foo'}
bar.prototype.print = function(){return 'bar'}
var c = bar()
sys.puts(a.print(),c.print())
