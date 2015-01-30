requirejs( [ "ModalView" ] , function( ModalView ){
	myPage.pageOne.ready( {
		requireFile 	: [ "page/pageOne.html" ] 
	} , function(){
		return {
			tell 	: function(){
				E( "success" );
			}
		}
	} );
} );