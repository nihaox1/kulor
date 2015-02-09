define( "Validate" , [ "Base" ] , function( Base ){
    /*!
     *  验证插件
     */
    var Validate = Base.extend( function(){
        this._validateConfig = { rules : {} };
    } , {
        __validateConfig      : {
            rules           : {} ,
            verifyItems     : {}
        } ,
        /*!
         *  验证一个表单
         *  @id     {string}    表单的id  对应addVerifyItem  id
         *  @opt    {bool|object}
         *      forceEnd        {bool} 是否执行到最后
         *      handleCallback  {bool} 是否执行之前定义的回调函数
         */
        validateStatus    : function( id , opt ){
            var _rtn = [],
                _input ,
                _verify ,
                _inputRule;
            opt     = typeof opt == "object" ? opt : {};
            if ( _inputRule = this.__validateConfig.verifyItems[ id ] ) {
                for ( var a in _inputRule.inputRules ) {
                    _input  = _inputRule.inputRules[ a ];
                    _verify = this.handleVerifyItem( _input );
                    if ( opt.handleCallback ) {                        
                        _inputRule.callbackFunc( _input.$input , _verify , _input.content , _input );
                    }
                    if ( !opt.forceEnd && !_verify ) {
                        return false;
                    }  else if( !_verify ) {
                        _rtn.push( _input );
                    }
                }
            }
            return opt.forceEnd && _rtn.length ? _rtn : true;
        } ,
        /*!
         *  执行验证规则
         *  @ruleInput  {object}    待验证的ruleInput值
         *  @forceEnd   {bool}      验证完全所有的规则
         */
        handleVerifyItem  : function( ruleInput , forceEnd ){
            var _rtn = {},
                _rule,
                _val = ruleInput.$input.val();
            for( var i = ruleInput.rules.length; i--; ){
                _rule = this._validateConfig.rules[ ruleInput.rules[ i ].ruleName ] || this.__validateConfig.rules[ ruleInput.rules[ i ].ruleName ];
                if ( _rule ) {
                    if ( !_rule( _val , ruleInput.rules[ i ].param , ruleInput ) ) {
                        if ( !forceEnd ) {
                            return false;
                        } else {
                            _rtn[ ruleInput.rules[ i ].ruleName ] = false;
                        }
                    }
                }
            }
            return forceEnd ? _rtn : true;
        } ,
        /*!
         *  添加一个验证模块
         *  @id         {string}        验证模块id
         *  @$form      {jQueryDom}     
         *  @rules      {opt}
         *  @func       {function}      回调方法
         */
        addVerifyItem     : function( id , $form , rules , func ){
            var _self = this;
            if ( $.isFunction( func ) ) {
                this.__validateConfig.verifyItems[ id ] = {
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
                                content : _input[ 1 ] || "",
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
                                _rule.push( {
                                    ruleName    : _input.rules[ i ][ 0 ] ,
                                    param       : JSON.parse( "[" + _input.rules[ i ][ 1 ] )
                                } );
                            } else {
                                _rule.push( {
                                    ruleName    : _input.rules
                                } );
                            }
                        }
                        _input.rules = _rule;
                        rules[ this.name ] = _input;

                        _input.$input.blur( function(){
                            func( _input.$input , _self.handleVerifyItem( _input ) , _input.content , _input );
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
            $.extend( this[ isGlobal ? "__validateConfig" : "_validateConfig" ].rules , _inputs );
            return this;
        }
    } );

    /*!
     *  新增默认的验证类型
     */
    new Validate().addRules( {
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
                                _len > array[ 1 ] ? false : true;
            } else {
                return false;
            }
        } ,
        isNumber  : function( str ){
            return /^\d+$/.test( str );
        }
    } , true );

    return Validate;
} );