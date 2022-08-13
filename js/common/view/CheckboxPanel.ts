// Copyright 2015-2022, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { colorProfileProperty, HBox, HBoxOptions, Image, SceneryConstants, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import iconMass_png from '../../../images/iconMass_png.js';
import pathIcon_png from '../../../images/pathIcon_png.js';
import pathIconProjector_png from '../../../images/pathIconProjector_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import GravityAndOrbitsGridNode from './GravityAndOrbitsGridNode.js';
import GravityAndOrbitsModel from '../model/GravityAndOrbitsModel.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
const FONT = new PhetFont( 18 );
const ARROW_Y_COORDINATE = -10;
const CHECKBOX_OPTIONS = {
  scale: 0.8,
  checkboxColor: GravityAndOrbitsColors.foregroundProperty,
  checkboxColorBackground: GravityAndOrbitsColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: FONT,
  fill: GravityAndOrbitsColors.foregroundProperty
};

const SPACING = 10;

const HBOX_OPTIONS = {
  maxWidth: 240,
  spacing: SPACING
};

type SelfOptions = EmptySelfOptions;

type CheckboxPanelOptions = SelfOptions & VBoxOptions;

class CheckboxPanel extends VBox {

  /**
   * @param model
   * @param [providedOptions]
   */
  public constructor( model: GravityAndOrbitsModel, providedOptions?: CheckboxPanelOptions ) {

    const children = [];
    const options = combineOptions<CheckboxPanelOptions>( { tandem: Tandem.OPTIONAL }, providedOptions );

    const gravityForceTextNode = new Text( gravityAndOrbitsStrings.gravityForce, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.gravityForceProperty } );
    const velocityTextNode = new Text( gravityAndOrbitsStrings.velocity, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.velocityProperty } );
    const massTextNode = new Text( gravityAndOrbitsStrings.mass, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.massProperty } );
    const pathTextNode = new Text( gravityAndOrbitsStrings.path, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.pathProperty } );
    const gridTextNode = new Text( gravityAndOrbitsStrings.grid, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.gridProperty } );
    const measuringTapeTextNode = new Text( gravityAndOrbitsStrings.measuringTape, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.measuringTapeProperty } );
    const optionsWithTandem = ( tandemName: string ) => merge( { tandem: options.tandem!.createTandem( tandemName ) }, CHECKBOX_OPTIONS );

    // gravity force checkbox
    children.push( new Checkbox( model.showGravityForceProperty, new HBox( merge( {
      children: [
        gravityForceTextNode,
        new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: '#4380C2' } )
      ]
    }, HBOX_OPTIONS ) ), optionsWithTandem( 'gravityForceCheckbox' ) ) );

    // velocity checkbox
    children.push( new Checkbox( model.showVelocityProperty, new HBox( merge( {
      children: [
        velocityTextNode,
        new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.VELOCITY } )
      ]
    }, HBOX_OPTIONS ) ), optionsWithTandem( 'velocityCheckbox' ) ) );

    // mass checkbox
    if ( model.showMassCheckbox ) {
      children.push( new Checkbox( model.showMassProperty, new HBox( merge( {
        children: [
          massTextNode,
          new Image( iconMass_png, { scale: 0.8 } )
        ]
      }, HBOX_OPTIONS ) ), optionsWithTandem( 'massCheckbox' ) ) );
    }

    const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );
    colorProfileProperty.lazyLink( ( profileName: string ) => {
      assert && assert( profileName === SceneryConstants.DEFAULT_COLOR_PROFILE || profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE );
      pathIconImageNode.setImage( profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE ? pathIconProjector_png : pathIcon_png );
    } );

    // path checkbox
    children.push( new Checkbox( model.showPathProperty, new HBox( merge( {
      children: [
        pathTextNode,
        pathIconImageNode
      ]
    }, HBOX_OPTIONS ) ), optionsWithTandem( 'pathCheckbox' ) ) );

    // grid checkbox
    children.push( new Checkbox( model.showGridProperty, new HBox( merge( {
      children: [
        gridTextNode,
        new GravityAndOrbitsGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
          stroke: GravityAndOrbitsColors.gridIconStrokeColorProperty,
          lineWidth: 1.5
        } )
      ]
    }, HBOX_OPTIONS ) ), optionsWithTandem( 'gridCheckbox' ) ) );

    // measuring tape checkbox
    if ( model.showMeasuringTape ) {
      const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.4 } );
      children.push( new Checkbox( model.showMeasuringTapeProperty, new HBox( combineOptions<HBoxOptions>( {
        align: 'top',
        children: [
          measuringTapeTextNode,
          measuringTapeIcon
        ]
      }, HBOX_OPTIONS ) ), optionsWithTandem( 'measuringTapeCheckbox' ) ) );
    }

    // increase the touch area of the checkboxes
    const touchAreaHeight = 32;
    for ( let i = 0; i < children.length; i++ ) {
      const checkboxNode = children[ i ];
      const bounds = checkboxNode.parentToLocalBounds( checkboxNode.bounds );
      // @ts-ignore
      checkboxNode.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    }

    super( optionize<CheckboxPanelOptions, SelfOptions, VBoxOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      children: children,
      spacing: SPACING,
      align: 'left',
      bottom: -12,
      tandem: Tandem.REQUIRED
    }, providedOptions ) );
  }
}

gravityAndOrbits.register( 'CheckboxPanel', CheckboxPanel );
export default CheckboxPanel;