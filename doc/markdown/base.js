requirejs( [ "Template" ] , function( Template ){
    var _tmpl   = new Template();
    docConfig.contentPage.base.ready( {
        requireFile     : [ "markdown/base.html" ]
    } , function(){
        var _html   = marked.parse( _tmpl.getTemplate( "baseMarkdown" ) );
        this.display( function(){
            this._pageConfig.$container.html( _html );
        });
    } );
} )