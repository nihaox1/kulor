requirejs( [ "ModalView" ] , function( ModalView ){
	myPage.home.ready( {
		require 	: [ "page/home.html" , "css/home.css" ]
	} , function(){
		var _view = new ModalView( "home" , this._pageConfig.$content , function(){
			this.html( this.getTemplate( "homeContainerTemplate" ) );
		} , {
			modals 	: [
				{}
			]
		} ).addModalEvent( {
	        submitForm      : function(){
	            E( "submit" );
	        } 
	    } ).addViewEvent( {
	        ".btn::click"   : "submitForm"
	    } ).init();

		return {

		}
	} );
} );