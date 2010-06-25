//var irc=require('irc');
var sys=require('sys');

//Utility for closures / interfaces
function applyInterfaces(target,interfaces,obj,instanceClosures,args) {
	var interfaceDescriptor = interfaces[target];
	if (!interfaceDescriptor) {
		throw "Interface "+target+" not found."
	}
	var superInterfaces = interfaceDescriptor.inherits
	if (superInterfaces) for (var i=0;i<superInterfaces.length;i++) {
		applyInterfaces(superInterfaces[i],interfaces,obj,instanceClosures)
	}
	var hooks = interfaceDescriptor.hooks
	if (hooks && hooks.preInit ) {
		interfaceDescriptor.hooks.preInit(obj,instanceClosures,args)
	}
	var properties = interfaceDescriptor.properties
	if(properties) for (var property in properties) {
		var value = properties[property]
		if (value instanceof Function) {
			value = value(obj,instanceClosures,args)
		}
		Object.defineProperty(obj,property,value);
	}

	if (hooks && hooks.postInit ) {
		interfaceDescriptor.hooks.postInit(obj,instanceClosures,args)
	}
}

function System(layers) {
	var interfaces = {}, systemClosures = {}
	//calling as a sub-interface ignores stored closure/interface pack
	//TODO: ponder if we should have a function that will preserve these?
	var result=function(supersystem,interfaces,closures) {
		layers.forEach(function (layer,index) {
			layer.call(this,supersystem,interfaces,closures);
		})
	}
	result.create = function(target) {
		var result=this==(function(){return this})()?{}:this;//hack to allow a .call inheritence
		applyInterfaces(target,interfaces,result,{},Array.prototype.slice.call(arguments,1));
		return result;
	}
	layers.forEach(function (layer,index) {
		layer.call(this,result,interfaces,systemClosures);
	})
	return result;
}

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