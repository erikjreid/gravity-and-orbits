// Copyright 2015-2022, University of Colorado Boulder

/**
 * Container for scene selection controls.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Color, HStrut, Image, Node, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import resetArrow_png from '../../../../scenery-phet/images/resetArrow_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import Property from '../../../../axon/js/Property.js';
import GravityAndOrbitsScene from '../GravityAndOrbitsScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SceneSelectionControlsOptions = {
  tandem: Tandem;
};

class SceneSelectionControls extends Node {

  /**
   * @param sceneProperty
   * @param modes
   * @param [providedOptions] - This object contains options for main node of planet menu.
   */
  public constructor( sceneProperty: Property<GravityAndOrbitsScene>, modes: GravityAndOrbitsScene[], providedOptions?: Partial<SceneSelectionControlsOptions> ) {
    super( providedOptions );
    const options: SceneSelectionControlsOptions = merge( { tandem: Tandem.OPTIONAL }, providedOptions ) as SceneSelectionControlsOptions;

    const resetButtons = modes.map( scene => {

      // For the PhET-iO design, we decided to feature the radio button group and leave the reset buttons separate.
      const sceneResetButton = new SceneResetButton( scene, {
        tandem: options.tandem.createTandem( scene.resetButtonTandemName )
      } );

      // link reset buttons so that only the reset button next to the selected radio button is visible
      sceneProperty.link( selectedScene => sceneResetButton.setVisible( selectedScene === scene ) );

      return sceneResetButton;
    } );

    const content = modes.map( scene => {
      return ( { value: scene, node: scene.iconImage, tandemName: scene.radioButtonTandemName } );
    } );

    const radioButtonGroup = new RectangularRadioButtonGroup( sceneProperty, content, {
      // @ts-ignore TODO: unknown option?
      alignVertically: true,
      spacing: 0,
      touchAreaYDilation: 0, // reduce to 0 to prevent overlap between buttons
      radioButtonOptions: {
        baseColor: 'rgba(0,0,0,0)',
        cornerRadius: 5,
        xMargin: 5,
        yMargin: 5,
        buttonAppearanceStrategyOptions: {
          selectedStroke: GravityAndOrbitsColors.foregroundProperty,
          selectedLineWidth: 2,
          deselectedLineWidth: 0
        }
      },
      tandem: options.tandem.createTandem( 'sceneSelectionRadioButtonGroup' ),

      // Keep aligned with reset buttons, see https://github.com/phetsims/gravity-and-orbits/issues/348
      excludeInvisibleChildrenFromBounds: false
    } );

    this.addChild( radioButtonGroup );
    this.addChild( new VBox( {
      children: resetButtons,
      left: radioButtonGroup.right + 10,
      spacing: 5,
      y: 2,

      // Keep aligned with scene radio buttons, see https://github.com/phetsims/gravity-and-orbits/issues/348
      excludeInvisibleChildrenFromBounds: false
    } ) );
    this.addChild( new HStrut( 219 ) );
  }
}

gravityAndOrbits.register( 'SceneSelectionControls', SceneSelectionControls );

class SceneResetButton extends RectangularPushButton {

  /**
   * @param scene
   * @param [providedOptions]
   */
  public constructor( scene: GravityAndOrbitsScene, providedOptions?: RectangularPushButtonOptions ) {
    const options = optionize<RectangularPushButtonOptions, EmptySelfOptions, RectangularPushButtonOptions>()( {
      content: new Node( {
        children: [
          new Image( resetArrow_png, { scale: 0.3 } )
        ]
      } ),
      xMargin: 5,
      yMargin: 3,
      baseColor: new Color( 220, 220, 220 ),
      listener: () => scene.resetScene()
    }, providedOptions );

    super( options );
  }
}

gravityAndOrbits.register( 'SceneResetButton', SceneResetButton );

export default SceneSelectionControls;