requirejs( [ "ModalView" ] , function( ModalView ){
	myPage.home.ready( {
		require 	: [ "page/home.html" , "css/home.css" ]
	} , function(){
		var _page 			= this ,
			_$pageContainer = this._pageConfig.$container ,
			_view 	= new ModalView( "home" , _$pageContainer , function(){
				_$pageContainer.html( this.getTemplate( "homeContainerTemplate" ) );
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