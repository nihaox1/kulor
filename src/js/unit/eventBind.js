define( "EventBind" , [ "Base" ] , function( Base ){
	/*!
	 *	用于序列化 jq事件的简写
	 * 	eg 	: ".btn , a , input::click hover blur"
	 * 	@events 	{obj}
	 * 	@$dom 		{JQDOM} 	代理的$dom
	 */
	var EventBind = Base.extend( function( events , $dom ){
		this._eventBindLists = $.extend( {} , events );
		this.addEventBindItems( this._events , $dom );
	} , {
		/*!
		 *	新增一个事件绑定项
		 * 	@event 		{object}
		 * 	@$dom 		{JQDOM} 	代理的$dom
		 * 	@funcBody 	{json} 		代理的方法集合 默认为this
		 */
		addEventBindItems 	: function( events , $dom , funcBody ){
			var _key;
			if ( typeof events != "object" ) { return this; }
			$.extend( this._eventBindLists , events );
			$dom = $dom || $( document.body );
			for( var a in events ){
				_key = a.split( "::" );
				$dom.on( _key[ 1 ] , _key[ 0 ] , typeof events[ a ] == "function" ? events[ a ] :
							( funcBody || this )[ events[ a ] ] );
			}
			return this;
		}
	} );

	return EventBind;
} );