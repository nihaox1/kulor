requirejs( [ "Template" ] , function( Template ){
    var _tmpl   = new Template();
    docConfig.contentPage.folder.ready( {
        requireFile     : [ "markdown/folder.html" ]
    } , function(){
        var _html   = marked.parse( _tmpl.getTemplate( "folderMarkdown" ) );
        this.display( function(){
            this._pageConfig.$container.html( _html );
        });
    } );
} )