requirejs( [ "Template" ] , function( Template ){
    var _tmpl   = new Template();
    docConfig.contentPage.template.ready( {
        requireFile     : [ "markdown/template.html" ]
    } , function(){
        var _html   = marked.parse( _tmpl.getTemplate( "templateMarkdown" ) );
        this.display( function(){
            this._pageConfig.$container.html( _html );
        });
    } );
} )