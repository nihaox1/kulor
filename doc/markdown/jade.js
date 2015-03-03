requirejs( [ "Template" ] , function( Template ){
    var _tmpl   = new Template();
    docConfig.contentPage.jade.ready( {
        requireFile     : [ "markdown/jade.html" ]
    } , function(){
        var _html   = marked.parse( _tmpl.getTemplate( "jadeMarkdown" ) );
        this.display( function(){
            this._pageConfig.$container.html( _html );
        });
    } );
} )