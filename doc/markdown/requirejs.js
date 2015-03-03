requirejs( [ "Template" ] , function( Template ){
    var _tmpl   = new Template();
    docConfig.contentPage.requirejs.ready( {
        requireFile     : [ "markdown/requirejs.html" ]
    } , function(){
        var _html   = marked.parse( _tmpl.getTemplate( "requirejsMarkdown" ) );
        this.display( function(){
            this._pageConfig.$container.html( _html );
        });
    } );
} )