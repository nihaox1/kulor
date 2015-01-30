define( "Template" , [ "Class" ] , function( require ){
    var tool,
        Class       = new ( require( "Class" ) )(),
        w           = function( x ){ try{ console.error( x ); } catch( e ){}; },
        Template    = Class.create( function(){

        } , {
            extend      : Class,
            htmls       : {},
            /*!
             *  根据id 获取html资源
             *  @id     {string}
             *  @getAll {bool}      获取包括信息状态的模板信息
             *  return  {string|obj}
             */
            getSource   : function( id , getAll ){
                var _self = this,
                    _rtn;
                _rtn = this.htmls[ id ] || ( function(){
                    $( "script" ).each( function(){
                        var _$this = $( this );
                        if( _$this.attr( "type" ) == "text/vip-template" ){
                            _self.htmls[ _$this.attr( "id" ) ] = { tmpl : _$this.html().replace( /[\s|\n|\r]+/gi , " " ) , array : false };
                        }
                    } );
                    return getAll ? _self.htmls[ id ] : _self.htmls[ id ].tmpl;
                } )();
                return getAll ? _rtn : _rtn.tmpl;
            },
            /*!
             *  根据json 拼接一个html内容
             */
            getHtml     : function( json , id ){
                var _tmpl;
                _tmpl = this.getSource( id , true );
                if( !id && this.isStr( json ) ){ return this.getSource( json ); }
                if( !_tmpl ){
                    return "";
                }
                _tmpl.array = _tmpl.array || tool.splitHtmlToArray.call( this , _tmpl.tmpl );
                return tool.makeUpHtml.call( this , json , _tmpl.array );
            }
        } );

    tool = {
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
                _json       = this.isArray( json ) ? json : [ json ],
                _rtn        = [],
                _x          = function( json ){
                    _al.length = 0;
                    for( var i = 0 , len = array.length; i < len; i++ ){
                        if( i % 2 ){
                            if( _self.isObj( array[ i ] ) ){
                                if( !json[ array[ i ].key ] ){
                                    w( "error variate : " + array[ i ].key );
                                } else {
                                    _al.push( tool.makeUpHtml.call( _self , json[ array[ i ].key ] , array[ i ].list ) );
                                }
                                
                            } else {
                                _al.push( tool.getValue( array[ i ] , json ) );
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
            var _sp     = "=*&%*=";
                _al     = htmlStr.replace( /\$\(([\w|\:|.]*)\)/gi , _sp + "$1" + _sp ).split( _sp ),
                _i      = 0,
                _len    = _al.length,
                _x      = function(){
                    var _rtn = [];
                    for( ;_i < _len; _i++ ){
                        if( /list\:end/.test( _al[ _i ] ) ){
                            return _rtn;
                        } else if( /list\:/.test( _al[ _i ] ) ){
                            _rtn.push( { key : _al[ _i++ ].replace( /list\:/ , "" ) , list : _x() } );
                        } else {
                            _rtn.push( _al[ _i ] );
                        }
                    }
                    return _rtn;
                };
            return _x();
        }
    };

    return Template;
} );