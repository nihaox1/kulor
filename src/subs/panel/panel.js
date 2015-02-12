define( "Panel" , [ "Base" , "Template" ] , function( Base , Template ){
    var Panel = Base.extend( function( templateId , jsonInfo ){
        this.$container     = $( this.getTemplate( this.__panelConfig.uiConfig , this.__panelConfig.containerTemplateId ) );
        this.$modal         = false;
        this.$content       = this.$container.find( ".uiSub-panel-container-pos-center-left-fixed" );
        this._panelStatus   = {
            display     : false
        }
        this.getCoverByModal();
        $( document.body ).append( this.$container );
        if( templateId ){
            this.showPanel( templateId , jsonInfo );
        }
    } , {
        extend          : Template ,
        __panelConfig        : {
            containerTemplateId     : "uiSub-panel-container" ,
            coverByTemplateId       : "uiSub-panel-coverBy" ,
            $coverBy                : 0 ,
            zIndex                  : 199 ,
            panelItems              : [],
            uiConfig                : {
                theme           : "default"
            }
        } ,
        setPanelConfig : function( uiConfig ){
            this.__panelConfig.uiConfig = $.extend( this.__panelConfig.uiConfig , uiConfig );
            this.$container.addClass( "uiSub-panel-theme-" + this.__panelConfig.uiConfig.theme );
            return this;
        },
        /*!
         *  构建一个panel遮罩层
         */
        getCoverByModal : function(){
            if( !this.__panelConfig.$coverBy ){
                this.__panelConfig.$coverBy = $( this.getTemplate( this.__panelConfig.coverByTemplateId ) );
                $( document.body ).append( this.__panelConfig.$coverBy );
            }
        },
        showPanel    : function( id , jsonInfo ){
            if ( id ) {
                this.$content.html( this.getTemplate( jsonInfo || id , jsonInfo ? id : false  ) );
            }
            if ( !this._panelStatus.display ) {
                this.$container.removeClass( "uiSub-hidden" );
                this.__panelConfig.zIndex++;
                this.__panelConfig.$coverBy.removeClass( "uiSub-hidden" );
                this._panelStatus.display = true;
            }          
            return this;
        } ,
        hidePanel      : function(){
            if ( this._panelStatus.display ) {
                this.$container.addClass( "uiSub-hidden" );
                if( --this.__panelConfig.zIndex <= 199 ){
                    this.__panelConfig.$coverBy.addClass( "uiSub-hidden" );
                }
                this._panelStatus.display = false;
            }
            return this;
        } ,
        deletePanel     : function(){
            this.hidePanel();
            this.$container.remove();
            this.$content = null;
            for( var a in this ){
                delete this[ a ];
            }
            return this;
        }
    } );
    return Panel;
} );