requirejs( [ "Page" ] , function( Page ){    window.myPage   = new Page( "homeContentPage" , $( "article.contentBody" ) , {        home        : "js/home.js"     } );    myPage.home.display();} );