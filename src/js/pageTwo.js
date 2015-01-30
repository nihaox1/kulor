requirejs( [] , function(){
	myPage.pageTwo.ready( {
		requireFile 	: [ "page/pageOne.html" ] 
	} , function(){
		return {
			tell 	: function(){
				E( "Two-success" );
			}
		}
	} );
} );