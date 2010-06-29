var sys = require('sys')

//Utility for closures / interfaces
//Cannot be part of System due to possible abuse from outside
function ApplyInterface(system,target,interfaces,instanceClosures,args) {
	var interfaceDescriptor = interfaces[target]
	  ,obj=this==(function(){return this})()?{}:this
	    //Use a constructor if provided
	    ?interfaceDescriptor.constructor?interfaceDescriptor.constructor(instanceClosures,args):{}
	    :this
	if (!interfaceDescriptor) {
		throw "Interface "+target+" not found."
	}
	var superInterfaces = interfaceDescriptor.inherits
	if (superInterfaces) for (var i=0;i<superInterfaces.length;i++) {
		ApplyInterface(system,superInterfaces[i],interfaces,obj,instanceClosures)
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
		if (value.value || value['set'] || value['get']) {
		  Object.defineProperty(obj,property,value)
		}
		else {
		  obj[property] = value
		}
	}
	if (hooks && hooks.postInit ) {
		interfaceDescriptor.hooks.postInit(obj,instanceClosures,args)
	}
	var proto = system.getConstructorOf(target)
	addProto(obj,proto)
	return obj
}

function addProto(obj,proto) {
	if(obj instanceof proto) { return obj }
	proto.prototype = obj.__proto__
	obj.__proto__ = new proto
	return obj
}

function System(layers) {
	var interfaces = {}, systemClosures = {}, $global =(function(){return this})(),$this = this==$global?{}:this,$prototypes={}
		?function(supersystem,interfaces,closures) {
			layers.forEach(function (layer,index) {
				layer.call(supersystem,supersystem,interfaces,closures);
			})
		}
		:this;
	Object.defineProperty($this,'create',{'get':function(){return function(target) {
		var result=ApplyInterface.call(this,$this,target,interfaces,{},Array.prototype.slice.call(arguments,1));
		return result;
	}}})
	Object.defineProperty($this,'getConstructorOf',{'get':function(){return function(target) {
		return $prototypes[target] || ($prototypes[target] = function(){
			var obj=this==(function(){return this})()?{}:this
			$this.create.apply(this,[target].concat(Array.prototype.slice.call(arguments)))
			return obj
		})
	}}})
	layers.forEach(function (layer,index) {
		layer.call($this,$this,interfaces,systemClosures);
	})
	return $this;
}

//node support
if (module && module.exports) {
	module.exports = {
	  'System':System
	  , 'ApplyInterface':ApplyInterface
	}
}
