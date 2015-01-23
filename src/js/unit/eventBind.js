define( "EventBind" , [ "Base" ] , function( Base ){
	/*!
	 *	用于序列化 jq事件的简写
	 * 	eg 	: ".btn , a , input::click hover blur"
	 * 	@events 	{obj}
	 * 	@$dom 		{JQDOM} 	代理的$dom
	 */
	var EventBind = Base.extend( function( events , $dom ){
		this._events = $.extend( {} , events );
		this.addEventBindItems( this._events , $dom );
	} , {
		/*!
		 *	新增一个事件绑定项
		 * 	@event 	{object}
		 * 	@$dom 	{JQDOM} 	代理的$dom
		 */
		addEventBindItems 	: function( events , $dom ){
			var _key;
			if ( typeof events != "object" ) { return this; }
			$dom = $dom || $( document.body );
			for( var a in events ){
				_key = a.split( "::" );
				$dom.on( _key[ 1 ] , _key[ 0 ] , events[ a ] );
			}
			return this;
		}
	} );

	return EventBind;
} );