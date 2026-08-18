// Copyright © 2022 Brian Gawlik
// See LICENSE.txt for license information

function drawLayer( drawFunctionName, object ) {

    window["draw_" + drawFunctionName]( object );
    
}