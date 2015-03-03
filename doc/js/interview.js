requirejs( [ "ModalView" ] , function( ModalView ){
    docConfig.contentPage.interview.ready( {
        requireFile   : [ "css/subs/interview.css" , "subs/interview/interview.html" ]
    } , function(){
        var _self       = this ,
            _$container = _self.getPageModalUI( "interviewContainerTemplate" ) ,
            _page       = new ModalView( "interview" , _$container , function(){

            } , {

            } ).addModalEvent( {

            } ).addViewEvent( {

            } ).init();
        E( _$container );
        return {

        }
    } )
} )