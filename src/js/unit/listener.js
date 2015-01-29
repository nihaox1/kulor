define( "Listener" , [ "Base" ] , function( Base ){
	/*!
	 *	增加一个事件的反向监听
	 */
	var Listener = Base.extend( function( id , opt ){
		this._listenerConfig = $.extend( {
			id 			: typeof id == "string" ? id : new Date().getTime() + Math.Random() * 100000 ,
			eventItems 	: []
		} , $.isPlainObject( opt ) ? opt : {} );
		this.__listenerConfig.listenerItems[ this._listenerConfig.id ] = this;
	} , {
		__listenerConfig : {
			listenerItems 	: {}
		},
		/*!
		 *	根据id找到一个listener
		 */
		findListener 	: function( id ){
			return this.__listenerConfig.listenerItems[ id ];
		} ,
		/*!
		 *	增加一个监听事件
		 * 	@func 	{function}
		 */
		addEventListener : function( func ){
			if ( $.isFunction( func ) ) {
				this._listenerConfig.eventItems.push( func );
			}
			return this;
		} ,
		/*!
		 *	移除一个监听事件
		 * 	@index 	{int}
		 */
		removeEventListener : function( index ){
			if ( $.isNumeric( index ) ) {
				this._listenerConfig.eventItems.splice( index , 1 );
			} else if( index === undefined ){
				this._listenerConfig.eventItems.length = 0;
			}
			return this;
		} ,
		/*!
 		 *	发布订阅消息
 		 */
		postListenerMsg : function(){
			for( var i = 0 , len = this._listenerConfig.eventItems.length; i < len; i++ ){
				this._listenerConfig.eventItems[ i ].apply( this , arguments );
			}
			return this;
		}
	} );
	return Listener;
} );