define( "View" , [ "Base" , "Template" , "Ajax" , "Validate" ] , function( Base , Template , Ajax , Validate ){
	var View = Base.extend( function( id , opt ){
		this._viewConfig = $.extend( {} , this.__viewConfig.globalConifg , opt );
	} , {
		extend 			: Validate ,
		__viewConfig 	: {
			globalConifg: {} ,
			viewItems 	: {}
		} ,
		addEventListener: function(){

		} ,
		addValidate 	: function(){

		} , 
		init 			: function(){

			return this;
		}
	} );

	return View;
} );