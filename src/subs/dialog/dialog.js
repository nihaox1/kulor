define( "Dialog" , [ "Base" , "Panel" ] , function( Base , Panel ){
    var Dialog = Base.extend( function( info , opts ){
        var _self = this;
        this.originInfo = $.extend( {
            content     : info 
        } , this.__config.defaultTemplateValue , this.__config.uiConfig , opts );
        this.panel = new Panel( this.__config.containerTemplateId , this.originInfo );
        this.panel.$content.find( "[uiSub-role='close']" ).click( function(){ _self.hideDialog(); } );
    } , {
        __config        : {
            containerTemplateId     : "uiSub-dialog-container",
            uiConfig                : {
                theme               : "default"
            } ,
            defaultTemplateValue    : {
                title           : "信息" , 
                successBtnName  : "确定" , 
                cancelBtnName   : "关闭" 
            }
        } ,
        showDialog      : function(){
            this.panel.showPanel();
            return this;
        } ,
        hideDialog      : function(){
            if ( this.originInfo.cancel || !$.isFunction( this.originInfo.cancel ) || this.originInfo.cancel.call( this ) === false ) {
                this.panel.hidePanel();    
            };
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