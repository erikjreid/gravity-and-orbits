// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for Moon.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var moonImg = require( 'image!GRAVITY_AND_ORBITS/moon.png' );

  function Moon( coords, radius ) {
    Node.call( this, coords );

    this.setRadius( radius );
  }

  return inherit( Node, Moon, {
    setRadius: function( radius ) {
      var width = moonImg.width / 2, scale = radius / width;
      if ( this.view ) {this.removeChild( this.view );}

      this.view = new Image( moonImg, {scale: scale, x: -width * scale, y: -width * scale} );
      this.addChild( this.view );
    }
  } );
} );