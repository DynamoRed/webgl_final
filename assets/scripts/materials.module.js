/* Developed by Raphael BIRON for ESGI ©️ 2021 */

import * as THREE from "../../three/build/three.module.js";

const metalText = new THREE.TextureLoader().load("./assets/textures/metal.jpg");
const Metal = new THREE.MeshStandardMaterial({ map: metalText, metalness: 1, roughness: 0 });

const blackLeatherText = new THREE.TextureLoader().load("./assets/textures/black_leather.jpg");
const BlackLeather = new THREE.MeshStandardMaterial({ map: blackLeatherText });

const pinkLeatherText = new THREE.TextureLoader().load("./assets/textures/pink_leather.jpg");
const PinkLeather = new THREE.MeshStandardMaterial({ map: pinkLeatherText });

const planksText = new THREE.TextureLoader().load("./assets/textures/planks.jpg");
planksText.wrapS = THREE.RepeatWrapping;
planksText.wrapT = THREE.RepeatWrapping;
planksText.repeat.set(5, 2.5);
const Planks = new THREE.MeshStandardMaterial({ map: planksText });

const concruitText = new THREE.TextureLoader().load("./assets/textures/concruit.jpg");
// concruitText.wrapS = THREE.RepeatWrapping;
// concruitText.wrapT = THREE.RepeatWrapping;
// concruitText.repeat.set(1, 1);
const Concruit = new THREE.MeshStandardMaterial({ map: concruitText });

const theShiningFloorText = new THREE.TextureLoader().load("./assets/textures/theshining_floor.jpg");
theShiningFloorText.wrapS = THREE.RepeatWrapping;
theShiningFloorText.wrapT = THREE.RepeatWrapping;
theShiningFloorText.repeat.set(4, 3.5);
const TheShiningFloor = new THREE.MeshStandardMaterial({ map: theShiningFloorText });

const wood1Text = new THREE.TextureLoader().load("./assets/textures/wood1.jpg");
const Wood1 = new THREE.MeshStandardMaterial({ map: wood1Text });

const marbleText = new THREE.TextureLoader().load("./assets/textures/marble.jpg");
const Marble = new THREE.MeshStandardMaterial({ map: marbleText });

const blackMarbleText = new THREE.TextureLoader().load("./assets/textures/black_marble.jpg");
const BlackMarble = new THREE.MeshStandardMaterial({ map: blackMarbleText });

const White = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0, metalness: 0, emissive: 0xe3e3e3 });
const Gray = new THREE.MeshStandardMaterial({ color: 0x5f5f5f, roughness: 0, metalness: 0 });
const DarkGray = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0, metalness: 0 });
const Indigo = new THREE.MeshStandardMaterial({ color: 0x0013ff, roughness: 0, metalness: 0 });
const Indigo2 = new THREE.MeshStandardMaterial({ color: 0x0013ff, roughness: 0, metalness: 0 });
const ChangingIndigo = new THREE.MeshStandardMaterial({ color: 0x0013ff, roughness: 0, metalness: 0 });
const Black = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0, metalness: 0 });

const indigoText = new THREE.TextureLoader().load("./assets/textures/indigo_gradient.png");
const IndigoGradient = new THREE.MeshStandardMaterial({ map: indigoText });

const mirrorText = new THREE.TextureLoader().load("./assets/textures/disco.jpg");
const Mirror = new THREE.MeshPhongMaterial({ map: mirrorText, flatShading: true, reflectivity: 1, shininess: 1 });

const Floors = {
	Planks: Planks,
	"The Shining Floor": TheShiningFloor,
	Marble: Marble,
	"Black Marble": BlackMarble,
};

const Walls = {
	Concruit: Concruit,
};

const Metals = {
	Metal: Metal,
};

const Woods = {
	"Dark Straight": Wood1,
};

const Colours = {
	White: White,
	Gray: Gray,
	DarkGray: DarkGray,
	Indigo: Indigo,
	Indigo2: Indigo2,
	ChangingIndigo: ChangingIndigo,
	Black: Black,
};

const Gradients = {
	IndigoGradient: IndigoGradient,
};

const Leathers = {
	"Black Leather": BlackLeather,
	"Pink Leather": PinkLeather,
};

const Others = {
	Mirror: Mirror,
};

export { Floors, Walls, Metals, Woods, Colours, Leathers, Others, Gradients };
