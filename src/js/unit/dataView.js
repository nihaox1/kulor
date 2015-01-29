define( "DataView" , [ "Base" , "Template" , "EventBind" ] , function( Base , Template , EventBind ){
	/*!
	 *	 定义一个 数据和视图层 关联类
	 *	 @templateId 	{string} 	模版的id
	 *	 @json 			{obj} 		存储的数据
	 * 	 @events 		{obj} 		定义事件相关		
	 */
	var DataView = Base.extend( function( templateId , json , events ){
		if ( !templateId || typeof templateId != "string" ) { return }
		this._dataViewConfig = {
			dataViewId 		: new Date().getTime() + Math.ceil( Math.random() * 100000000 ) ,
			templateId 		: templateId ,
			$content 		: false ,
			events 			: events ,
			innerVals 		: $.extend( {} , typeof json == "object" ? json : {} )
		}
	} , {
		extend 		: Template ,
		implements 	: [ new EventBind() ] ,
		__dataViewConfig 	: {

		} , 
		/*!
		 *	setDataView 简写 
		 * 	方便继承类进行重写
		 */
		set 			: function(){
			return this.setDataView.apply( this , arguments );
		},
		getDataModal 	: function(){
			if ( !this._dataViewConfig.$content || !this._dataViewConfig.$content.parent.length ) {
				this._dataViewConfig.$content = $( this.getTemplate( this._dataViewConfig.innerVals , this._dataViewConfig.templateId ) );
				this._dataViewConfig.$content.attr( "dataViewId" , this._dataViewConfig.dataViewId );
				this.addEventBindItems( this._dataViewConfig.events , this._dataViewConfig.$content );
			};
			return this._dataViewConfig.$content;
		},
		/*!
		 *	设置数据
		 */
		setDataView 	: function( key , val ){
			var _json = {};
			if ( typeof key == "string" ) {
				_json[ key ] = val;
			} else if( typeof key === "object" ){
				_json = $.extend( _json , key );
			}
			if ( !$.isEmptyObject( _json ) ) {
				return this.refreshDataView( $.extend( {} , this._dataViewConfig.innerVals , _json ) );
			}
			return this;
		} ,
		/*!
		 *	刷新数据展现
		 * 	@json 	{json} 	整体待替换的数据层
		 */
		refreshDataView : function( json ){
			var _$parent ,
				_content ,
				_className;
			if ( json !== this._dataViewConfig.innerVals ) {
				this._dataViewConfig.innerVals = json;
				if ( this._dataViewConfig.$content ) {
					_$parent = this._dataViewConfig.$content.parent();
					if ( _$parent.length ) {
						_content = this._dataViewConfig.$content[ 0 ];
						_content.outerHTML = this.getTemplate( json , this._dataViewConfig.templateId ).replace( /(<\w*)/ , "$1 dataViewId='" + this._dataViewConfig.dataViewId + "'" );
						this._dataViewConfig.$content = _$parent.find( _content.tagName + "[dataViewId='" + this._dataViewConfig.dataViewId + "']" );
						this.addEventBindItems( this._dataViewConfig.events , this._dataViewConfig.$content );
					}
				}
			}
			return this;
		}
	} );

	return DataView;
} );