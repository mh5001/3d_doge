class Bone {
    constructor (scene, doge, x, y) {
        this.dFromOrigin = 7;
        this.doge = doge;
        this.scene = scene;
        this.thrown = false;
        this.pos;

        this.createBone(x, y);
        this.scene.add(this.bone);
    }

    update(x, y) {
        const origin = new THREE.Vector3(0, 0, 0);
        const pos = new THREE.Vector3(x * 5, -y * 5, 10 - Math.abs(x * 3));
        const distance = pos.distanceTo(origin);
        const ratio = this.dFromOrigin / distance;

        this.pos = pos.multiplyScalar(ratio);
        this.bone.position.set(this.pos.x, this.pos.y, this.pos.z);

        this.bone.lookAt(0, 0, 0);
    }

    createBone(x, y) {
        let ratio = 0.1;
        this.bone = new THREE.Group();
        this.bone.scale.set(0.1 , 0.1, 0.1);
        const white = new THREE.MeshLambertMaterial({ color: 0x558f43, flatShading: true });

        const boneBox = new THREE.CubeGeometry(1, 0.5, 0.5);
        const bone = new THREE.Mesh(boneBox, white);
        const boneBox1 = new THREE.CubeGeometry(0.6, 0.6, 0.6);
        const bone1 = new THREE.Mesh(boneBox1, white);
        bone1.position.set(0.7, 0, 0);
        const boneBox2 = new THREE.CubeGeometry(0.6, 0.6, 0.6);
        const bone2 = new THREE.Mesh(boneBox2, white);
        bone2.position.set(-0.7, 0, 0);

        this.bone.add(bone);
        this.bone.add(bone1);
        this.bone.add(bone2);
        this.bone.position.set(x, -y, 10);
        this.bone.lookAt(0, 0, 0);
        let creating = setInterval(() => {
            this.bone.scale.set(ratio, ratio, ratio);
            if (ratio >= 0.9) clearInterval(creating);
            ratio += 0.05;
        }, 20);
    }

    throwBone(x, y) {
        return new Promise(resolve => {
            this.doge.catching = true;
            this.thrown = true;
            const originalD = this.dFromOrigin;
            const D = 2.5;
            let i = 0;
            const throwLoop = setInterval(() => {
                const y = Math.sin(i);
                this.dFromOrigin = (D - originalD) / Math.PI * i + originalD;
                this.update(x, y);
                this.bone.position.y = y * 5;
                this.doge.rotateHead(this.pos.x / this.dFromOrigin, this.pos.y / this.dFromOrigin);

                if (i < Math.PI) i += 0.04;
                else {
                    clearInterval(throwLoop);
                    this.doge.catchBone(this.bone).then(() => {resolve()});
                }
            }, 1000 / 60);
        });
    }
}