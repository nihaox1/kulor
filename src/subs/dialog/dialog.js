define( "Dialog" , [ "Base" , "Panel" ] , function( Base , Panel ){
    var Dialog = Base.extend( function( info , opts ){
        var _self = this;
        this.originInfo = $.extend( {
            content     : info ,
            events      : {
                success     : [] ,
                cancel      : []
            }
        } , this.__config.defaultTemplateValue , this.__config.uiConfig , opts );
        this.panel = new Panel( this.__config.containerTemplateId , this.originInfo );
        this.panel.$content.find( "[uiSub-role='success']" ).click( function(){ 
            _self.hideDialog( "success" ); 
        } );
        this.panel.$content.find( "[uiSub-role='cancel']" ).click( function(){ 
            _self.hideDialog( "cancel" ); 
        } );
    } , {
        __config        : {
            containerTemplateId     : "uiSub-dialog-container",
            uiConfig                : {
                theme               : "default"
            } ,
            events                  : {
                success         : [],
                cancel          : []
            } ,
            defaultTemplateValue    : Object.freeze( {
                width           : "500px",
                title           : "信息" , 
                successBtnName  : "确定" , 
                cancelBtnName   : "关闭" 
            } )
        } ,
        /*!
         *  设置dialog事件
         *  @type       {enum}  success|cancel
         *  @fn         {function}
         *  @isGlobal   {bool}      是否设置成全局事件
         */
        addDialogEvent  : function( type , fn , isGlobal ){
            var _events     = isGlobal ? this.__config.events : this.originInfo.events;
            if( _events[ type ] && typeof fn == "function" ){
                _events[ type ].push( fn );
            }
            return this;
        } ,
        showDialog      : function(){
            this.panel.showPanel();
            return this;
        } ,
        hideDialog      : function( eventType ){
            var _events ,
                _self   = this ,
                _pass   = true;
            eventType   = this.originInfo.events[ eventType ] ? eventType : "cancel";
            _events     = this.__config.events[ eventType ].concat( this.originInfo.events[ eventType ] );
            $.each( _events , function( fn ){
                if( typeof fn == "function" ){
                    if( fn.call( _self ) === false ){
                        return _pass = false;
                    }
                }
            } );
            if( _pass ){
                this.panel.hidePanel();
            }
            return this;
        } ,
        deleteDialog : function(){
            this.panel.deletePanel();
            for( var a in this ){
                delete this[ a ];
            }
            return this;
        }
    } );
    return Dialog;
} );