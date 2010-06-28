var sys = require('sys')

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
	var interfaces = {}, systemClosures = {}, $global =(function(){return this})(),$this = this==$global
		?function(supersystem,interfaces,closures) {
			layers.forEach(function (layer,index) {
				layer.call(supersystem,supersystem,interfaces,closures);
			})
		}
		:this;
	$this.create = function(target) {
		var result=this==$global||this==$this?{}:this;//hack to allow a .call inheritence for 'new' keyword
		applyInterfaces(target,interfaces,result,{},Array.prototype.slice.call(arguments,1));
		return result;
	}
	layers.forEach(function (layer,index) {
		layer.call($this,$this,interfaces,systemClosures);
	})
	return $this;
}

//node support
if (module && module.exports) {module.exports = {System:System}}
