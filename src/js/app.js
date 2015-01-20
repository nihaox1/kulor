requirejs( [ "Base" ] , function( Base ){
    window.E = function( x ){ return console.log( x ); };
    var People = function( name ){
            this.name = name;
        },
        Method = function(){};
    People.prototype.setName = function( name ){
        this.name = name;
    }
    Method.prototype.talk = function( x ){
        E( x );
    }
    Method.prototype.eat = function(){
        E( "I'm eating" );
    }

    var Man = Base.extend( function( name , age ){
        this.age = age;
    } , {
        extend      : People,
        implements  : [ new Method() ] ,
        sex         : "man",
        setSex      : function(){
            this.sex = "man";
        }
    } );

    var Women = Base.extend( function(){} , {
        extend      : Man,
        implements  : [ new Method() ],
        sex         : "women",
        setSex      : function(){
            this.sex    = "women";
        }
    } );
    // E( new Man( "John" , 18 ) );
    // E( new Women( "Joess" , 20 ) );
} );


requirejs( [ "Template" ] , function( Template ){
    var _t = new Template();
    $( document.body ).append( _t.getTemplate( { title : "xxxxxx" , content : "aaaaaaaaaaaaaaaaa" } , "myDemoTemplate" ) );
} );


requirejs( [ "Panel" ] , function( Panel ){
    var _panel = new Panel( "myDemoTemplate" , { title : "xxxx" , content : "cccccccccccccccc" } );
    _panel.hidePanel();
    _panel.deletePanel();
} );


requirejs( [ "Dialog" ] , function( Dialog ){
    var _dialog = new Dialog( "xxxxx" , {
        title           : "提示",
        successBtnName  : "同意协议" , 
        cancelBtnName   : "放弃" ,
        successEvent    : function(){
            return false;
        },
        cancelEvent     : function(){
            return false;
        }
    } );
    _dialog.showDialog();
    _dialog.hideDialog();
} );


requirejs( [ "Ajax" ] , function( Ajax ){
    var _ajax = new Ajax( {
        success : function( rtn ){
            rtn.code = rtn.code || 200;
            return rtn.code != 302;
        }
    } ).config( {
        successList     : [ function( rtn ){
            rtn.other = "xxxxxxxxx";
        } , function( rtn ){
            rtn.another = "cccccccc";
        } ], 
        failList        : function( rtn ){
            alert( "x" );
        } , 
        submitUrl        : "//kulor.com/index.php"
    } );
    _ajax.post( "index.php" , function( rtn ){
        // E( rtn );
    } );
    _ajax.post( function( rtn ){
        // E( rtn );
    } );
    _ajax.jsonp( function( rtn ){
        // E( rtn );
    } );
    // E( _ajax );
} );


requirejs( [ "Verify" ] , function( Verify ){
    var _verify = new Verify();
    _verify.addVerifyItem( "userInfo" , $( "#form" ) , {
        "userName"  : {
            rules   : "length[ 6 , 20 ]" ,
            content : "用户名输入错误"
        } ,
        "email"     : {
            rules   : "email" ,
            content : "email格式错误"
        } , 
        "mobile"    : {
            rules   : "length[13,13] isNumber"
        } ,
        "mobile2"    : {
            rules   : "  length[   13,  13]    length[   13,  13]       isNumber "
        }
    } , function( $input , isPass , opt ){
        E( arguments );
    } );
    E( _verify );
} );