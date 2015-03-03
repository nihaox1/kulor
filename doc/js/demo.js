(function(){
    function E( x ){ console.log( x ); };
    function funcOne( x , y ){
        E( this );
        return this.name + x + y;
    };
    funcOne.bind( { name : 1 } , 2 )
})();