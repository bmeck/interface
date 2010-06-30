var sys = require('sys')

//Utility for closures / interfaces
//Cannot be part of System due to possible abuse from outside
function ApplyInterface(system,target,interfaces,interfaceClosures,instanceClosures,args) {
	var interfaceDescriptor = interfaces[target]
	  ,obj=this==(function(){return this})()?{}:this
	    //Use a constructor if provided
	    ?interfaceDescriptor.constructor?interfaceDescriptor.constructor(instanceClosures,args,interfaceClosures[target]):{}
	    :this
	if (!interfaceDescriptor) {
		throw "Interface "+target+" not found."
	}
	var superInterfaces = interfaceDescriptor.inherits
	if (superInterfaces) for (var i=0;i<superInterfaces.length;i++) {
		ApplyInterface(system,superInterfaces[i],interfaces,interfaceClosures,instanceClosures,args)
	}
	var hooks = interfaceDescriptor.hooks
	if (hooks && hooks.preInit ) {
		interfaceDescriptor.hooks.preInit(obj,instanceClosures,args,interfaceClosures[target])
	}
	var properties = interfaceDescriptor.properties
	if(properties) for (var property in properties) {
		var value = properties[property]
		if (value instanceof Function) {
			value = value(obj,instanceClosures,args,interfaceClosures[target])
		}
		if (value.value || value['set'] || value['get']) {
		  Object.defineProperty(obj,property,value)
		}
		else {
		  obj[property] = value
		}
	}
	if (hooks && hooks.postInit ) {
		interfaceDescriptor.hooks.postInit(obj,instanceClosures,args,interfaceClosures[target])
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
	var interfaces = {}
	  , systemClosures = {}
	  , $global =(function(){return this})()
	  , $this = this==$global?function(supersystem,interfaces,closures,inherit) {
			layers.forEach(function (layer,index) {
				layer.apply(supersystem,arguments)
			})
		}:this
	  , $prototypes={}
	  , $interfaceClosures = {/*'',{}*/}
	var inherit = function(interfaceName,instanceClosure,args) {
		if(!args) return
		return ApplyInterface.call(this,$this,interfaceName,interfaces,$interfaceClosures,instanceClosure,args)
	}
	//safe due to not having a closure reference
	Object.defineProperty($this,'create',{'get':function(){return function(target) {
		return inherit.call(this,target,{},Array.prototype.slice.call(arguments,1));
	}}})
	Object.defineProperty($this,'getConstructorOf',{'get':function(){return function(target) {
		var constructor = $prototypes[target]
		if(constructor) return constructor
		constructor = $prototypes[target] = function constructor(){
			if(constructor.caller===addProto) return
			var obj=this==(function(){return this})()?{}:this
			$this.create.apply(obj,[target].concat(Array.prototype.slice.call(arguments)))
			return obj
		}
		constructor.name = target
		return constructor
	}}})
	layers.forEach(function (layer,index) {
		layer.call($this,$this,interfaces,systemClosures,inherit)
	})
	return $this;
}

//node support
if (module && module.exports) {
	module.exports = {
	  'System':System
	}
}
