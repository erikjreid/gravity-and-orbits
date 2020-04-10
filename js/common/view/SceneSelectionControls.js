// Copyright 2015-2020, University of Colorado Boulder

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
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import resetArrowImg from '../../../images/reset_arrow_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColorProfile from '../GravityAndOrbitsColorProfile.js';

class SceneSelectionControls extends Node {

  /**
   * @param {Property.<GravityAndOrbitsScene>} sceneProperty
   * @param {Array.<GravityAndOrbitsScene>} modes
   * @param {Object} [options] - This object contains options for main node of planet menu.
   */
  constructor( sceneProperty, modes, options ) {
    super( options );

    const content = []; // for radio buttons
    const resetButtons = modes.map( scene => {
      content.push( { value: scene, node: scene.iconImage, tandemName: scene.radioButtonTandemName } );

      // TODO(phet-io design): These should be nested in one node, so you can hide the whole thing.  But that will be complicated.  Worth it?
      // CONSENSUS: We will feature the radio button groups, and leave the reset buttons as they are.
      // CONSENSUS: put the reset buttons under the same group if not too complicated, but don't fracture the code
      const resetButton = new PlanetModeResetButton( scene, {
        tandem: options.tandem.createTandem( scene.resetButtonTandemName )
      } );

      // link reset buttons so that only the reset button next to the selected radio button is visible
      sceneProperty.link( selectedScene => resetButton.setVisible( selectedScene === scene ) );

      return resetButton;
    } );
    const radioButtonGroup = new RadioButtonGroup( sceneProperty, content, {
      alignVertically: true,
      selectedStroke: GravityAndOrbitsColorProfile.panelTextProperty,
      selectedLineWidth: 2,
      baseColor: 'rgba(0,0,0,0)',
      deselectedLineWidth: 0,
      buttonContentXMargin: 5,
      buttonContentYMargin: 5,
      spacing: 0,
      deselectedOpacity: 1,
      cornerRadius: 5,
      touchAreaYDilation: 0, // reduce to 0 to prevent overlap between buttons
      tandem: options.tandem.createTandem( 'sceneSelectionRadioButtonGroup' )
    } );

    this.addChild( radioButtonGroup );
    this.addChild( new VBox( {
      children: resetButtons,
      left: radioButtonGroup.right + 10,
      spacing: 5,
      y: 2,
      excludeInvisibleChildrenFromBounds: false
    } ) );
    this.addChild( new HStrut( 219 ) );
  }
}

gravityAndOrbits.register( 'SceneSelectionControls', SceneSelectionControls );

class PlanetModeResetButton extends RectangularPushButton {

  /**
   * @param {GravityAndOrbitsScene} scene
   * @param {Object} [options]
   */
  constructor( scene, options ) {
    options = merge( {
      content: new Node( {
        children: [
          new Image( resetArrowImg, { scale: 0.3 } )
        ]
      } ),
      xMargin: 5,
      yMargin: 3,
      baseColor: new Color( 220, 220, 220 ),
      listener: () => scene.resetScene()
    }, options );

    super( options );
  }
}

gravityAndOrbits.register( 'PlanetModeResetButton', PlanetModeResetButton );

export default SceneSelectionControls;