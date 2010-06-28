var System = require('../lib/interface').System
  , sys = require('sys')
//should output 123
var NestedInterfaceCreation = System([
	function (system,interfaces) {
		interfaces['super'] = {
			hooks: {
				preInit: function(obj,closures) {
					closures['nest'] = new system.create('sub')
					sys.puts(closures['nest'].value)
				}
			}
		}
	},
	function (system,interfaces) {
		interfaces['sub'] = {
			properties: {
				value: {value: 123}
			}
		}
	}
])
NestedInterfaceCreation.create('super')
