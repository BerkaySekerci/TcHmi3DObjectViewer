// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.54/runtimes/native1.12-tchmi/TcHmi.d.ts" />

/*
 * Generated 12/13/2023 2:52:06 PM
 * Copyright (C) 2023
 */
var TcHmi;
(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    let Controls;
    (function (/** @type {globalThis.TcHmi.Controls} */ Controls) {
        let F_3DObjectViewer;
        (function (F_3DObjectViewer) {
            class ObjectViewer3D extends TcHmi.Controls.System.TcHmiControl {

                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                    this.__container;
                    this.__camera;
                    this.__controls;
                    this.__renderer;
                    this.__scene;
                    this.__model;
                    this.__mesh;
                    this.__mixers = [];
                    this.__clock = new THREE.Clock();
                    this.__folderPath = TcHmi.Environment.getControlBasePathEx(this);
                    this.__file;
                    this.__setAnimation;
                    this.__3DObjectPosition;
                    this.__positioningObject;
                    this.__renderingSettings;
                    this.__targetPositions;
                }

                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_F_3DObjectViewer_ObjectViewer3D-Template');
                    this.__container = this.__elementTemplateRoot[0];

                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    // Call __previnit of base class
                    super.__previnit();
                }

                __init() {
                    super.__init();
                }

                __attach() {
                    super.__attach();

                    // create a Scene
                    this.__scene = new THREE.Scene();

                    this.__scene.background = new THREE.Color(0x8FBCD4);

                    this.__createCamera();
                    this.__createControls();
                    this.__createLights();
                    this.__loadModels();
                    this.__createRenderer();

                    setInterval(() => {
                        this.__play();
                    }, 50)
                }

                __detach() {
                    super.__detach();
                }

                destroy() {
                    if (this.__keepAlive) {
                        return;
                    }
                    super.destroy();
                }

                __createCamera() {
                    if (this.__renderingSettings != null) {
                        this.__camera = new THREE.PerspectiveCamera(this.__renderingSettings.FOV, this.__container.clientWidth / this.__container.clientHeight, this.__renderingSettings.Near, this.__renderingSettings.Far);
                    } else {
                        this.__camera = new THREE.PerspectiveCamera(50, this.__container.clientWidth / this.__container.clientHeight, 0.1, 100000);
                    }

                    if (this.__positioningObject != null) {
                        this.__camera.position.set(this.__positioningObject.PositionX, this.__positioningObject.PositionY, this.__positioningObject.PositionZ);
                    } else {
                        this.__camera.position.set(0, 0, 200);
                    }
                }

                __createControls() {
                    this.__controls = new THREE.OrbitControls(this.__camera, this.__container);
                    if (this.__targetPositions != null) {
                        this.__controls.target = new THREE.Vector3(this.__targetPositions.TargetX, this.__targetPositions.TargetY, this.__targetPositions.TargetZ);
                        this.__controls.update();
                    } else {
                        this.__controls.target = new THREE.Vector3(0, 0, 100);
                        this.__controls.update();
                    }
                }

                __createLights() {
                    const ambientLight = new THREE.HemisphereLight(
                        0xddeeff, // sky color
                        0x202020, // ground color
                        5, // intensity
                    );

                    const mainLight = new THREE.DirectionalLight(0xffffff, 5);
                    mainLight.position.set(10, 20, 10);

                    this.__scene.add(ambientLight, mainLight);
                }

                __loadModels() {

                    const loader = new THREE.GLTFLoader();

                    // A reusable function to set up the models. We're passing in a position parameter
                    // so that they can be individually placed around the scene
                    const onLoad = (gltf, position) => {

                        this.__model = gltf.scene.children[0];
                        this.__model.position.copy(position);

                        const animation = gltf.animations[0];

                        const mixer = new THREE.AnimationMixer(this.__model);
                        this.__mixers.push(mixer);

                        if (this.__setAnimation == true) {
                            const action = mixer.clipAction(animation);
                            action.play();
                        }


                        this.__scene.add(this.__model);

                    };

                    // the loader will report the loading progress to this function
                    const onProgress = () => { };

                    // the loader will send any error messages to this function, and we'll log
                    // them to to console
                    const onError = (errorMessage) => { console.log(errorMessage); };

                    // load the first model. Each model is loaded asynchronously,
                    // so don't make any assumption about which one will finish loading first

                    const objectPosition = new THREE.Vector3(0, 0, 0);
                    loader.load(this.__file, gltf => onLoad(gltf, objectPosition), onProgress, onError);

                }

                __createRenderer() {
                    this.__renderer = new THREE.WebGLRenderer({ antialias: true });
                    this.__renderer.setSize(this.__container.clientWidth, this.__container.clientHeight);

                    this.__renderer.setPixelRatio(window.devicePixelRatio);

                    this.__renderer.gammaFactor = 2.2;
                    //this.__renderer.gammaOutput = true;

                    this.__renderer.physicallyCorrectLights = true;

                    this.__container.appendChild(this.__renderer.domElement);
                }

                __play() {
                    this.__render();
                    this.__update();
                }

                __render() {
                    this.__renderer.render(this.__scene, this.__camera);
                }

                __update() {
                    const delta = this.__clock.getDelta();

                    for (const mixer of this.__mixers) {
                        mixer.update(delta);
                    }
                }

                setCustomFile(val) {
                    this.__file = val;
                    if (this.__scene != undefined) {
                        this.__scene.remove(this.__model);
                        this.__loadModels();
                    }
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'CustomFile' });
                }

                getCustomFile() {
                    return this.__file;
                }

                setSetGlbAnimation(val) {
                    this.__setAnimation = val;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'SetGlbAnimation' });
                }

                getSetGlbAnimation() {
                    return this.__setAnimation;
                }

                setCameraPosition(val) {
                    this.__positioningObject = val;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'CameraSettings' });
                    if (this.__positioningObject != null) {
                        this.__createCamera();
                        this.__createControls();
                    }
                }

                getCameraPosition() {
                    return this.__positioningObject;
                }

                setRenderingSettings(val) {
                    this.__renderingSettings = val;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'RenderingSettings' });
                    if (this.__renderingSettings != null) {
                        this.__createCamera();
                        this.__createControls();
                    }
                }

                getRenderingSettings() {
                    return this.__renderingSettings;
                }

                setTargetPositions(val) {
                    this.__targetPositions = val;
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TargetPositions' });
                    if (this.__targetPositions != null) {
                        this.__createControls();
                    }
                }

                getTargetPositions() {
                    return this.__targetPositions;
                }

            }
            F_3DObjectViewer.ObjectViewer3D = ObjectViewer3D;
        })(F_3DObjectViewer = Controls.F_3DObjectViewer || (Controls.F_3DObjectViewer = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));

/**
 * Register Control
 */
TcHmi.Controls.registerEx('ObjectViewer3D', 'TcHmi.Controls.F_3DObjectViewer', TcHmi.Controls.F_3DObjectViewer.ObjectViewer3D);
