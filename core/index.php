<?php
$rtn 	= json_encode( array( "name"=>( isset( $_POST[ "name" ] ) ? $_POST[ "name" ] : "xxxxxx" ) ) );
if ( isset( $_GET[ "callback" ] ) ) {
	$rtn 	= $_GET[ "callback" ] . "(" . $rtn . ")";
}
printf( $rtn );
?>