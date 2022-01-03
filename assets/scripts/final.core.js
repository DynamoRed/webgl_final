/* Developed by Raphael BIRON & Matthieu AUBRY for ESGI ©️ 2021 */

/**
 * ----==== PATCH NOTE ====----
 * Adding a loading screen
 * Redo all scene
 * Make lights react to music
 */

/**
 * Load modules and libs
 */
import * as THREE from '../../three/build/three.module.js';
import { FirstPersonControls } from '../../three/examples/jsm/controls/FirstPersonControls.js';
import { TWEEN } from "../../three/examples/jsm/libs/tween.module.min.js";
import { GUI } from '../../three/examples/jsm/libs/dat.gui.module.js';
import Stats from '../../three/examples/jsm/libs/stats.module.js';
import { PositionalAudioHelper } from '../../three/examples/jsm/helpers/PositionalAudioHelper.js';
import { FBXLoader } from '../../three/examples/jsm/loaders/FBXLoader.js';
import { TDSLoader } from '../../three/examples/jsm/loaders/TDSLoader.js';
import { FBXModel, THREEDSModel } from '../classes/ModelsLoader.js';
import { Notice } from '../classes/Notice.js';
import { LoadingScreen } from '../classes/LoadingScreen.js';
import { EscapeScreen } from '../classes/EscapeScreen.js';
/**
 * Load our materials
 */
import * as MATERIALS from './materials.module.js';

/**
 * Globals vars
 */
let i;
let camera, scene, renderer, controls, delta, clock, manager, escapeScreen;
let gui, stats;
let mixers = [], fbxModels = [];
let guiModes = [];
let actualMode = "Normal";
let maxAnalyserData = 0, frameCount = 0, canInc = true;
let stageTopFlatLightsMats = [MATERIALS.Colours.DarkGray, MATERIALS.Colours.DarkGray, MATERIALS.Colours.DarkGray, MATERIALS.Colours.White, MATERIALS.Colours.DarkGray, MATERIALS.Colours.DarkGray];
let stageTopFlatLightsMats2 = [MATERIALS.Colours.DarkGray, MATERIALS.Colours.DarkGray, MATERIALS.Colours.DarkGray, MATERIALS.Colours.White, MATERIALS.Colours.DarkGray, MATERIALS.Colours.DarkGray];

/**
 * Configuration
 */
let displayAxes = false; // Hide/show axes
let displayHelpers = false; // Hide/show helpers
let animationStatus = true; // Animation running or not

/**
 * Elements of our scene
 */
let meshes = new Array();
let floor, stage, stageOutline, stageTopRing;
let ambientLight, stageTopFlatLights = new Array();
let axesHelper, audioHelper;
let listener, audioLoader, audioMusic, audioApplauses, audioAnalyser;

init();
animate();

function init(){
    let loadingScreen = new LoadingScreen();
    manager = new THREE.LoadingManager(() => {loadingScreen.ready();});

    initMisc();
    initAudio();
    initLights();
    initMeshes();
    initHelpers();
    initScene();
    initModels(
        new FBXModel("Dancing Male",
            "./assets/models/fbx/dancing_male.fbx",
            { x: 0, y: 25, z: 50 },
            { rx: 0, ry: 0, rz: 0 },
            { sx: .85, sy: .85, sz: .85 },
            0),
        new FBXModel("First Speaker",
            "./assets/models/fbx/speaker.fbx",
            { x: -100, y: 25, z: -100 },
            { rx: 0, ry: 150, rz: 0 },
            { sx: 25, sy: 25, sz: 25 }, null, scene, MATERIALS.Colours.DarkGray),
        new FBXModel("Second Speaker",
            "./assets/models/fbx/speaker.fbx",
            { x: 100, y: 25, z: -100 },
            { rx: 0, ry: 120, rz: 0 },
            { sx: 25, sy: 25, sz: 25 }, null, scene, MATERIALS.Colours.DarkGray),
        new THREEDSModel("Circle Trus",
            "./assets/models/3ds/circle_truss/circle_truss.3ds",
            "./assets/models/3ds/circle_truss/tex/",
            "./assets/models/3ds/circle_truss/tex/alu.jpg",
            { x: 0, y: 450, z: 0 },
            { rx: -90, ry: 0, rz: 0 },
            { sx: 2.5, sy: 2.5, sz: 2.5 },
            0),
    );
}

function animate(){
    requestAnimationFrame(animate);
    
    delta = clock.getDelta();

    if(animationStatus) for(let i = 0; i < mixers.length; i++) mixers[i].update(delta);

    stats.update();
    if(!escapeScreen.state) controls.update(delta);
    TWEEN.update();

    const analyserData = Math.round(audioAnalyser.getAverageFrequency());
    if(maxAnalyserData < analyserData) maxAnalyserData = analyserData;

    if(analyserData >= 50 && canInc){ frameCount++; canInc = false; setTimeout(() => {canInc = true}, 150); }

    MATERIALS.Colours.Indigo.emissive.r -= 1;
    MATERIALS.Colours.Indigo2.emissive.g -= 1;
    MATERIALS.Colours.White.emissive.set(0x000000);

    for(let i = 0; i < 16; i++){
        if(stageTopFlatLights[i].position.y < 450) stageTopFlatLights[i].position.y += .05;
    }

    if(analyserData != 0){
        stageOutline.material.emissive.r = analyserData / 128;
        if(frameCount%2==0){ 
            MATERIALS.Colours.Indigo.emissive.r = analyserData / 64; 
            for(let i = 0; i < 16; i+=2){
                if(stageTopFlatLights[i].position.y > 425 && analyserData > 25) stageTopFlatLights[i].position.y -= .1;
            }
        } else { 
            MATERIALS.Colours.Indigo2.emissive.g = analyserData / 64; 
            for(let i = 1; i < 16; i+=2){
                if(stageTopFlatLights[i].position.y > 425 && analyserData > 25) stageTopFlatLights[i].position.y -= .1;
            }
        }
    }

    guiModes.forEach(modeController => {
        const modeControllerName = modeController.property.toLowerCase().replace('mode', '');
        if(modeControllerName == actualMode.toLocaleLowerCase()){
            modeController.setActive();
        } else {
            modeController.setInactive();
        }
    })

    render();
}

function render(){
    renderer.render(scene, camera);
}

/** 
 * Setting up miscellaneous things (Camera, Scene, Renderer, Controls, etc...)
 */
function initMisc(){
    new Notice(`🕑 Miscellaneous initialization...`);

    escapeScreen = new EscapeScreen();

    clock = new THREE.Clock();

    /*
    * Setting up the camera and the scene
    */
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 7500 );
    camera.position.set(0, 100, 800);

    scene = new THREE.Scene();

    /*
    * Renderer section
    */
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    document.body.appendChild(renderer.domElement);

    /*
    * Setting up FirstPersonControls module
    */
    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 750;
    controls.lookSpeed = .3;

    /*
    * Events
    */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.handleResize();
    });

    window.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') escapeScreen.permut();
    });


    /*
    * Init Stats
    */
    stats = new Stats();
    document.body.appendChild(stats.dom);

    /*
    * Init GUI
    */
    gui = new GUI({width: 325});

    new Notice(`✅ Miscellaneous successfully initialized`);

    buildGUI();
}

/**
 * Setting up audio functionnalities
 */
function initAudio(){
    new Notice(`🕑 Audio initialization...`);

    listener = new THREE.AudioListener();
    camera.add(listener);

    audioMusic = new THREE.PositionalAudio(listener);

    audioLoader = new THREE.AudioLoader();
    audioLoader.load("./assets/musics/eiffel_65_blue_remix.mp3", buffer => {
        audioMusic.setBuffer(buffer);
        audioMusic.setLoop(true);
        audioMusic.setVolume(1);
        audioMusic.setRefDistance(300);
    });

    audioApplauses = new THREE.Audio(listener);

    audioLoader = new THREE.AudioLoader();
    audioLoader.load("./assets/musics/applauses.mp3", function (buffer) {
        audioApplauses.setBuffer(buffer);
        audioApplauses.setLoop(true);
        audioApplauses.setVolume(.05);
    });

    audioAnalyser = new THREE.AudioAnalyser(audioMusic);
    
    new Notice(`✅ Audio successfully initialized`);
}


/**
 * Animate one light by switching angle and radius
 */
function tween(light) {
    // new TWEEN.Tween(light)
    //     .to({penumbra: Math.random() + 1},
    // 		Math.random() * 3000 + 2000)
    // 	.easing(TWEEN.Easing.Quadratic.Out)
    // 	.start();

    new TWEEN.Tween(light.position)
        .to({x: Math.random() * 1200 - 400, y: Math.random() * 400 + 600, z: Math.random() * 1200 - 600},
            Math.random() * 3000 + 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

/** 
 * Setting up lights
 */
function initLights(){
    new Notice(`🕑 Lights initialization...`);

    ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    new Notice(`✅ Lights successfully initialized`);
}

/** 
 * Setting up meshes geometries, materials, positions, etc...
 */
function initMeshes(){
    new Notice(`🕑 Meshes initialization...`);
    
    /*
    * Create the floor mesh
    */
    const floorGeo = new THREE.BoxGeometry(10000, .1, 10000);
    floor = new THREE.Mesh(floorGeo, MATERIALS.Colours.Black);
    floor.receiveShadow = true;

    floor.position.y = -25;

    const stageGeo = new THREE.CylinderGeometry(200, 200, 50, 64);
    stage = new THREE.Mesh(stageGeo, MATERIALS.Colours.DarkGray);
    stage.receiveShadow = true;
    stage.castShadow = true;
    meshes.push(stage);

    const stageOutlineGeo = new THREE.CylinderGeometry(225, 225, 49.5, 64);
    stageOutline = new THREE.Mesh(stageOutlineGeo, MATERIALS.Colours.White);
    stageOutline.receiveShadow = true;
    stageOutline.castShadow = true;
    meshes.push(stageOutline);

    const stageTopRingGeo = new THREE.CylinderGeometry(400, 350, 100, 64, 8, true);
    stageTopRing = new THREE.Mesh(stageTopRingGeo, MATERIALS.Gradients.IndigoGradient);
    stageTopRing.receiveShadow = true;
    stageTopRing.castShadow = true;
    stageTopRing.material.side = THREE.DoubleSide;
    meshes.push(stageTopRing);

    stageTopRing.position.y = 500;

    const stageTopFlatLightGeo = new THREE.BoxGeometry(125, 5, 15);

    for(let i = 0; i < 16; i++){
        let flatLight = new THREE.Mesh(stageTopFlatLightGeo, i%2 == 0 ? stageTopFlatLightsMats : stageTopFlatLightsMats2);
        flatLight.receiveShadow = true;
        flatLight.castShadow = true;
        flatLight.position.y = 450;
        flatLight.rotation.y = THREE.Math.degToRad((360/16)*(i+1));
        flatLight.translateX(150);
        meshes.push(flatLight);
        stageTopFlatLights.push(flatLight)
    }

    new Notice(`✅ Meshes successfully initialized`);
}

/**
 * Setting up all models 
 */
function initModels(...models){
    new Notice(`🕑 Models initialization...`);
    
    models.forEach((model, idx) => {
        new Notice(`📥 Receiving model n°${idx}`);

        if(!model.partOf) model.partOf = scene;
        
        new Notice(`🕑 Loading model: '${model.name}'`);

        if(model.pathTo.endsWith(".fbx")){
            new FBXLoader(manager).load(model.pathTo, obj => {
                let mixer = new THREE.AnimationMixer(obj);
    
                if(model.baseAnimationIndex != undefined){
                    const action = mixer.clipAction(obj.animations[model.baseAnimationIndex]);
                    action.play();
                }
        
                obj.traverse(child => {
                    if (child.isMesh){
                        if(model.material) child.material = model.material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
        
                model.partOf.add(obj);
                obj.position.set(model.position.x, model.position.y, model.position.z);
                obj.rotation.set(THREE.Math.degToRad(model.rotation.rx), THREE.Math.degToRad(model.rotation.ry), THREE.Math.degToRad(model.rotation.rz));
                obj.scale.set(model.scale.sx, model.scale.sy, model.scale.sz);
    
                mixers.push(mixer);
                fbxModels[model.name] = obj;
    
                new Notice(`✅ Successfully load model: '${model.name}'`);
            });
        } else if(model.pathTo.endsWith(".3ds")){
            new TDSLoader(manager).setResourcePath(model.pathToTextures)
            .load(model.pathTo, obj => {
                obj.traverse(child => {
                    if (child.isMesh){
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material = MATERIALS.Metals.Metal;
                    }
                });

                obj.position.set(model.position.x, model.position.y, model.position.z);
                obj.rotation.set(THREE.Math.degToRad(model.rotation.rx), THREE.Math.degToRad(model.rotation.ry), THREE.Math.degToRad(model.rotation.rz));
                obj.scale.set(model.scale.sx, model.scale.sy, model.scale.sz);
                model.partOf.add(obj);
            });
        }
    })
}

/** 
 * Adding meshes to the scene and generate Legs
 */
function initScene(){
    new Notice(`🕑 Scene initialization...`);

    meshes.forEach(m => scene.add(m));
    
    new Notice(`✅ Scene successfully initialized`);
}

/** 
 * Setting up helpers
 */
function initHelpers(){
    new Notice(`🕑 Helpers initialization...`);

    axesHelper = new THREE.AxesHelper(750);
    if(displayAxes) scene.add(axesHelper);

    audioHelper = new PositionalAudioHelper(audioMusic);

    new Notice(`✅ Helpers successfully initialized`);
}

/**
 * Setting up GUI
 */
function buildGUI(){
    new Notice(`📂 Building GUI...`);

    const settings = {
        'normalMode': () => { switchingMode("normal") },
        'discoMode': () => { switchingMode("disco") },
        'debug' : displayHelpers,
        'pauseAnim': !animationStatus,
        'displayAxes' : displayAxes,
    };

    let guiFolders = [];

    const modesGUIFolder = gui.addFolder( 'Running Modes' );
    const globalGUIFolder = gui.addFolder( 'Global' );

    guiFolders.push({color: '#FFCF76', folder: modesGUIFolder});
    guiFolders.push({color: '#FF7676', folder: globalGUIFolder});

    guiModes.push(modesGUIFolder.add(settings, 'normalMode').name('🙂 Normal'));
    guiModes.push(modesGUIFolder.add(settings, 'discoMode').name('🥳 Disco'));

    guiModes.forEach(mode => {
        mode.classList1 = mode.domElement.parentElement.parentElement.classList;
        mode.classList2 = mode.domElement.previousElementSibling.classList;

        mode.setInactive = () => { mode.classList2.add('control-inactive'); };
        mode.setActive = () => { mode.classList2.remove( 'control-inactive' ); };
    })

    modesGUIFolder.add(settings, 'debug').name('🛠️ Debug').onChange(() => {
        if(!displayHelpers){
            audioMusic.add(audioHelper);
        } else {
            audioMusic.remove(audioHelper);
        }
        displayHelpers = !displayHelpers;
    });

    globalGUIFolder.add(settings, 'pauseAnim').name('⏯️ Pause Animation').onChange(() => {
        animationStatus = !animationStatus;
    });

    globalGUIFolder.add(settings, 'displayAxes').name('Display Axes').onChange(() => {
        if(!displayAxes) scene.add(axesHelper);	
        else scene.remove(axesHelper);
        displayAxes = !displayAxes;
    }); 

    guiFolders.forEach(gFolder => {
        gFolder.folder.domElement.firstChild.childNodes.forEach(el => {
            el.style.borderLeft = `3px solid ${gFolder.color}`;
            if(el.classList.contains('has-slider')){
                el.firstChild.childNodes[1].firstChild.firstChild.style.color = gFolder.color;
                el.firstChild.childNodes[1].childNodes[1].firstChild.style.background = gFolder.color;
            }
        })
    });

    modesGUIFolder.open();
    gui.open();

    new Notice(`✅ Successfully building GUI`);
}

/**
 * Switching between modes (Default: Normal)
 * @param {String} mode Desired mode 
 */
function switchingMode(mode){
    if(actualMode.toLowerCase() == mode) return;

    switch(mode){
        case 'disco':
                audioMusic.play();
                audioApplauses.play();
                new Notice(`▶️ Playing music: 'Blue (Remix), Eiffel 65'`);
                // scene.add(disco.group);
                // scene.remove(mainSpotLight);
                new Notice(`🥳 It's time for a Disco Party !`);
                actualMode = "Disco";
                stageTopFlatLightsMats[3] = MATERIALS.Colours.Indigo;
                stageTopFlatLightsMats2[3] = MATERIALS.Colours.Indigo2;
                stageOutline.material = MATERIALS.Colours.ChangingIndigo;
            break;
        
        case 'normal':
        default:
            audioMusic.pause();
            audioApplauses.pause();
                new Notice(`⏸️ Pausing all musics !`);
                // scene.remove(disco.group);
                // scene.add(mainSpotLight);
                new Notice(`😐 Disabling ${actualMode} Mode`);
                actualMode = "Normal";
                stageTopFlatLightsMats[3] = MATERIALS.Colours.White;
                stageTopFlatLightsMats2[3] = MATERIALS.Colours.White;
                stageOutline.material = MATERIALS.Colours.White;
            break;
    }
}

/**
 * Generate a random int in a range
 * @param {Number} min Minimum int (inclusive)
 * @param {Number} max Maximum int (inclusive)
 * @returns {Number} int
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}