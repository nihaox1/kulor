define( "Ajax" , [ "Base" ] , function( Base ){
    /*!
     *  封装一个ajax请求
     */
    var Ajax = Base.extend( function( opt ){
        this._ajaxConfig = {
            successList     : [] ,
            errorList       : [] ,
            failList        : []
        };
        if ( opt ) {
            if ( opt.success ) {
                this._ajaxConfig.successList = [ opt.success ];
            }
            if ( opt.error ) {
                this._ajaxConfig.errorList = [ opt.error ];
            }
            if ( opt.fail ) {
                this._ajaxConfig.failList = [ opt.fail ];
            }
        }
    } , {
        __ajaxConfig : {
            failList        : [],
            successList     : [],
            defaultConfig   : {
                timeout     : 5000 ,
                submitUrl   : false
            }
        } ,
        /*!
         *  设置ajax的配置
         *  @opt    {object}
         *      successList     {function|array}
         *      errorList       {function|array}
         *      failList        {function|array}
         *      timeout         {int}
         *      submitUrl       {string}    设置源地址，设置此地址后，后续请求如果不写url将默认指向这里
         *  @isGlobal   {bool}  是否放置于全局配置中
         */
        config      : function( opt , isGlobal ){
            if ( opt.successList ) {
                opt.successList = $.isFunction( opt.successList ) ? [ opt.successList ] : opt.successList;
            }
            if ( opt.failList ) {
                opt.failList = $.isFunction( opt.failList ) ? [ opt.failList ] : opt.failList;
            }
            if ( opt.errorList ) {
                opt.errorList = $.isFunction( opt.errorList ) ? [ opt.errorList ] : opt.errorList;
            }
            if ( isGlobal ) {
                this.__ajaxConfig.successList = this.__ajaxConfig.successList.concat( opt.successList );
                this.__ajaxConfig.errorList = this.__ajaxConfig.errorList.concat( opt.errorList );
                this.__ajaxConfig.failList = this.__ajaxConfig.failList.concat( opt.failList );
            } else {
                this._ajaxConfig.successList = this._ajaxConfig.successList.concat( opt.successList );
                this._ajaxConfig.errorList = this._ajaxConfig.errorList.concat( opt.errorList );
                this._ajaxConfig.failList = this._ajaxConfig.failList.concat( opt.failList );
            }
            delete opt.successList;
            delete opt.errorList;
            delete opt.failList;
            if ( isGlobal ) {
                $.extend( this.__ajaxConfig.defaultConfig , opt );
            } else {
                $.extend( this._ajaxConfig , opt );
            };
            return this;
        },
        ajax        : function( opt ){
            var _self = this;
            opt.dataType = opt.dataType || "json";
            if ( typeof opt.data === "function" ) {
                opt.successCall = opt.data;
                delete opt.data;
            }
            opt.success = function( rtn ){
                for( var i = _self.__ajaxConfig.successList.length; i--; ){
                    if( _self.__ajaxConfig.successList[ i ]( rtn ) === false ){
                        return;
                    }
                }
                for( var i = _self._ajaxConfig.successList.length; i--; ){
                    if( _self._ajaxConfig.successList[ i ]( rtn ) === false ){
                        return;
                    }
                }
                if ( opt.successCall && typeof opt.successCall == "function" ) {
                    opt.successCall( rtn );
                }
            }
            opt.error = function( rtn ){
                for( var i = _self.__ajaxConfig.errorList.length; i--; ){
                    if( _self.__ajaxConfig.errorList[ i ]( rtn ) === false ){
                        return;
                    }
                }
                for( var i = _self._ajaxConfig.errorList.length; i--; ){
                    if( _self._ajaxConfig.errorList[ i ]( rtn ) === false ){
                        return;
                    }
                }
            }
            $.ajax( $.extend( {} , this.__ajaxConfig.defaultConfig , opt ) )
                .fail( function( rtn ){
                    for( var i = _self.__ajaxConfig.failList.length; i--; ){
                        if( _self.__ajaxConfig.failList[ i ]( rtn ) === false ){
                            return;
                        }
                    }
                    for( var i = _self._ajaxConfig.failList.length; i--; ){
                        if( _self._ajaxConfig.failList[ i ]( rtn ) === false ){
                            return;
                        }
                    }
                } );
            return this;
        } ,
        post        : function( url , data , func ){
            if ( typeof url != "string" ) {
                func = data;
                data = url;
                url = this._ajaxConfig.submitUrl || this.__ajaxConfig.defaultConfig.submitUrl;
            }
            return this.ajax( {
                type        : "POST" ,
                url         : url ,
                data        : data , 
                successCall : func
            } );
        } ,
        get         : function( url , data , func ){
            if ( typeof url != "string" ) {
                func = data;
                data = url;
                url = this._ajaxConfig.submitUrl || this.__ajaxConfig.defaultConfig.submitUrl;
            }
            return this.ajax( {
                type        : "GET" ,
                url         : url ,
                data        : data , 
                successCall : func
            } );
        } , 
        /*!
         *  jsonp请求
         */
        jsonp       : function( url , data , func ){
            if ( typeof url != "string" ) {
                func = data;
                data = url;
                url = this._ajaxConfig.submitUrl || this.__ajaxConfig.defaultConfig.submitUrl;
            }
            return this.ajax( {
                type        : "GET" ,
                url         : url ,
                data        : data , 
                dataType    : "jsonp" , 
                successCall : func
            } );
        }
    } );
    return Ajax;
} );