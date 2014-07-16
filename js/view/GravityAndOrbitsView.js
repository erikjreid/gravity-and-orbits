// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Workspace = require( 'view/workspace/Workspace' );
  var ScaleSlider = require( 'view/scale-slider/ScaleSlider' );
  var RightControlPanel = require( 'view/right-control-panel/RightControlPanel' );
  var SpeedPushButtons = require( 'view/bottom-control-panel/SpeedPushButtons' );
  var SpeedRadioButtons = require( 'view/bottom-control-panel/SpeedRadioButtons' );
  var DayCounter = require( 'view/bottom-control-panel/DayCounter' );

  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    // add workspace
    this.addChild( new Workspace( model ) );

    // add scale slider
    this.addChild( new ScaleSlider( model, 20, 10 ) );

    var rightPanel = new RightControlPanel( model ).mutate( {right: this.layoutBounds.maxX - 5, top: 5} );
    this.addChild( rightPanel );

    var bottomInset = 5;

    // add speed check box
    this.addChild( new SpeedRadioButtons( model ).mutate( {left: 10, bottom: this.layoutBounds.maxY - bottomInset} ) );

    // add speed push buttons
    var speedPushButtons = new SpeedPushButtons( model ).mutate( {centerX: rightPanel.left / 2, bottom: this.layoutBounds.maxY - bottomInset} );
    this.addChild( speedPushButtons );

    //add day counter
    this.addChild( new DayCounter( model ).mutate( {right: rightPanel.left - 30, top: speedPushButtons.top - 2} ) );

    //The reset all button
    this.addChild( new ResetAllButton( { listener: function() { model.reset(); }, right: this.layoutBounds.maxX - 5, bottom: this.layoutBounds.maxY - 5} ) );
  }

  return inherit( ScreenView, GravityAndOrbitsView );
} );
