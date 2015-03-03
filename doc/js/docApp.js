var E   = function( x ){ console.log( x ); };
requirejs( [ "ModalView" , "Page" ] , function( ModalView , Page ){
    var tool ,
        config = {
            $contentBody            : $( ".contentBody" ) ,
            contentPage             : false
        };
    tool = {
        setupContentPage    : function(){
            var _menu   = {
                    interview       : "js/subs/interview.js"
                } ,
                _sub;
            for( var i = docMenu.length; i--; ){
                for( var k = docMenu[ i ].subs.length; k--; ){
                    _sub   = docMenu[ i ].subs[ k ];
                    _menu[ _sub.name ]  = "markdown/" + _sub.name + ".js";
                }
            }
            config.contentPage  = new Page( "contentPage" , $( ".pageContainer" ) , _menu );
        } ,
        mkBodyHeight    : function(){
            var _h  = $( document ).height() - 45;
            config.$contentBody.height( _h );
            config.contentHeight    = _h;
        }
    }
    tool.mkBodyHeight();
    tool.setupContentPage();
    config.contentPage.interview.display();
    // config.contentPage.template.display();
    window.docConfig    = config;
} )