// Copyright 2016-2022, University of Colorado Boulder

/**
 * The 'To Scale' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import { Image } from '../../../scenery/js/imports.js';
import toScaleIcon_png from '../../mipmaps/toScaleIcon_png.js';
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../gravityAndOrbitsStrings.js';
import ToScaleModel from './ToScaleModel.js';
import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';

const toScaleString = gravityAndOrbitsStrings.toScale;

type ScreenOptions = {
  backgroundColorProperty?: ProfileColorProperty;
  tandem: Tandem;
} & PhetioObjectOptions;

class ToScaleScreen extends Screen<ToScaleModel, GravityAndOrbitsScreenView> {
  constructor( providedOptions?: ScreenOptions ) {
    const options = merge( {
      name: toScaleString,

      homeScreenIcon: new ScreenIcon( new Image( toScaleIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } )
    }, providedOptions ) as ScreenOptions;

    const viewTandem = options.tandem.createTandem( 'view' );
    super(
      () => new ToScaleModel( options.tandem.createTandem( 'model' ), viewTandem ),
      model => new GravityAndOrbitsScreenView( model, viewTandem ),
      options
    );
  }
}

gravityAndOrbits.register( 'ToScaleScreen', ToScaleScreen );
export default ToScaleScreen;