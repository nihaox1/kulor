define( "Panel" , [ "Base" , "Template" ] , function( Base , Template ){
    var Panel = Base.extend( function( templateId , jsonInfo ){
        this.$container = $( this.getTemplate( this.__config.uiConfig , this.__config.containerTemplateId ) );
        this.$modal     = false;
        this.$content   = this.$container.find( ".uiSub-panel-container-pos-center-left-fixed" );
        this.getCoverByModal();
        $( document.body ).append( this.$container );
        if( templateId ){
            this.showPanel( templateId , jsonInfo );
        }
    } , {
        extend          : Template ,
        __config        : {
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
            this.__config.uiConfig = $.extend( this.__config.uiConfig , uiConfig );
            this.$container.addClass( "uiSub-panel-theme-" + this.__config.uiConfig.theme );
            return this;
        },
        /*!
         *  构建一个panel遮罩层
         */
        getCoverByModal : function(){
            if( !this.__config.$coverBy ){
                this.__config.$coverBy = $( this.getTemplate( this.__config.coverByTemplateId ) );
                $( document.body ).append( this.__config.$coverBy );
            }
        },
        showPanel    : function( id , jsonInfo ){
            if ( id ) {
                this.$content.html( this.getTemplate( jsonInfo || id , jsonInfo ? id : false  ) );
            }
            this.$container.removeClass( "uiSub-hidden" );
            this.__config.zIndex++;
            this.__config.$coverBy.removeClass( "uiSub-hidden" );
            return this;
        } ,
        hidePanel      : function(){
            this.$container.addClass( "uiSub-hidden" );
            if( --this.__config.zIndex <= 199 ){
                this.__config.$coverBy.addClass( "uiSub-hidden" );
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