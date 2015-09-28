// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for gravity mode menu.
 *
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var gravityString = require( 'string!GRAVITY_AND_ORBITS/gravity' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );

  // strings
  var onString = require( 'string!GRAVITY_AND_ORBITS/on' );
  var offString = require( 'string!GRAVITY_AND_ORBITS/off' );

  // constants
  var FONT = new PhetFont( 14 );
  var TEXT_OPTIONS = { font: FONT };
  var RADIO_OPTIONS = { radius: 7 };

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options] - This object contains options for main node of gravity mode menu.
   * @constructor
   */
  function GravityModeMenu( module, options ) {
    Node.call( this, options );

    var gravityTextNode = new Text( gravityString + ':', TEXT_OPTIONS );
    var onTextNode = new Text( onString + ':', TEXT_OPTIONS );
    var offTextNode = new Text( offString + ':', TEXT_OPTIONS );

    this.addChild( new HBox( {
      spacing: 10, bottom: 2, children: [
        gravityTextNode,
        new AquaRadioButton( module.gravityEnabledProperty, true, onTextNode, RADIO_OPTIONS ),
        new AquaRadioButton( module.gravityEnabledProperty, false, offTextNode, RADIO_OPTIONS )
      ]
    } ) );

    GravityAndOrbitsColorProfile.panelTextProperty.link( function( color ) {
      gravityTextNode.fill = color;
      onTextNode.fill = color;
      offTextNode.fill = color;
    } );
  }

  return inherit( Node, GravityModeMenu );
} );