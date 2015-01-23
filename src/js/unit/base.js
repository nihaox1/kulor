define( "Base" , [] , function(){
    var tool = {
        setSingleImplements : function( Base , protos ){
            for( var a in protos ){
                if( a != "__proto__" ){
                    if( Base.prototype[ a ] && typeof protos[ a ] == "object" ){
                        Base.prototype[ a ] = $.extend( {} , Base.prototype[ a ] , protos[ a ] );
                    } else {
                        Base.prototype[ a ] = protos[ a ];
                    }
                }
            }
        },
        setImplements : function( Base , opts ){
            if( opts.implements ){
                for( var a in opts.implements ){
                    tool.setSingleImplements( Base , opts.implements[ a ].__proto__ );
                }
            }
            delete opts.implements;
        }
    };

    return {
        extend  : function( constructor , opts ){
            var Base,
                _extend;
            if( typeof constructor != "function" ){
                return;
            } else {
                if( opts.extend && typeof opts.extend == "function" ){
                    _extend = opts.extend;
                    Base = function(){
                        _extend.apply( this , arguments );
                        constructor.apply( this , arguments );
                    }
                    Base.prototype = Object.prototype.__proto__ ? { __proto__ : _extend.__proto__ } : 
                                    $.isFunction( _extend ) ? new _extend() : _extend;
                    delete opts.extend;
                } else {
                    Base = function(){
                        constructor.apply( this , arguments );
                    }
                }
                Base.prototype.constructor = constructor;
                tool.setImplements( Base , opts );
                tool.setSingleImplements( Base , opts );
                opts = null;
                return Base;
            }
        }
    }
} );