requirejs( [ "Template" ] , function( Template ){
    var _tmpl   = new Template();
    docConfig.contentPage.grunt.ready( {
        requireFile     : [ "markdown/grunt.html" ]
    } , function(){
        var _html   = marked.parse( _tmpl.getTemplate( "gruntMarkdown" ) );
        this.display( function(){
            this._pageConfig.$container.html( _html );
        });
    } );
} )