define( "EventBind" , [ "Base" ] , function( Base ){
	/*!
	 *	用于序列化 jq事件的简写
	 * 	eg 	: ".btn , a , input::click hover blur"
	 * 	@events 	{obj}
	 * 	@$dom 		{JQDOM} 	代理的$dom
	 */
	var EventBind = Base.extend( function( events , $dom , funcBody ){
		this._eventBindLists = $.extend( {
			beforeEventBinds 	: [],
			afterEventBinds 	: []
		} , events );
		this.addEventBindItems( events , $dom , funcBody );
	} , {
		/*!
		 *	新增一个事件绑定项
		 * 	@event 		{object}
		 * 	@$dom 		{JQDOM} 	代理的$dom
		 * 	@funcBody 	{json} 		代理的方法集合 默认为this
		 */
		addEventBindItems 	: function( events , $dom , funcBody ){
			var _key,
				_self 	= this;
			if ( typeof events != "object" ) { return this; }
			$.extend( this._eventBindLists , events );
			$dom = $dom || $( document.body );
			funcBody 	= typeof funcBody == "object" ? funcBody : { empty : true };
			if( typeof funcBody.beforeEventBind === "function" ) {
				this._eventBindLists.beforeEventBinds.push( funcBody.beforeEventBind );
			}
			if( typeof funcBody.afterEventBind === "function" ) {
				this._eventBindLists.afterEventBinds.push( funcBody.afterEventBind );
			}
			if ( funcBody.empty ) { funcBody = null; }
			for( var a in events ){
				_key = a.split( "::" );
				( function( ev , $m , funcName ){
					var func = typeof funcName == "function" ? funcName : ( funcBody || _self )[ funcName ];
					$dom.on( ev , $m , function(){
						var _go = true ,
							i , len;
						for( i = 0 , len = _self._eventBindLists.beforeEventBinds.length; i < len; i++ ){
							if( _self._eventBindLists.beforeEventBinds[ i ].call( this , _self ) === false ){
								_go = false;
								break;
							}
						}
						if( _go ) {
							func = func || ( funcBody || _self )[ funcName ];
							func.call( this , _self );
							for( i = 0 , len = _self._eventBindLists.afterEventBinds.length; i < len; i++ ){
								_self._eventBindLists.afterEventBinds[ i ].call( this , _self );
							}
						}
						return _go;
					} );
				} )( _key[ 1 ] , _key[ 0 ] , events[ a ] );
			}
			return this;
		} ,
		addBeforeEventBind 	: function( func ){
			this._eventBindLists.beforeEventBinds.push( func );
			return this;
		} ,
		addAfterEventBind 	: function( func ){
			this._eventBindLists.afterEventBinds.push( func );
			return this;
		} ,
	} );

	return EventBind;
} );