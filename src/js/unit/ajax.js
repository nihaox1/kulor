define( "Ajax" , [ "Base" ] , function( Base ){
    /*!
     *  封装一个ajax请求
     */
    var Ajax = Base.extend( function( opt ){
        this._ajaxConfig = {
            successList     : [] ,
            errorList       : [] ,
            failList        : [] ,
            beforeList      : [] ,
            defaultConfig   : {
                headers     : {}
            }
        };
        if ( opt ) {
            if ( opt.before ) {
                this._ajaxConfig.beforeList = [ opt.before ];
            }
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
        this.pipeList = {};
    } , {
        getUniqueId     : function(){
            return new Date().getTime() + "" + Math.ceil( Math.random() * 1000000 );
        } ,
        __ajaxConfig : {
            beforeList      : [],
            failList        : [],
            errorList       : [],
            successList     : [],
            defaultConfig   : {
                timeout     : 20000 ,
                submitUrl   : false ,
                headers     : {}
            }
        } ,
        /*!
         *  设置ajax的配置
         *  @opt    {object}
         *      beforeList      {function|array}    发送前的预操作
         *      successList     {function|array}
         *      errorList       {function|array}
         *      failList        {function|array}
         *      timeout         {int}
         *      submitUrl       {string}    设置源地址，设置此地址后，后续请求如果不写url将默认指向这里
         *  @isGlobal   {bool}  是否放置于全局配置中
         */
        setAjaxConfig      : function( opt , isGlobal ){
            var _config     = this[ isGlobal ? "__ajaxConfig" : "_ajaxConfig" ] ,
                _listHash   = [ "successList" , "beforeList" , "errorList" , "failList" ];

            for( var i = _listHash.length; i--; ){
                if( opt[ _listHash[ i ] ] ){
                    opt[ _listHash[ i ] ] = $.isFunction( opt[ _listHash[ i ] ] ) ? [ opt[ _listHash[ i ] ] ] : opt[ _listHash[ i ] ];
                }
                _config[ _listHash[ i ] ] = _config[ _listHash[ i ] ].concat( opt[ _listHash[ i ] ] || [] );
                delete opt[ _listHash[ i ] ];
            }
            if ( typeof opt.headers == "object" ) {
                $.extend( _config.defaultConfig.headers , opt.headers );
            }
            delete opt.headers;
            if ( isGlobal ) {
                $.extend( this.__ajaxConfig.defaultConfig , opt );
            } else {
                $.extend( this._ajaxConfig , opt );
            };
            return this;
        },
        ajax        : function( opt ){
            var _self       = this,
                _before     = this.__ajaxConfig.beforeList.concat( this._ajaxConfig.beforeList );
            opt.dataType = opt.dataType || "json";
            if ( typeof opt.data === "function" ) {
                opt.successCall = opt.data;
                delete opt.data;
            }
            for( var i = _before.length; i--; ){
                if( $.isFunction( _before[ i ] ) && _before[ i ].call( opt ) === false ){
                    return this;
                }
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
            opt.beforSend   = function( xhr ){
                var _header     = $.extend( {} , _self.__ajaxConfig.defaultConfig.headers , _self._ajaxConfig.defaultConfig.headers );
                for( var a in _header ){
                    xhr[ a ] = _header[ a ];
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
        post        : function(){
            return this.ajaxSendPost.apply( this , arguments );
        } ,
        get         : function(){
            return this.ajaxSendGet.apply( this , arguments );            
        } , 
        ajaxSendPost: function( url , data , func ){
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
        ajaxSendGet : function( url , data , func ){
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
        ajaxSendJsonp   : function( url , data , func ){
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
        } ,
        /*!
         *  jsonp请求
         */
        jsonp       : function(){
            return this.ajaxSendJsonp.apply( this , arguments );
        } ,
        /*!
         *  管道 用于设置多个 ajax同时回调的操作处理
         */
        pipe        : function( url , data , type ){
            var _self   = this,
                _type   = type ? type.toString().toLocaleString() : "post",
                _opt;
                
            _opt = {
                url     : url,
                data    : data,
                type    : type && { get : 1 , post : 1 }[ _type ]? type : "post",
                rtnVal  : false,
                pipeId  : false,
                pos     : 0 
            };
            if( type === "jsonp" ){
                _opt.dataType = "jsonp";
            }
            if( !this.isPipe ){
                this.isPipe = this.getUniqueId();
                this.pipeList[ this.isPipe ] = [ _opt ];
                this.pipeList[ this.isPipe ].complatedCount = 0;
            } else {
                this.pipeList[ this.isPipe ].push( _opt );
            }
            _opt.pipeId = this.isPipe;
            _opt.pos    = this.pipeList[ this.isPipe ].length - 1;
            _opt.successCall = function( rtn ){
                _self.pipeList[ this.pipeId ][ this.pos ].rtnVal = rtn;
                if( ++_self.pipeList[ this.pipeId ].complatedCount == _self.pipeList[ this.pipeId ].length ){
                    _self.pipeList[ this.pipeId ].handleComplated.apply( _self , ( function( vals ){
                        var _rtns   = [];
                        for( var i = 0 , len = vals.length; i <len; i++ ){
                            _rtns.push( vals[ i ].rtnVal );
                        }
                        return _rtns;
                    } )( _self.pipeList[ this.pipeId ] ).concat( [ _self.pipeList[ this.pipeId ] ] ) );
                }
            };
            this.ajax( _opt );
            return this;
        },
        /*!
         *  管道设置完毕后 要求执行的函数内容
         *  @func   {func}  回调事件
         *      argument   : {array}   对应pipe位置的数组
         */
        then        : function( func ){
            this.pipeList[ this.isPipe ].handleComplated = func;
            this.isPipe = false;
            return this;
        }
    } );
    return Ajax;
} );