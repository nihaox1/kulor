define( "Panel" , [ "Base" , "Template" ] , function( Base , Template ){
    var Panel = Base.extend( function( templateId , jsonInfo , $parentContainer ){
        this.$parentContainer   = $parentContainer || $( document.body );
        this.$container         = $( this.getTemplate( this.__panelConfig.uiConfig , this.__panelConfig.containerTemplateId ) );
        this.$content           = this.$container.find( ".uiSub-panel-container-pos-center-left-fixed" );
        this.$modal             = false;
        this.$coverBy           = false;
        this._panelStatus       = {
            display     : false
        }
        this.InitCoverByModal();
        this.$parentContainer.append( this.$container );
        if( templateId ){
            this.showPanel( templateId , jsonInfo );
        }
    } , {
        extend          : Template ,
        __panelConfig        : {
            containerTemplateId     : "uiSub-panel-container" ,
            coverByTemplateId       : "uiSub-panel-coverBy" ,
            zIndex                  : 199 ,
            parentContainer         : {} ,
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
        InitCoverByModal : function(){
            this.$coverBy   = this.$parentContainer.children( "." + this.__panelConfig.containerTemplateId );
            if( !this.$coverBy.length ){
                this.$coverBy = $( this.getTemplate( this.__panelConfig.coverByTemplateId ) );
                if ( this.$parentContainer.get( 0 ).tagName != "BODY" ) {
                    this.$parentContainer.css( { position : "relative" } );
                }
                this.$parentContainer.append( this.$coverBy )
                    .on( "resize" , function(){
                        this.$coverBy.height( this.$parentContainer.height() );    
                    } );
                this.$coverBy.height( this.$parentContainer.height() );
            }
        },
        showPanel    : function( id , jsonInfo ){
            if ( id ) {
                this.$content.html( this.getTemplate( jsonInfo || id , jsonInfo ? id : false  ) );
                this.$modal     = this.$content.children();
            }
            if ( !this._panelStatus.display ) {
                this.$container.removeClass( "uiSub-hidden" );
                this.__panelConfig.zIndex++;
                this.$coverBy.removeClass( "uiSub-hidden" );
                this._panelStatus.display = true;
            }          
            return this;
        } ,
        hidePanel      : function(){
            if ( this._panelStatus.display ) {
                this.$container.addClass( "uiSub-hidden" );
                if( this.$parentContainer.children( ".uiSub-panel-container-pos-center" ).length == this.$parentContainer.children( ".uiSub-panel-container-pos-center.uiSub-hidden" ).length ){
                    this.$coverBy.addClass( "uiSub-hidden" );
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