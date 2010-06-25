var sys=require('sys')
  , System = require('interface').System;

function example() {
	var ex = {
		node: function (system,interfaces){
			interfaces['DOMNode'] = {
				properties: {
					nodeType: {value:0}
					, nodeValue: {value:null}
				}
			}
		}
		, events: function (system,interfaces){
			var DOMNode = interfaces['DOMNode']
			// check for interface closure map
			if (!DOMNode.closures) DOMNode.closures = {}
			DOMNode.closures.events = "Mapping of <string,array> to hold event callbacks"
			if (!DOMNode.hooks) DOMNode.hooks = {}
			DOMNode.hooks.preInit = function(obj,closures) {
				//events are private, put them in the closures
				//use preInit as setup
				closures.events = {}
			}
			DOMNode.properties.addEventListener = function(obj,closures) {
				return {value:function(type,callback) {closures.events[type]=callback}}
			}
		}
		, element: function (system,interfaces){
			interfaces['DOMElement'] = {
				//Give it everything DOMNode has
				inherits : ['DOMNode'/*,...?*/]
				, properties: {
					tagName: function (obj,closures,args) { return {value:args[0]} }
					//supply a function as a property instead of a property descriptor in order to access closure of an object
					, dispatchEvent: function (obj,closures){
						return {
							value:function(type,event) {return closures.events[type](event);}
						}
					}
				}
			}
		}
		, document: function(system,interfaces) {
			interfaces['DOMDocument'] = {
				inherits: ['DOMNode']
				, properties : {
					createElement: {
						value: function(type){
							var elem=system.create('DOMElement',type)
						}
						, enumerable: true
					}
				}
			}
		}
		, window: function (system,interfaces){
			interfaces['DOMWindow'] = {
				hooks: {
					//add document before anything else touches
					preInit: function(obj) {
						obj.document = system.create('DOMDocument')
						obj.Element = function(type) {system.create.call(this,'DOMElement',type)}
					}
				}
			}
		}
	}
	//Grab all of these
	JSDOM=System([
		ex.node,
		ex.element,
		ex.events,
		ex.document,
		ex.window
	])
	var window = JSDOM.create('DOMWindow')
	sys.puts(new window.Element('span').tagName)
	sys.puts(sys.inspect(window.document))
	var superex = {
		innerHTML: function(system,interfaces,closures) {
			interfaces['DOMElement'].properties.innerHTML = {
				value : "#innerHTML"
			}
		}
	}
	//Merge interfaces (closure is not shared)
	//Elements now have an innerHTML property
	var JSDOM2=System([
		JSDOM,
		superex.innerHTML
	])
	elem = JSDOM2.create('DOMElement','div')
	sys.puts(elem.innerHTML)
	//test crossing closures across interfaces
	elem.addEventListener('blur',function(){
		sys.puts('im blurring')
	})
	elem.dispatchEvent('blur',{})
}
example()