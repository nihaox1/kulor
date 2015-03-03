requirejs( [ "Template" ] , function( Template ){
    var _tmpl   = new Template();
    docConfig.contentPage.summuy.ready( {
        requireFile     : [ "markdown/summuy.html" ]
    } , function(){
        var _html   = marked.parse( _tmpl.getTemplate( "summuyMarkdown" ) );
        this.display( function(){
            this._pageConfig.$container.html( _html );
        });
    } );
} )