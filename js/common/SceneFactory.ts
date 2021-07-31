// Copyright 2014-2020, University of Colorado Boulder
// @ts-nocheck

/**
 * SceneFactory enumerates and declares the possible modes in the GravityAndOrbitsModel, such as 'Star + Planet' scene.
 * Models (and the bodies they contain) are created in SceneFactory.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Utils from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import merge from '../../../phet-core/js/merge.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Line from '../../../scenery/js/nodes/Line.js';
import Color from '../../../scenery/js/util/Color.js';
import earthImage from '../../images/earth_png.js';
import genericMoonImage from '../../images/moon_generic_png.js';
import moonImage from '../../images/moon_png.js';
import genericPlanetImage from '../../images/planet_generic_png.js';
import spaceStationImage from '../../images/space-station_png.js';
import sunImage from '../../images/sun_png.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../gravityAndOrbitsStrings.js';
import GravityAndOrbitsConstants from './GravityAndOrbitsConstants.js';
import GravityAndOrbitsScene from './GravityAndOrbitsScene.js';
import Body from './model/Body.js';
import BodyConfiguration from './model/BodyConfiguration.js';
import GravityAndOrbitsClock from './model/GravityAndOrbitsClock.js';
import ModeConfig from './model/ModeConfig.js';
import Pair from './model/Pair.js';
import BodyRenderer from './view/BodyRenderer.js';
import EarthMassReadoutNode from './view/EarthMassReadoutNode.js';
import SpaceStationMassReadoutNode from './view/SpaceStationMassReadoutNode.js';
import VectorNode from './view/VectorNode.js';
import GravityAndOrbitsModel from './model/GravityAndOrbitsModel';
import Tandem from '../../../tandem/js/Tandem';

const earthDaysString = gravityAndOrbitsStrings.earthDays;
const earthDayString = gravityAndOrbitsStrings.earthDay;
const earthMinutesString = gravityAndOrbitsStrings.earthMinutes;
const earthMinuteString = gravityAndOrbitsStrings.earthMinute;
const earthString = gravityAndOrbitsStrings.earth;
const ourMoonString = gravityAndOrbitsStrings.ourMoon;
const ourSunString = gravityAndOrbitsStrings.ourSun;
const pattern0Value1UnitsString = gravityAndOrbitsStrings.pattern[ '0value' ][ '1units' ];
const spaceStationString = gravityAndOrbitsStrings.spaceStation;

// These constants are only used in SceneFactory, and SceneFactory is used to create the specific model instantiations,
// so we keep them here instead of the model.
const SUN_RADIUS = 6.957E8; // m
const SUN_MASS = 1.989E30; // kg
const EARTH_RADIUS = 6.371E6;
const EARTH_MASS = GravityAndOrbitsConstants.EARTH_MASS;
const EARTH_PERIHELION = 147098074E3; // m, distance from the sun at the closest point
const EARTH_ORBITAL_SPEED_AT_PERIHELION = 30300; // m/s
const MOON_MASS = 7.346E22;
const MOON_RADIUS = 1727.4E3;
const MOON_SPEED_AT_PERIGEE = -1082; // m/s
const MOON_PERIGEE = 363300E3; // km, distance from earth at closet point
const MOON_X = EARTH_PERIHELION;
const MOON_Y = MOON_PERIGEE;

// see http://en.wikipedia.org/wiki/International_Space_Station
const SPACE_STATION_RADIUS = 91 / 2;
const SPACE_STATION_MASS = GravityAndOrbitsConstants.SPACE_STATION_MASS;
const SPACE_STATION_SPEED = 7706;
const SPACE_STATION_PERIGEE = 347000;

// orbital period of the space station, in seconds
// orbit determined to be 91.4 days, by inspection
const SPACE_STATION_ORBITAL_PERIOD = 91.4 * 60;

const SECONDS_PER_MINUTE = 60;
const FORCE_SCALE = VectorNode.FORCE_SCALE;
const DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

class SceneFactory {
  scenes: any[];
  static SunEarthModeConfig: any;
  static SunEarthMoonModeConfig: any;
  static PlanetMoonModeConfig: any;
  static EarthSpaceStationModeConfig: any;

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {SunEarthModeConfig} planetStar
   * @param {SunEarthMoonModeConfig} sunEarthMoon
   * @param {PlanetMoonModeConfig} earthMoon
   * @param {EarthSpaceStationModeConfig} earthSpaceStation
   * @param {Tandem} modelTandem
   * @param {Tandem} viewTandem
   * @param {Object} [options]
   */
  constructor( model, planetStar, sunEarthMoon, earthMoon, earthSpaceStation, modelTandem, viewTandem, options? ) {

    options = merge( {
      adjustMoonPathLength: false, // increase the moon path so that it matches other traces at default settings
      adjustMoonOrbit: false
    }, options );

    this.scenes = []; // @public - in the java version this class extended ArrayList, but here we have an array field

    planetStar.center();
    sunEarthMoon.center();
    earthMoon.center();
    earthSpaceStation.center();

    const readoutInEarthMasses = ( bodyNode, visibleProperty ) => new EarthMassReadoutNode( bodyNode, visibleProperty );

    // Create the actual modes (GravityAndOrbitsModes) from the specifications passed in (ModeConfigs).
    const SUN_MODES_VELOCITY_SCALE = 4.48E6;
    const starPlanetSceneTandem = modelTandem.createTandem( 'starPlanetScene' );

    const star0 = new Star( model, planetStar.sun, starPlanetSceneTandem.createTandem( 'star' ), {
      maxPathLength: 345608942000 // in km
    } );
    const planet0 = new Planet( model, planetStar.planet, starPlanetSceneTandem.createTandem( 'planet' ) );

    this.scenes.push( new GravityAndOrbitsScene(
      model,
      planetStar,
      scaledDays(),
      this.createIconImage( true, true, false, false ),
      SUN_MODES_VELOCITY_SCALE,
      readoutInEarthMasses,
      planetStar.planet.x / 2,
      starPlanetSceneTandem,
      viewTandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'starPlanetSceneView' ),
      [ star0, planet0 ],
      [ new Pair( star0, planet0, starPlanetSceneTandem.createTandem( 'starPlanetPair' ) ) ] )
    );

    // increase moon path length so that it fades away with other bodies in model coordinates (at default orbit)
    const pathLengthBuffer = options.adjustMoonPathLength ? sunEarthMoon.moon.x / 2 : 0;
    const starPlanetMoonSceneTandem = modelTandem.createTandem( 'starPlanetMoonScene' );
    const star1 = new Star( model, sunEarthMoon.sun, starPlanetMoonSceneTandem.createTandem( 'star' ), {
      maxPathLength: 345608942000 // in km
    } );
    const planet1 = new Planet( model, sunEarthMoon.planet, starPlanetMoonSceneTandem.createTandem( 'planet' ), {
      touchDilation: 2
    } );
    const moon1 = new Moon( model,
      false, // no room for the slider
      false, // so it doesn't intersect with earth mass readout
      sunEarthMoon.moon,
      starPlanetMoonSceneTandem.createTandem( 'moon' ), {
        pathLengthBuffer: pathLengthBuffer,
        touchDilation: 5
      }
    );
    this.scenes.push( new GravityAndOrbitsScene(
      model,
      sunEarthMoon,
      scaledDays(),
      this.createIconImage( true, true, true, false ),
      SUN_MODES_VELOCITY_SCALE,
      readoutInEarthMasses,
      sunEarthMoon.planet.x / 2,
      starPlanetMoonSceneTandem,
      viewTandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'starPlanetMoonSceneView' ),
      [ star1, planet1, moon1 ], [
        new Pair( star1, planet1, starPlanetMoonSceneTandem.createTandem( 'starPlanetPair' ) ),
        new Pair( star1, moon1, starPlanetMoonSceneTandem.createTandem( 'starMoonPair' ) ),
        new Pair( planet1, moon1, starPlanetMoonSceneTandem.createTandem( 'planetMoonPair' ) )
      ], {
        adjustMoonOrbit: options.adjustMoonOrbit
      } ) );

    const planetMoonSceneTandem = modelTandem.createTandem( 'planetMoonScene' );
    const planet2 = new Planet( model, earthMoon.planet, planetMoonSceneTandem.createTandem( 'planet' ), {
      orbitalCenter: new Vector2( earthMoon.planet.x, earthMoon.planet.y )
    } );
    const moon2 = new Moon( model, true, true, earthMoon.moon, planetMoonSceneTandem.createTandem( 'moon' ), {
      orbitalCenter: new Vector2( earthMoon.planet.x, earthMoon.planet.y ),
      rotationPeriod: earthMoon.moon.rotationPeriod
    } );
    this.scenes.push( new GravityAndOrbitsScene(
      model,
      earthMoon,
      scaledDays(),
      this.createIconImage( false, true, true, false ),
      SUN_MODES_VELOCITY_SCALE * 0.06,
      readoutInEarthMasses,
      earthMoon.moon.y / 2,
      planetMoonSceneTandem,
      viewTandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'planetMoonSceneView' ),
      [ planet2, moon2 ],
      [ new Pair( planet2, moon2, planetMoonSceneTandem.createTandem( 'planetMoonPair' ) ) ], {
        gridCenter: new Vector2( earthMoon.planet.x, 0 )
      } ) );

    const spaceStationMassReadoutFactory = ( bodyNode, visibleProperty ) => new SpaceStationMassReadoutNode( bodyNode, visibleProperty );
    const planetSatelliteSceneTandem = modelTandem.createTandem( 'planetSatelliteScene' );
    const planet3 = new Planet( model, earthSpaceStation.planet, planetSatelliteSceneTandem.createTandem( 'planet' ), {
      maxPathLength: 35879455, // in km
      touchDilation: 0
    } );
    const satellite3 = new Satellite( model, earthSpaceStation, planetSatelliteSceneTandem.createTandem( 'satellite' ), {
      rotationPeriod: earthSpaceStation.satellite.rotationPeriod
    } );
    this.scenes.push( new GravityAndOrbitsScene(
      model,
      earthSpaceStation,
      formatMinutes,
      this.createIconImage( false, true, false, true ),
      SUN_MODES_VELOCITY_SCALE / 10000,
      spaceStationMassReadoutFactory,
      earthSpaceStation.satellite.x - earthSpaceStation.planet.x,
      planetSatelliteSceneTandem,
      viewTandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'planetSatelliteSceneView' ),
      [ planet3, satellite3 ],
      [ new Pair( planet3, satellite3, planetSatelliteSceneTandem.createTandem( 'planetSatellitePair' ) ) ], {
        gridCenter: new Vector2( earthSpaceStation.planet.x, 0 )
      } ) );
  }

  /**
   * @private
   * Creates an image that can be used for the scene icon, showing the nodes of each body in the mode.
   * @param {boolean} sun
   * @param {boolean} earth
   * @param {boolean} moon
   * @param {boolean} spaceStation
   * @returns {Image}
   */
  createIconImage( sun, earth, moon, spaceStation ) {
    const children = [
      new Image( sunImage, { visible: sun } ),
      new Image( earthImage, { visible: earth } ),
      new Image( moonImage, { visible: moon } ),
      new Image( spaceStationImage, { visible: spaceStation } )
    ];

    for ( let i = 0; i < children.length; i++ ) {
      children[ i ].setScaleMagnitude( 25 / children[ i ].width );
    }

    return new HBox( { children: children, spacing: 20, excludeInvisibleChildrenFromBounds: false } );
  }
}

class SunEarthModeConfig extends ModeConfig {
  private sun: BodyConfiguration;
  private planet: BodyConfiguration;
  constructor() {

    super( 1.25 );

    // @public
    this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
    this.planet = new BodyConfiguration(
      EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.initialMeasuringTapePosition = new Line(
      ( this.sun.x + this.planet.x ) / 3,
      -this.planet.x / 2,
      ( this.sun.x + this.planet.x ) / 3 + 80000000 * 1000,
      -this.planet.x / 2 );
    this.forceScale = FORCE_SCALE * 120;
  }

  // @protected
  getBodies() {
    return [ this.sun, this.planet ];
  }
}

// static class: SunEarthMoonModeConfig
class SunEarthMoonModeConfig extends ModeConfig {
  private sun: BodyConfiguration;
  private planet: BodyConfiguration;
  private moon: BodyConfiguration;
  constructor() {

    super( 1.25 );
    // @public
    this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
    this.planet = new BodyConfiguration(
      EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this[ 'moon' ] = new BodyConfiguration(
      MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, MOON_SPEED_AT_PERIGEE, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.initialMeasuringTapePosition = new Line(
      ( this.sun.x + this.planet.x ) / 3,
      -this.planet.x / 2,
      ( this.sun.x + this.planet.x ) / 3 + 80000000 * 1000,
      -this.planet.x / 2 );
    this.forceScale = FORCE_SCALE * 120;
  }

  // @protected
  getBodies() {
    return [ this.sun, this.planet, this.moon ];
  }
}

class PlanetMoonModeConfig extends ModeConfig {
  private planet: BodyConfiguration;
  private moon: BodyConfiguration;

  /**
   * Configuration for the Earth+Moon system.
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      moonRotationPeriod: null // rotation period for the moon in seconds, null means no rotation
    }, options );

    super( 400 );

    // We want to center the overall motion of the system, but specify the relative speed of the moon to be
    // equal to MOON_SPEED_AT_PERIGEE
    const planetVelocityX = MOON_MASS * 1082 / ( EARTH_MASS + MOON_MASS );
    const moonVelocityX = planetVelocityX - Math.abs( MOON_SPEED_AT_PERIGEE );

    // @public
    this.planet = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, planetVelocityX, 0 );
    this.moon = new BodyConfiguration( MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, moonVelocityX, 0, {
      rotationPeriod: options.moonRotationPeriod
    } );
    this.initialMeasuringTapePosition = new Line(
      this.planet.x + this.planet.radius * 2,
      -this.moon.y * 0.7,
      this.planet.x + this.planet.radius * 2 + 150000 * 1000,
      -this.moon.y * 0.7 );
    this.forceScale = FORCE_SCALE * 45;
    this.dt = DEFAULT_DT / 3;  // actual days
  }

  // @protected
  getBodies() {
    return [ this.planet, this.moon ];
  }
}

class EarthSpaceStationModeConfig extends ModeConfig {
  private planet: BodyConfiguration;
  private satellite: BodyConfiguration;
  /**
   * Static class.
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      spaceStationRotationPeriod: SPACE_STATION_ORBITAL_PERIOD // rotation period in seconds
    }, options );

    super( 21600 );

    // @public
    this.planet = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, 0, 0, 0, 0 );
    this.satellite = new BodyConfiguration( SPACE_STATION_MASS, SPACE_STATION_RADIUS,
      SPACE_STATION_PERIGEE + EARTH_RADIUS + SPACE_STATION_RADIUS, 0, 0, SPACE_STATION_SPEED, {
        rotationPeriod: options.spaceStationRotationPeriod
      } );

    // @public
    // Sampled at runtime from MeasuringTape
    const x0 = 3162119;
    this.initialMeasuringTapePosition = new Line( x0, 7680496, x0 + 3000 * 1000, 7680496 );
    this.forceScale = FORCE_SCALE * 3E13;
    this.dt = DEFAULT_DT * 9E-4;
  }

  // @protected
  getBodies() {
    return [ this.planet, this.satellite ];
  }
}

/**
 * Creates a BodyRenderer that just shows the specified image
 * @param {string} image
 * @returns {function}
 */
const getImageRenderer = image => {
  return ( body, viewDiameter ) => new BodyRenderer.ImageRenderer( body, viewDiameter, image );
};

/**
 * Creates a BodyRenderer that shows an image when at the targetMass, otherwise shows a shaded sphere
 * @param {image|mipmap} image1
 * @param {image|mipmap} image2
 * @param {number} targetMass
 * @returns {function}
 */
const getSwitchableRenderer = ( image1, image2, targetMass ) => {

  // the mass for which to use the image
  return ( body, viewDiameter ) => new BodyRenderer.SwitchableBodyRenderer(
    body,
    targetMass,
    new BodyRenderer.ImageRenderer( body, viewDiameter, image1 ), new BodyRenderer.ImageRenderer( body, viewDiameter, image2 ) );
};

/**
 * Have to artificially scale up the time readout so that Sun/Earth/Moon scene has a stable orbit with correct periods
 * @returns {function}
 */
const scaledDays = () => {
  return time => {
    const value = ( time / GravityAndOrbitsClock.SECONDS_PER_DAY );
    const units = ( value === 1 ) ? earthDayString : earthDaysString;
    return StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( value, 0 ), units );
  };
};

/**
 * Create a function that converts SI (seconds) to a string indicating elapsed minutes, used in formatting the
 * elapsed clock readout
 * @param time
 * @returns {string}
 */
const formatMinutes = time => {
  const value = ( time / SECONDS_PER_MINUTE );
  const units = ( value === 1 ) ? earthMinuteString : earthMinutesString;
  return StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( value, 0 ), units );
};

class Satellite extends Body {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {EarthSpaceStationModeConfig} earthSpaceStation
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, earthSpaceStation, tandem, options ) {
    super(
      'satellite',
      earthSpaceStation.satellite,
      Color.gray,
      Color.white,
      getImageRenderer( spaceStationImage ),
      -Math.PI / 4,
      earthSpaceStation.satellite.mass,
      spaceStationString,
      model,
      tandem,
      options
    );
  }
}

class Moon extends Body {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {boolean} massSettable
   * @param {boolean} massReadoutBelow
   * @param {BodyConfiguration} bodyConfiguration
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, massSettable, massReadoutBelow, bodyConfiguration, tandem, options ) {
    options = merge( {
      pathLengthBuffer: 0, // adjustment to moon path length so that it matches other traces at default settings
      massSettable: massSettable,
      massReadoutBelow: massReadoutBelow,
      rotationPeriod: null // rotation period in seconds, null means no rotation
    }, options );

    super(
      'moon',
      bodyConfiguration,
      Color.magenta,
      Color.white,
      getSwitchableRenderer( moonImage, genericMoonImage, bodyConfiguration.mass ),
      -3 * Math.PI / 4,
      bodyConfiguration.mass,
      ourMoonString,
      model,
      tandem,
      options
    );
  }
}

class Planet extends Body {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {BodyConfiguration} bodyConfiguration
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model: GravityAndOrbitsModel, bodyConfiguration: BodyConfiguration, tandem: Tandem, options?: any ) {
    super(
      'planet',
      bodyConfiguration,
      Color.gray,
      Color.lightGray,
      getSwitchableRenderer( earthImage, genericPlanetImage, bodyConfiguration.mass ),
      -Math.PI / 4,
      bodyConfiguration.mass,
      earthString,
      model,
      tandem,
      options
    );
  }
}

class Star extends Body {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {BodyConfiguration} bodyConfiguration
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, bodyConfiguration, tandem, options ) {
    super(
      'star',
      bodyConfiguration,
      Color.yellow,
      Color.white,
      getImageRenderer( sunImage ),
      -Math.PI / 4,
      bodyConfiguration.mass,
      ourSunString,
      model,
      tandem,
      options
    );
    // this.body = bodyConfiguration; // TODO ???
  }
}

SceneFactory.SunEarthModeConfig = SunEarthModeConfig;
SceneFactory.SunEarthMoonModeConfig = SunEarthMoonModeConfig;
SceneFactory.PlanetMoonModeConfig = PlanetMoonModeConfig;
SceneFactory.EarthSpaceStationModeConfig = EarthSpaceStationModeConfig;

gravityAndOrbits.register( 'SceneFactory', SceneFactory );
export default SceneFactory;
