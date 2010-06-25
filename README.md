#Interfaced

    npm install interface

    require('interface')

Interfaced is an idea for System based middleware primarily aimed at client applications and libraries. The concept of a feature stack is applied to interface bundles that may then be used as a 'system'.

    Interface.System([layer,])

Interfaces return a function that can be hooked into other systems, or be made into an instance using .create(params).

    System.create(interfacename,...)

##Layers

Most systems can separate interfaces into smaller subsections that rely on functions of an interface rather than having truly interleaving parts. That is where our layer system comes into play. Layers allow multiple interface features to be built over multiple implementations and/or subsystems seamlessly.

    MyLayer = function(system,interfaces,systemClosures) { return unused; }

__example:__

    layer = function(system,interfaces,systemClosures) { interfaces['myinterface'] = {
         //interface descriptor
    } }

###Interfaces

Interfaces are the publicly visible parts of your system. They can be declared as follows

    interfaces = {
        'myinterface': {
             inherits: [superinterface,]
             properties:
                 {PropertyDescriptorMap}
                 || function(object,instanceClosures,args) {return PropertyDescriptor}
             , hooks: {
                  pre/postInit:function(obj,instanceClosures,args) {}
             }
        }
    }

* args - arguments to System.create(interface,...) that follow the interface name

* preInit - setup of closures and properties not described in the interface descriptor (will be overridden by interface descriptor)
* postInit - final verification of object as needed, time to override interface descriptor properties

###Shared Closures

Shared Closures are the parts of your __Interface's instance__ which need to interact in private so that the exterior system cannot be granted access to them w/o reason.

They are available during the Layer init stage (bound to the System), during Interface contruction (bound to the Object), as properties that are declared as functions returning descriptors, and to hooks (bound to the Object).

