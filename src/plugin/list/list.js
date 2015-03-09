define( "List" , [ "Base" , "DataView" , "Ajax" , "EventBind" ] , function( Base , DataView , Ajax , EventBind ){
    var tool    = {
        config      : {} ,
        redrawListPages        : function( json ){
            var _currentPage    = this._listConfig.page ,
                _pages          = [ { page : _currentPage , hasClass : "active" } ] ,
                _num            = 1,
                _btnNum,
                _btnLen,
                _insertPage     = {
                    pages       : _pages ,
                    pageBefore  : "",
                    pageAfter   : "",
                };
            if( this._listConfig.ready === "waiting" ) { 
                while( _pages.length < this._listConfig.pageBtnNum ){
                    _btnLen     = _pages.length;
                    _btnNum     = _currentPage - _num;
                    if ( _btnNum >= 1 ) { _pages = [ { page : _btnNum } ].concat( _pages ); }
                    if ( _pages.length == this._listConfig.pageBtnNum ) { break; }
                    _btnNum     = _currentPage + _num;
                    if ( _btnNum <= this._listConfig.totalPage ) { _pages.push( { page : _btnNum } ); }
                    _num++;
                    if ( _btnLen == _pages.length ) { break; }
                }
                _insertPage.pages   = _pages;
                if ( _pages[ 0 ].page > 1 ) { _insertPage.pageBefore = "..."; }
                if ( _pages[ this._listConfig.pageBtnNum - 1 ].page < this._listConfig.totalPage ) { _insertPage.pageAfter = "..."; }
            }
            return this.getTemplate( _insertPage , "uiSubListPageTemplate" );
        }
    } , 
    /*!
     *
     */
    list   = Base.extend( function( templateId , json , events , opt ){
        this._listConfig   = $.extend( this.__listConfig , opt );
    } , {
        extend      : DataView ,
        implements  : [ new Ajax() , new EventBind() ] ,
        __listConfig: { 
            page        : 1 ,
            pageSize    : 10 ,
            totalPage   : 1 ,
            //  底部分页的按钮数量
            pageBtnNum  : 3
        } ,
        /*!
         *  setListDataView 缩写
         */
        set               : function(){
            return this.setListDataView.apply( this , arguments );
        } ,
        /*!
         *  重写DataView里的 set/setDataView 方法
         *  @json   {json}  
         *  接受total为总条目数
         */
        setListDataView   : function( json ){
            if ( json.total ) {
                this._listConfig.total      = json.total;
                this._listConfig.totalPage  = Math.ceil( json.total / this._listConfig.pageSize );
            }
            this._listConfig.$pages
                            .empty()
                            .append( tool.redrawListPages.call( this , json ) );
            this._listConfig.ready     = true;
            return this.setDataView( json );
        } ,
        /*!
         *  绘制list列表的底部page分页
         */
        drawPageDataModal : function( $page ){
            var _self       = this;
            $page.addClass( "uiSub-list-pages" )
                .empty()
                .append( tool.redrawListPages.call( this ) );
            this._listConfig.$pages    = $page;
            this.addEventBindItems( {
                "a[func='start']::click"    : "start" ,
                "a[func='pre']::click"    : "pre" ,
                "a[func='next']::click"    : "next" ,
                "a[func='last']::click"    : "last" ,
                "a[func='goto']::click"    : "gotoPage" 
            } , $page , {
                beforeEventBind     : function(){
                    return _self._listConfig.ready === true ? true : false;
                } ,
                afterEventBind      : function(){
                    return _self.gotoListPage();
                } ,
                start   : function(){
                    _self._listConfig.page  = 1;
                } ,
                pre     : function(){
                    _self._listConfig.page  = _self._listConfig.page > 1 ? 
                                                --_self._listConfig.page : 1;
                } ,
                next    : function(){
                    _self._listConfig.page  = _self._listConfig.page < _self._listConfig.totalPage ?
                                                ++_self._listConfig.page : _self._listConfig.totalPage;
                } ,
                last    : function(){
                    _self._listConfig.page  = _self._listConfig.totalPage;
                } ,
                gotoPage : function(){
                    _self._listConfig.page  = parseInt( $( this ).attr( "_page" ) );
                }
            } );
            return this;
        } ,
        /*! 
         *  设置公共配置
         *  @opt        {json}
         *  @toGlobal   {boolean}
         */
        setListConfig : function( opt , toGlobal ){
            $.extend( toGlobal ? this.__listConfig : this._listConfig , opt );
            return this;
        } ,
        /*!
         *  设置列表的ajax请求
         */
        setListRequest : function( ajaxFunc ){
            if ( typeof ajaxFunc === "function" ) {
                this._listConfig.ajaxFunc = ajaxFunc;
            }
            return this;
        } ,
        gotoListPage : function( page , pageSize ){
            if ( this._listConfig.ajaxFunc ) {
                this._listConfig.page        = page || this._listConfig.page;
                this._listConfig.pageSize    = pageSize || this._listConfig.pageSize;
                this._listConfig.ready = "waiting";
                this._listConfig.ajaxFunc.call( this , this._listConfig.page , this._listConfig.pageSize );
            }
            return this;
        }
    } );

    return list;
} );