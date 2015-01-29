define( "ModalView" , [ "Base" , "Template" , "Ajax" , "EventBind" ] , function( Base , Template , Ajax , EventBind ){
	var ModalView = Base.extend( function( id , $dom , initFunc , prototype , opt ){
		this._modalViewConfig = $.extend( {
			id 			: id ,
			$self 		: $dom , 
			initFunc 	: initFunc ,
			prototype 	: $.extend( {} , prototype ) ,
			viewEvents 	: {}
		} , this.__modalViewConfig.globalConifg , opt );
		Ajax.call( this );
		EventBind.call( this );
		Template.call( this );
		this.__modalViewConfig.modalViewItems[ id ] = this;
	} , {
		implements 		: [ new Ajax() , new EventBind() , new Template() ],
		__modalViewConfig 	: {
			globalConifg 	: {} ,
			modalViewItems 	: {}
		} ,
		addModalEvent: function( events ){
			if ( typeof events === "object" ) {
				$.extend( this , events );
			}
			return this;
		} ,
		addViewEvent: function( methods ){
			if ( typeof methods === "object" ) {
				this.addEventBindItems( methods , this._modalViewConfig.$self );
				$.extend( this._modalViewConfig.viewEvents , methods );
			}
			return this;
		} ,
		/*!
		 * 	getPrototypeVal 的简写
		 */
		get 			: function(){
			return this.getPrototypeVal.apply( this , arguments );
		} ,
		/*!
		 *	设置自定义属性值
		 * 	@key 	{string} 		支持user.friends.name
		 */
		getPrototypeVal : function( key ){
			var _key,
				_rtn 	= this._modalViewConfig.prototype;
			if ( key ) {
				_key = key.split( "." );
				for( var i = 0 , len = _key.length; i < len ; i++ ){
					_rtn = _rtn[ _key[ i ] ];
					if ( !_rtn ) { break; }
				}
			}
			return _rtn;
		} ,
		/*!
		 * 	setPrototype 的简写
		 */
		set 			: function(){
			return this.setPrototypeVal.apply( this , arguments );
		} ,
		/*!
		 *	设置自定义属性值
		 * 	@key 	{string}
		 * 	@val 	{}
		 */
		setPrototypeVal : function( key , val ){
			var _json = {};
			if ( typeof key == "string" ) {
				_json[ key ] = val; 
			} else {
				_json = key;
			}
			$.extend( this._modalViewConfig.prototype , _json );
			return this;
		} ,
		init 			: function(){
			this._modalViewConfig.initFunc.call( this );
			return this;
		}
	} );

	return ModalView;
} );