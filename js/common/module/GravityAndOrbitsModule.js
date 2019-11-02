// Copyright 2014-2019, University of Colorado Boulder

/**
 * The GravityAndOrbitsModule has a set of "modes", one mode for each configuration of bodies (eg, Sun + Planet).
 * Each mode has its own model, canvas, clock, etc, which are used in place of this Module's data.
 * The module contains information that is shared across all modes, such as whether certain features are shown (such as
 * showing the gravitational force).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @see GravityAndOrbitsModel
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsPlayArea = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsPlayArea' );
  const ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhysicalConstants = require( 'PHET_CORE/PhysicalConstants' );
  const SpeedType = require( 'GRAVITY_AND_ORBITS/common/model/SpeedType' );

  // constants
  const G = PhysicalConstants.GRAVITATIONAL_CONSTANT;

  // TODO: Rename to "Model"
  class GravityAndOrbitsModule {

    /**
     * @param {boolean} showMeasuringTape
     * @param {function.<ModeListParameterList, Array.<GravityAndOrbitsMode>>} createModes
     * @param {number} initialModeIndex
     * @param {boolean} showMassCheckbox
     * @param {Tandem} tandem
     * @param {Tandem} viewTandem
     */
    constructor( showMeasuringTape, createModes, initialModeIndex, showMassCheckbox, tandem, viewTandem ) {

      // Properties that are common to all "modes" should live here.
      this.showGravityForceProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showGravityForceProperty' ) } );
      this.showVelocityProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showVelocityProperty' ) } );
      this.showMassProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showMassProperty' ) } );
      this.showPathProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showPathProperty' ) } );
      this.showGridProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showGridProperty' ) } );
      this.showMeasuringTapeProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showMeasuringTapeProperty' ) } );

      this.isPlayingProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'isPlayingProperty' ) } );
      this.speedTypeProperty = new EnumerationProperty( SpeedType, SpeedType.NORMAL, { tandem: tandem.createTandem( 'speedTypeProperty' ) } );

      this.gravityEnabledProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'gravityEnabledProperty' ) } );
      this.steppingProperty = new BooleanProperty( false );
      this.rewindingProperty = new BooleanProperty( false );

      // these two booleans indicate whether or not to show the checkbox for measuring tape and mass.
      // they are false for the model screen and true for the toScale screen
      this.showMassCheckbox = showMassCheckbox; // @public
      this.showMeasuringTape = showMeasuringTape; // @public

      // @private {ModeListModel}
      this.modeList = createModes( new ModeListParameterList(
        this.isPlayingProperty,
        this.gravityEnabledProperty,
        this.steppingProperty,
        this.rewindingProperty,
        this.speedTypeProperty
      ) );

      this.modeIndexProperty = new NumberProperty( initialModeIndex, {
        tandem: tandem.createTandem( 'modeIndexProperty' )
      } );
      this.modeProperty = new DerivedProperty( [ this.modeIndexProperty ], modeIndex => this.modeList.modes[ modeIndex ] );
      for ( let i = 0; i < this.modeList.modes.length; i++ ) {
        const mode = this.modeList.modes[ i ];
        mode.playAreaNode = new GravityAndOrbitsPlayArea( mode, this, viewTandem.createTandem( 'playArea' ) );
      }

      this.reset(); // TODO: is this necessary?  If so, why?
    }

    // @public
    step( dt ) {

      // limit dt to 1 so there are no large jumps
      dt = Math.min( 1, dt );

      // collision animations should proceed outside of the model step
      const bodies = this.modeProperty.get().model.bodies;
      for ( let i = 0; i < bodies.length; i++ ) {
        const body = bodies[ i ];
        if ( body.isCollidedProperty.get() ) {
          body.clockTicksSinceExplosionProperty.value += 1;
        }
      }

      if ( this.isPlayingProperty.value ) {
        this.modeProperty.value.getClock().step( dt );
      }
    }

    // @public
    getModes() {
      return this.modeList.modes.slice( 0 );
    }

    // @private
    updateActiveModule() {
      for ( let i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].activeProperty.set( this.modeList.modes[ i ] === this.modeProperty.value );
      }
    }

    /**
     * @public
     * @override
     */
    reset() {
      this.showGravityForceProperty.reset();
      this.showPathProperty.reset();
      this.showGridProperty.reset();
      this.showVelocityProperty.reset();
      this.showMassProperty.reset();
      this.isPlayingProperty.reset();
      this.speedTypeProperty.reset();
      this.showMeasuringTapeProperty.reset();
      this.gravityEnabledProperty.reset();
      this.steppingProperty.reset();
      this.rewindingProperty.reset();
      this.modeIndexProperty.reset();
      for ( let i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].reset();
      }
    }
  }

  //statics
  GravityAndOrbitsModule.G = G;

  return gravityAndOrbits.register( 'GravityAndOrbitsModule', GravityAndOrbitsModule );
} );
