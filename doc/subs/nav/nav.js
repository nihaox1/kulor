requirejs( [ "Template" , "ModalView" ] , function( Template , ModalView ){
    var tmpl    = new Template() ,
        config  = {
            $nav    : $( ".contentNav" )
        } ,
        menu    = [
            {
                title       : "开发流程" ,
                subs        : [
                    {
                        name    : "jade" ,
                        title   : "jade"
                    },
                    {
                        name    : "grunt" ,
                        title   : "grunt"
                    } ,
                    {
                        name    : "listLink" ,
                        title   : "listLink"
                    } ,
                    {
                        name    : "requirejs" ,
                        title   : "requirejs"
                    } ,
                    {
                        name    : "folder" ,
                        title   : "开发目录结构"
                    }
                ]
            } ,
            {
                title       : "开发文档" ,
                subs        : [
                    {
                        name    : "summuy" ,
                        title   : "概述"
                    } ,
                    {
                        name    : "base" ,
                        title   : "Base类"
                    } ,
                    {
                        name    : "template" ,
                        title   : "Template模板类"
                    }
                ]
            }
        ] ,
        nav     = new ModalView( "menu" , config.$nav , function(){
            this.makeMenu();
        } , {
            menu    : menu
        } );
    nav.addModalEvent( {
        makeMenu    : function(){
            var _dls    = [];
            for( var i = 0 , len = menu.length; i < len; i ++){
                _dls.push( tmpl.getTemplate( menu[ i ] , "navDlTemplate" ) );
            }
            config.$nav.append( _dls.join( "" ) );
            return this;
        } ,
        gotoMarkdown    : function(){
            var _val    = $( this ).attr( "_val" );
            docConfig.contentPage[ _val ].display();
            return nav;
        }
    } ).addViewEvent( {
        "dd::click"         : "gotoMarkdown" ,
        "h4::click"         : function(){ docConfig.contentPage.interview.display(); }
    } );
    window.docMenu  = menu;
    $( document ).ready( function(){
        nav.init();
    } );
} )