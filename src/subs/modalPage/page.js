define( "Page" , [ "Base" , "Template" , "RequireFile" , "ModalView" ] , function( Base , Template , RequireFile , ModalView ){
	/*!
	 *	富客户端 提供一个page管理
	 * 	@pageListId 	{string} 	自定义一个pageListId
	 */
	var PageList 	= Base.extend( function( pageListId , $pageContainer , opt ){
		this._pageListConfig 	= {
			$container 		: 0 ,
			originOpt 		: $.extend( {} , opt )
		};
		this.length 	= 0;
		if ( $pageContainer.length ) {
			this.initPageContainer( $pageContainer );
		}
		this.addPage( opt );
		this.__pageListConfig.pageItems.push( this );
	} , {
		implements 		: [ new Template() , new RequireFile() ],
		__pageListConfig 	: {
			templateIds : {
				container 	: "pageContainerTemplate"
			} ,
			pageItems 	: []
		} ,
		/*!
		 *	初始化page页面
		 * 	@$container 	{JQDOM}
		 */
		initPageContainer 	: function( $container ){
			this._pageListConfig.$container = $container;
			$container.addClass( "uiSub-page-container" );
			// $container.html( this.getTemplate( this.__pageListConfig.templateIds.container) );
			return this;
		} ,
		addPage 		: function( pages ){
			for( var a in pages ){
				this[ a ] = new Page( this , pages[ a ] , a );
			}
			return this;
		}
	} ) ,
		/*!
		 *	单个page模块
		 */
		Page 	= Base.extend( function( belongPageList , jsPath , pageName ){
			this._pageConfig 	= {
				pageName 	: pageName ,
				$container 	: false ,
				ready 		: false ,
				jsPath 		: jsPath ,
				eventList 	: [] ,
				belongPageList 	: 	belongPageList
			}
			belongPageList.length++;
		} , {
			__pageConfig: {
				templateIds 	: {
					container 	: "subPageContainerTemplate"
				}
			} ,
			display 	: function(){
				return this.displayPageModal.apply( this , arguments );
			} ,
			get 		: function(){
				return this.getPageModal.apply( this , arguments );
			} ,
			ready 		: function(){
				return this.setPageToReady.apply( this , arguments );
			} ,
			displayPageModal	: function( func ){
				var _$container = this._pageConfig.belongPageList._pageListConfig.$container;
				if( !this._pageConfig.$container ){
					this._pageConfig.$container 	= $( this._pageConfig.belongPageList.getTemplate( this.__pageConfig.templateIds.container ) );
					_$container.append( this._pageConfig.$container );
				}
				this.getPageModal( function(){
					_$container.find( ".uiSub-page-singlePage" ).removeClass( "active" );
					this._pageConfig.$container.addClass( "active" );
					if( $.isFunction( func ) ){ func.call( this ); };
				} );
				return this;
			} ,
			handlePageEventList 	: function(){
				for( var i = 0 , len = this._pageConfig.eventList.length; i < len; i++){
					if( $.isFunction( this._pageConfig.eventList[ i ] ) ){
						this._pageConfig.eventList[ i ].call( this );
					}
				}
				this._pageConfig.eventList.length = 0;
				return this;
			} ,
			getPageModal 		: function( func ){
				this._pageConfig.eventList.push( func );
				if ( this._pageConfig.ready == "ready" ) {
					this.handlePageEventList();
				} else if( this._pageConfig.ready != "waiting" ){
					new RequireFile( this._pageConfig.jsPath );
					this._pageConfig.ready = "waiting";
				}
				return this;
			} ,			
			setPageToReady 	: function( pageInfo , constructor ){
				$.extend( this , constructor.call( this , this._pageConfig.belongPageList ) );
				this.handlePageEventList();
				this._pageConfig.ready = true;
				return this;
			}
		} );
	return PageList;
} );