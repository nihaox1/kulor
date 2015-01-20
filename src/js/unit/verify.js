define( "Verify" , [ "Base" ] , function( Base ){
    /*!
     *  验证插件
     */
    var Verify = Base.extend( function(){
        this._verifyConfig = { rules : {} };
    } , {
        __verifyConfig      : {
            rules           : {} ,
            verifyItems     : {}
        } ,
        /*!
         *  添加一个验证模块
         *  @id         {string}        验证模块id
         *  @$form      {jQueryDom}     
         *  @rules      {opt}
         *  @func       {function}      回调方法
         */
        addVerifyItem     : function( id , $form , rules , func ){
            if ( $.isFunction( func ) ) {
                this.__verifyConfig.verifyItems[ id ] = {
                    __id        : id ,
                    __$form     : $form ,
                    inputRules  : rules ,
                    callbackFunc: func
                }
                $form.find( ":input " ).each( function(){
                    var _input  = rules[ this.name ],
                        _rule   = [];
                    if( _input ){
                        if ( typeof _input === "string" ) {
                            _input = {
                                rules   : _input
                            };
                        } else if( _input instanceof Array ){
                            _input = {
                                rules   : _input[ 0 ] ,
                                content : _input[ 1 ] ,
                                param   : _input[ 2 ]
                            };
                        }
                        _input.$input = $( this );
                        _input.rules = _input.rules.replace( /^\s+/, "" )
                                        .replace( /\s+$/, "" )
                                        .replace( /\s+/gi , " " )
                                        .replace( /\[\s*([^\W]*)\s*\,\s*([^\W]*)\s*\]/gi , "[$1,$2]" )
                                        .split( " " );
                        for( var i = _input.rules.length; i--; ){
                            if ( /.+\[.+\]/.test( _input.rules[ i ] ) ) {
                                _input.rules[ i ] = _input.rules[ i ].split( "[" );
                                _rule[ _input.rules[ 0 ] ] = {
                                    ruleName    : _input.rules[ i ][ 0 ] ,
                                    param       : eval( "[" + _input.rules[ i ][ 1 ] )
                                }
                            } else {
                                _rule.push( {
                                    ruleName    : _input.rules
                                } );
                            }
                        }
                        _input.rules = _rule;
                        rules[ this.name ] = _input;

                        _input.$input.blur( function(){

                        } );
                    }
                } );
            }
            return this;
        },
        /*!
         *  新增验证规则
         *  @ruleName       {string|object}
         *  @ruleFunc       {function}  要求返还bool值
         *  @isGlobal       {bool}      是否设置为全局的验证规则
         */
        addRules    : function( ruleName , ruleFunc , isGlobal ){
            var _inputs = {};
            if ( typeof ruleName == "string" && $.isFunction( ruleFunc ) ) {
                _inputs[ ruleName ] = ruleFunc;
            } else if( typeof ruleName === "object"  ){
                _inputs = ruleName;
                isGlobal = ruleFunc;
            }
            $.extend( this[ isGlobal ? "__verifyConfig" : "_verifyConfig" ].rules , _inputs );
            return this;
        }
    } );
    new Verify().addRules( {
        email   : function( str , opt ){
            return /.+\@.+\..+/.test( str );
        } , 
        length  : function( str , array ){
            var _len;
            if ( str ) {
                array = array instanceof Array ? array : [ 0 ];
                _len = $.trim( str ).length;
                return _len < array[ 0 ] ? false :
                            !array[ 1 ] ? true :
                                _len > array[ 1 ];
            } else {
                return false;
            }
        } ,
        isNumber  : function( str ){
            return /^\d+$/.test( str );
        }
    } , true );
    return Verify;
} );