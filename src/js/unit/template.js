define( "Template" , [ "Base" ] , function( Base ){
    /*!
     *  要求获取的tagName索引
     *  默认为kulor-template
     */
    var Template = Base.extend( function(){
        if( $.isEmptyObject( this.__Template ) ){
            this.getTemplateSources();    
        }
    } , {
        __templateConfig    : {
            ruleTagName     : "kulor-template" 
        },
        __Template  : {} ,
        /*!
         *  简写getTemplate方法
         */
        get         : function(){
            return this.getTemplate.apply( this , arguments );
        } ,
        /*! 
         *  根据json 拼接html
         *  @json   {object}    待输入的json数据
         *  @id     {string}    模板名称
         *  return  {htmlString}
         */
        getTemplate : function( json , id ){
            if( !id ){
                id = json;
                json = {};
            } else if( !json ){
                return this;
            }
            if( !this.__Template[ id ] ){
                this.getTemplateSources();
            }
            if( this.__Template[ id ] ){
                if( !this.__Template[ id ].handleBar ){
                    this.__Template[ id ].handleBar = HandleBars.compile( this.__Template[ id ].TemplateContent );
                }
                return this.__Template[ id ].handleBar( json );
            }
            return this;
        } , 
        /*!
         *  重新录入template模板资源
         */
        getTemplateSources : function(){
            var _self = this;
            $( "script[type='text/" + _self.__templateConfig.ruleTagName + "']" ).each( function(){
                _self.__Template[ this.id ] = {
                        id              : this.id ,
                        TemplateContent : this.innerHTML ,
                        handleBar       : false
                    }; 
            } );
            return _self;
        } ,
        /*!
         *  重置模板的内容
         */
        resetTemplateContent : function( id , content ){
            if( typeof id == "string" && typeof content == "string" ){
                this.__Template[ id ] = {
                        id              : id ,
                        TemplateContent : content ,
                        handleBar       : false
                    };
            }
            return this;
        } ,
        /*!
         *  获取所有的模板信息
         */
        getTemplateIdList : function( id ){
            return id ? this.__Template[ id ] : this.__Template;
        } ,
        /*!
         *  设置模板的type 索引名称 
         *  一旦设置了tagName 后续获取template的索引为script(type="text/tagName")
         *  @tagName    {string}
         */
        setTemplateRuleTagName : function( tagName ){
            if( typeof tagName == "string" ){
                this.__templateConfig.ruleTagName = tagName;
            }
            return this;
        }
    } ) ,
    HandleBars  = window.Handlebars || (function(){
        var HandleBar = Base.extend( function( html ){
            var _self           = this;
            this.htmlString     = html;
            this.htmlArray      = this.splitHtmlToArray( html );
        } , {
            /*!
             *  获取一个obj下的任意字段值
             *  @key    {string}
             *  @json   {json}
             *  return  {string}
             */
            getValue : function( key , json ){
                var _keys   = key.split( "." ),
                    _rtn    = json;
                for( var i = 0 , len = _keys.length; i < len; i++ ){
                    _rtn = _rtn[ _keys[ i ] ];
                }
                return _rtn;
            },
            /*!
             *  组装一个模板html
             *  @json   {object}
             *  @array  {array}
             *  return  {string}
             */
            makeUpHtml : function( json , array ){
                var _al         = [],
                    _self       = this,
                    _json       = $.isArray( json ) ? json : [ json ],
                    _rtn        = [],
                    _x          = function( json ){
                        _al.length = 0;
                        for( var i = 0 , len = array.length; i < len; i++ ){
                            if( i % 2 ){
                                if( typeof array[ i ] == "object" ){
                                    if( !json[ array[ i ].key ] ){
                                        w( "error variate : " + array[ i ].key );
                                    } else {
                                        _al.push( _self.makeUpHtml.call( _self , json[ array[ i ].key ] , array[ i ].list ) );
                                    }
                                } else if( array[ i ] == "*" ){
                                    _al.push( json );
                                } else {
                                    _al.push( _self.getValue( array[ i ] , json ) );
                                }
                            } else {
                                _al.push( array[ i ] );
                            }
                        }
                        return _al.join( "" );
                    };

                for( var i = 0 , len = _json.length; i < len; i++ ){
                    _rtn.push( _x( _json[ i ] ) );
                }
                return _rtn.join( "" );
            },
            /*!
             *  拆分一个html字符串 为数组 返回一个已表示层级结构的数组
             *  @htmlStr    {string}
             *  return  {array}
             */
            splitHtmlToArray : function( htmlStr ){
                var _sp     = "=*&%*=" ,
                    _al     = htmlStr.replace( /\{{2}([^\}|^\{]*)\}{2}/gi , _sp + "$1" + _sp ).split( _sp ),
                    _i      = 0,
                    _len    = _al.length,
                    _x      = function(){
                        var _rtn = [];
                        for( ;_i < _len; _i++ ){
                            _al[ _i ].replace( /([\/|\#])list/gi , "$1each" );
                            if( /\/each/.test( _al[ _i ] ) ){
                                return _rtn;
                            } else if( /\#each/.test( _al[ _i ] ) ){
                                _rtn.push( { key : _al[ _i++ ].replace( /\#each[ ]+/ , "" ) , list : _x() } );
                            } else {
                                _rtn.push( _al[ _i ] );
                            }
                        }
                        return _rtn;
                    };
                return _x();
            }
        } );
        return {
            compile     : function( htmlString ){
                var _handleBar = new HandleBar( htmlString );
                return function( json ){
                    return _handleBar.makeUpHtml( json , _handleBar.htmlArray )
                }
            }
        }
    })();
    return Template;
} );