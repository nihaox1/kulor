define( "RequireFile" , [ "Base" ] , function( Base ){
	var RequireFile,
		require 		= function( path , requireFile ){
			if( typeof path != "string" ){
				this.length--;
			} else if( requireFile.__requireFileConfig.files[ path ] ){
				this.done( path );
			} else if( !path.replace( requireFile.__requireFileConfig.fileType.page , "" ) ){
				requireHtml.call( this , path );
			} else if( !path.replace( requireFile.__requireFileConfig.fileType.js , "" ) ){
				requireJs.call( this , path );
			} else if( !path.replace( requireFile.__requireFileConfig.fileType.css , "" ) ){
				requireCss.call( this , path );
			} else if( !path.replace( requireFile.__requireFileConfig.fileType.img , "" ) ){
				requireImg.call( this , path );
			}
		} ,
		requireJs 		= function( path ) {
			var _script = document.createElement("script"),
				_self 	= this;
			_script.type = "text/javascript";
			_script.src = path;
			document.body.appendChild( _script );
			if( $.browser && $.browser.msie ){
				_script.onreadystatechange = function(){
					if( _script.readyState == "complete" || _script.readyState == "loaded" ){
						_self.done( path );
					};
				};
			} else {
				_script.onload = function(){
					_self.done( path );
				};
			};
		} ,
		requireCss 		= function( path ){
			var _link = document.createElement("link"),
				_self = this ,
				_head = document.head || document.getElementsByTagName("head")[ 0 ];
			_link.rel 	= "stylesheet";
			_link.href 	= path;
			_head.appendChild( _link );
			_link.onload = function(){
				_self.done( path );
			}
		} ,
		requireHtml 	= function( path ){
			var _t 		= 0 ,
				_state  = "loading" ,
				_self 	= this ,
				x = function(){
					_t 	+= 50;
					window.setTimeout( function(){
						if( _state !== "ready" ){
							try{
								$.get( path , function( rtn ){
									$( "body" ).append( rtn );
									_self.done( path );
									_state = "ready";
								});
							} catch( e ) {
								x();
							};
						};
					} , _t );
				};
			x();
		} ,
		requireImg 		= function( path ){
			var _img 	= document.createElement("img") ,
				_self 	= this;
			_img.src = path;
			_img.onload = function(){
				_self.done( path );
			};
		};
	/*!
	 *	获取对应的html css image文件
	 */
	RequireFile 	= Base.extend( function( filePath , callBack ){
		this._requireFileConfig = {

		}
		if ( !this.__requireFileConfig.files ) { 
			this.__requireFileConfig.files = {};
			this.__initFiles(); 
		}
		this.getFile( filePath , callBack );
	} , {
		__requireFileConfig 	: {
			files 	: false ,
			fileType: {
				page 	: 	/.*\.(html?|jsp|php|aspx?)$/i,
				js 		: 	/.*\.js$/i,
				img 	:  	/.*\.(jpe?g|png|bmp)$/i,
				css 	: 	/.*\.css$/i
			}
		} ,
		__initFiles 	: function(){
			var _nodes 	= document.head,
				_urls 	= [];
			if( _nodes ){
				_nodes = _nodes.childNodes;
				for( var i = _nodes.length; i--; ){
					if( _nodes[ i ].nodeName === "SCRIPT" && _nodes[ i ].src ){
						_urls.push( _nodes[ i ].outerHTML.replace( /.*src\="(.*)".*/i , "$1" ) );
					} else if( _nodes[ i ].nodeName === "LINK" ){
						_urls.push( _nodes[ i ].outerHTML.replace( /.*href\="(.*)".*/i , "$1" ) );
					}
				}
			}
			_nodes	= document.getElementsByTagName( "script" );
			for( var i = _nodes.length; i--; ){
				if( _nodes[ i ].nodeName === "SCRIPT" && _nodes[ i ].src ){
					_urls.push( _nodes[ i ].outerHTML.replace( /.*src\="(.*)".*/i , "$1" ) );
				}
			}
			this.filterRequireUrls( _urls );
			return this;
		} ,
		/*!
		 *	urls = ["../bin/aa.html" , "../bin/bbb.html"];
		 *	遇到以上的url请求时  直接执行callback命令
		 */
		filterRequireUrls 	: function( urls ){
			for( var i = urls.length; i--; ){
				this.__requireFileConfig.files[ urls[ i ] ] = true;
			}
			return this;
		} ,
		/*!
		 *	简写getFile  方便后续扩展开发
		 */
		get 		: function(){
			return this.getFile.apply( this , arguments );
		} ,
		/*!
		 *	获取文件
		 * 	@filePath 		{string|array} 	
		 * 	@callBack 		{function} 
		 * 	@isOrder 		{bool} 			是否按照顺序加载
		 */
		getFile 	: function( filePath , callBack , isOrder ){
			var _url,
				_iterator,
				_self 		= this;
			if( isOrder ){
				return this.getFileInOrder( filePath , callBack );
			} else if( filePath ){
				if ( typeof filePath === "string" ) {
					filePath = [ filePath ];
				}
				if ( filePath instanceof Array && filePath.length ) {
					_iterator = {
						length 		: filePath.length ,
						waitLength 	: filePath.length ,
						doneUrl 	: 0 ,
						done 		: function( path ){
							_self.__requireFileConfig.files[ path ] = true;
							if ( !--this.waitLength ) {
								if( typeof callBack == "function" ){ 
									callBack();
								}
							}							
						}
					}
					for( var i = filePath.length; i--; ){
						_url = filePath[ i ];
						require.call( _iterator , _url , this );
					}
				}
			}
			return this;
		} ,
		/*!
		 *	按顺序加载文件
		 * 	@filePath 		{string|array} 	
		 * 	@callBack 		{function} 
		 */
		getFileInOrder : function( filePath , callBack ){
			var _self = this;
			if ( !filePath instanceof Array ) { 
				return this.getFile( filePath , callBack ); 
			} else {
				this.getFile( filePath[ 0 ] , function(){
					filePath.splice( 0 , 1 );
					if( filePath.length ){
						_self.getFileInOrder( filePath , callBack );
					} else {
						callBack();
					}
				} );
			}
			return this;
		}
	} );

	return RequireFile;
} );
