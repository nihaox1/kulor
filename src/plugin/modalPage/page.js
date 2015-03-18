define( "Page" , [ "Base" , "Template" , "RequireFile" , "ModalView" ] , function( Base , Template , RequireFile , ModalView ){
	"use strict"
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
		if( opt.opt ){
			$.extend( this._pageListConfig , opt.opt );
			delete opt.opt;
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
			// 	暂留提供page主题相关的引入
			// 	$container.html( this.getTemplate( this.__pageListConfig.templateIds.container) );
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
				var _self 		= this ,
					_$container = this._pageConfig.belongPageList._pageListConfig.$container;
				
				_self.getPageModal( function(){
					_$container.find( ".uiSub-page-singlePage" ).removeClass( "active" );
					_self._pageConfig.$container.addClass( "active" );
					if( $.isFunction( func ) ){ func.call( _self ); };
				} );
				return this;
			} ,
			handlePageEventList 	: function(){
				// 转移事件队列，将队列池清空，防止队列中事件互调造成内存溢出
				var _el = [].concat( this._pageConfig.eventList );
				this._pageConfig.eventList.length = 0;
				for( var i = 0 , len = _el.length; i < len; i++){
					_el[ i ].call( this );
				}
				_el = null;
				return this;
			} ,
			getPageModal 		: function( func ){
				this._pageConfig.eventList.push( function(){
					if( $.isFunction( func ) && 
						( $.isFunction( this._pageConfig.belongPageList._pageListConfig.callBack ) ? this._pageConfig.belongPageList._pageListConfig.callBack.call( this ) !== false : true )
					){ func(); }
				} );
				if ( this._pageConfig.ready == "ready" ) {
					this.handlePageEventList();
				} else if( this._pageConfig.ready != "waiting" ){
					this._pageConfig.belongPageList.getFile( this._pageConfig.jsPath );
					this._pageConfig.ready = "waiting";
				}
				return this;
			} ,	
			/*!
			 *	绘制page的内容
			 * 	@templateId 	{string} 	
			 */		
			getPageModalUI 		: function( templateId ){
				var _$container = this._pageConfig.belongPageList._pageListConfig.$container;
				if( !this._pageConfig.$container ){
					this._pageConfig.$container 	= $( this._pageConfig.belongPageList.getTemplate( this.__pageConfig.templateIds.container ) );
					_$container.append( this._pageConfig.$container );
				}
				if( templateId ){
					this._pageConfig.$container.html( this._pageConfig.belongPageList.getTemplate( templateId ) );
				}
				return this._pageConfig.$container;
			} ,
			setPageToReady 	: function( pageInfo , constructor ){
				var _self = this ,
					_done = function(){
						_self._pageConfig.ready = "ready";
						_self.getPageModalUI();
						$.extend( _self , constructor.call( _self , _self._pageConfig.belongPageList ) );
						_self.handlePageEventList();
					};
				if ( typeof pageInfo == "function" ) {
					constructor = pageInfo;
					pageInfo 	= {};
				}
				if ( pageInfo.requireFile instanceof Array ) {
					_self._pageConfig.belongPageList.getFile( pageInfo.requireFile , _done );	
				} else {
					_done();
				}
				return this;
			}
		} );
	return PageList;
} );