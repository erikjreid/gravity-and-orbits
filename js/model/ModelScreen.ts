// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Model' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import modelMipmap from '../../mipmaps/model_icon_png.js';
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../gravityAndOrbitsStrings.js';
import ModelModel from './ModelModel.js';

const modelString = gravityAndOrbitsStrings.model;


class ModelScreen extends Screen {
  constructor( options ) {

    options = merge( {
      name: modelString,

      // @ts-ignore
      homeScreenIcon: new ScreenIcon( new Image( modelMipmap ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } )
    }, options );

    const viewTandem = options.tandem.createTandem( 'view' );
    super(
      () => new ModelModel( options.tandem.createTandem( 'model' ), viewTandem ),
      model => new GravityAndOrbitsScreenView( model, viewTandem ),
      options
    );
  }
}

gravityAndOrbits.register( 'ModelScreen', ModelScreen );
export default ModelScreen;