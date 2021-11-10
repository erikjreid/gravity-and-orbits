// Copyright 2015-2021, University of Colorado Boulder

/**
 * Container for scene selection controls.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import resetArrowImg from '../../../images/reset_arrow_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import Property from '../../../../axon/js/Property.js';
import GravityAndOrbitsScene from '../GravityAndOrbitsScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SceneSelectionControlsOptions = {
  tandem: Tandem
};

class SceneSelectionControls extends Node {

  /**
   * @param {Property.<GravityAndOrbitsScene>} sceneProperty
   * @param {Array.<GravityAndOrbitsScene>} modes
   * @param {Object} [providedOptions] - This object contains options for main node of planet menu.
   */
  constructor( sceneProperty: Property<GravityAndOrbitsScene>, modes: GravityAndOrbitsScene[], providedOptions?: Partial<SceneSelectionControlsOptions> ) {
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
      alignVertically: true,
      selectedStroke: GravityAndOrbitsColors.foregroundProperty,
      selectedLineWidth: 2,
      baseColor: 'rgba(0,0,0,0)',
      deselectedLineWidth: 0,
      buttonContentXMargin: 5,
      buttonContentYMargin: 5,
      spacing: 0,
      deselectedOpacity: 1,
      cornerRadius: 5,

      touchAreaYDilation: 0, // reduce to 0 to prevent overlap between buttons
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
   * @param {GravityAndOrbitsScene} scene
   * @param {Object} [providedOptions]
   */
  constructor( scene: GravityAndOrbitsScene, providedOptions?: Object ) {
    const options = merge( {
      content: new Node( {
        children: [
          new Image( resetArrowImg, { scale: 0.3 } )
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