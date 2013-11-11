// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Workspace = require( 'view/workspace/Workspace' );
  var ScaleSlider = require( 'view/scale-slider/ScaleSlider' );
  var RightControlPanel = require( 'view/right-control-panel/RightControlPanel' );
  var BottomControlPanel = require( 'view/bottom-control-panel/BottomControlPanel' );

  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );
    var options = {
      scaleSlider: {
        range: {max: 1.5, min: 0.5},
        step: 0.1
      }
    };

    // add workspace
    this.addChild( new Workspace( model ) );

    // add reset button
    var resetAllButton = new ResetAllButton( function() { model.reset(); }, { scale: 0.6, x: 638 } );
    this.addChild( resetAllButton );

    // add scale slider
    this.addChild( new ScaleSlider( model, 20, 10, options.scaleSlider ) );

    // add right control panel
    this.addChild( new RightControlPanel( model, 560, 10 ) );

    // add bottom control panel
    this.addChild( new BottomControlPanel( model, 100, 410 ) );

    model.rightPanelHeightProperty.link( function( height ) {
      var resetButtonOffsetY = 18;
      resetAllButton.setY( height + resetButtonOffsetY );
    } );
  }

  return inherit( ScreenView, GravityAndOrbitsView );
} );
