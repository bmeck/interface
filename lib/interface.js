var sys = require('sys')

//Utility for closures / interfaces
//Cannot be part of System due to possible abuse from outside
var $global = (function(){return this})()
function ApplyInterface(system,target,interfaces,interfaceClosures,instanceClosures,args) {
	var interfaceDescriptor = interfaces[target]
	  ,obj=this==$global?{}:this
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
		var preHooks = hooks.preInit
		if(Array.isArray(preHooks)) for(var i=0;i<preHooks.length;i++) {
		  preHooks[i](obj,instanceClosures,args,interfaceClosures[target])
		}
		else {
		  preHooks(obj,instanceClosures,args,interfaceClosures[target])
		}
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
		var postHooks = hooks.postInit
		if(Array.isArray(postHooks)) for(var i=0;i<postHooks.length;i++) {
		  postHooks[i](obj,instanceClosures,args,interfaceClosures[target])
		}
		else {
		  postHooks(obj,instanceClosures,args,interfaceClosures[target])
		}
	}
	var proto = system.getConstructorOf(target)
	addProto(obj,proto)
	return obj
}

function addProto(obj,proto) {
	if(obj instanceof proto) { return obj }
	if({}.__proto__) {
		proto.prototype = obj.__proto__
		//sys.puts(sys.inpsect(proto.prototype))
		obj.__proto__ = new proto
	}
	//for IE (works on any user made object...going to blow up on Natives...)
	else {
		proto.prototype = obj.prototype
		obj.prototype = new proto
	}
	return obj
}
function System(layers) {
	var interfaces = {}
	  , systemClosures = {}
	  , $this=this==$global?function(supersystem,interfaces,closures,inherit) {
	      for(var i=0;i<layers.length;i++)
		   layers[i].apply(supersystem,arguments)
		}:this
	  , $prototypes={}
	  , $interfaceClosures = {/*'',{}*/}
	//1 per system
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
			var obj=this==$global?{}:this
			$this.create.apply(obj,[target].concat(Array.prototype.slice.call(arguments)))
			return obj
		}
		constructor.name = target
		return constructor
	}}})
	for(var i=0;i<layers.length;i++)
	  layers[i].call($this,$this,interfaces,systemClosures,inherit)
	return $this;
}

//node support
if (module && module.exports) {
	module.exports = {
	  'System':System
	}
}
