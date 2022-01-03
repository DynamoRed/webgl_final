class FBXModel {
    /**
     * New simplified FBX model for our loader function
     * @param {String} name UNIQUE Model name
     * @param {String} pathTo Path to your .fbx file
     * @param {*} position Position of your model {x: 0, y: 0, z: 0}
     * @param {*} rotation Rotation of your model {x: 0, y: 0, z: 0}
     * @param {*} scale Scale of your model {x: 1, y: 1, z: 1}
     * @param {Number} baseAnimationIndex Index of the animation played by default by your model
     * @param {*} partOf THREE.Scene or THREE.Group to which your model belongs
     */
    constructor (name, pathTo, 
        position = {x:0,y:0,z:0}, 
        rotation = {rx:0,ry:0,rz:0}, 
        scale = {sx:1,sy:1,sz:1}, 
        baseAnimationIndex, partOf, material) {
            Object.assign(this, {name, pathTo, position, rotation, scale, baseAnimationIndex, partOf, material});
    }
}

class THREEDSModel {
    /**
     * New simplified 3DS model for our loader function
     * @param {String} name UNIQUE Model name
     * @param {String} pathTo Path to your .3ds file
     * @param {String} pathToTextures Path to your .3ds textures folder
     * @param {String} pathToNormalMap Path to your .3ds normal map
     * @param {*} position Position of your model {x: 0, y: 0, z: 0}
     * @param {*} rotation Rotation of your model {x: 0, y: 0, z: 0}
     * @param {*} scale Scale of your model {x: 0, y: 0, z: 0}
     * @param {Number} baseAnimationIndex Index of the animation played by default by your model
     * @param {*} partOf THREE.Scene or THREE.Group to which your model belongs
     */
    constructor (name, pathTo, pathToTextures, pathToNormalMap,
        position = {x:0,y:0,z:0}, 
        rotation = {rx:0,ry:0,rz:0}, 
        scale = {sx:1,sy:1,sz:1}, 
        baseAnimationIndex, partOf) {
            Object.assign(this, {name, pathTo, pathToTextures, pathToNormalMap, position, rotation, scale, baseAnimationIndex, partOf});
    }
}

export { FBXModel, THREEDSModel }