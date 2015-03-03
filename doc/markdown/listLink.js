requirejs( [ "Template" ] , function( Template ){
    var _tmpl   = new Template();
    docConfig.contentPage.listLink.ready( {
        requireFile     : [ "markdown/listLink.html" ]
    } , function(){
        var _html   = marked.parse( _tmpl.getTemplate( "listLinkMarkdown" ) );
        this.display( function(){
            this._pageConfig.$container.html( _html );
        });
    } );
} )