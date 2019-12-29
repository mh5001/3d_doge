class Doge {
    constructor(scene) {
        this.colors = {
            orange: new THREE.MeshLambertMaterial({ color: 0xf5be33, flatShading: true }),
            white: new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true }),
            black: new THREE.MeshLambertMaterial({ color: 0, flatShading: true }),
            pink: new THREE.MeshLambertMaterial({ color: 0xff8fb6, flatShading: true })
        }
        this.isCatching = false;
        this.scene = scene;
        this.isIdle = false;
        this.angle = 0.2;
        this.jawAngularVelo = 0.05;
        this.idleCount = 0;

        this.headPivot = new THREE.Object3D();
        this.headPivot.add(this.createHead());

        this.scene.add(this.headPivot);
        this.head.translateX(-1);
        this.headPivot.translateX(0);

        this.scene.add(this.createBody());

        this.createLegs();
        this.scene.add(this.leftLegPivot);
        this.scene.add(this.rightLegPivot);
        this.scene.add(this.leftBackLegPivot);
        this.scene.add(this.rightBackLegPivot);
        this.isThrown = false;
        this.catching = false;
    }

    rotateHead(x, y) {
        if (Math.abs(y) < 0.5) this.headPivot.rotation.x = y;
        if (Math.abs(x) < 0.5) this.headPivot.rotation.y = x + Math.PI / 2;
    }

    rotateBody(x) {
        if (Math.abs(x) < 0.3) {
            this.bodyPivot.rotation.z = -x;
            if (x > 0) {
                this.leftLegPivot.rotation.z = -x * 0.8;
                this.leftBackLegPivot.rotation.z = x;
            } else {
                this.rightLegPivot.rotation.z = -x * 0.8;
                this.rightBackLegPivot.rotation.z = x;
            } 
        }
    }

    createHead() {
        this.head = new THREE.Group();

        const faceBox = new THREE.BoxGeometry(2, 2, 2);
        
        const face = new THREE.Mesh(faceBox, this.colors.orange);

        const mouthBox = new THREE.BoxGeometry(1, 1.1, 2.1);
        
        const mouth = new THREE.Mesh(mouthBox, this.colors.white);
        mouth.position.set(-0.7, -0.5, 0);

        const snoutBox = new THREE.BoxGeometry(1, 0.7, 1);
        const snout = new THREE.Mesh(snoutBox, this.colors.orange);
        snout.position.set(-1.5, -0.2, 0);

        const jawBox = new THREE.BoxGeometry(0.9, 0.4, 0.9);
        const jaw = new THREE.Mesh(jawBox, this.colors.white);
        jaw.position.set(-0.9, -0.75, 0)
        this.jaw = new THREE.Object3D();
        this.jaw.add(jaw);
        this.jaw.position.set(-0.6, 0, 0);
        this.jaw.rotation.set(0, 0, 0.2);

        const noseBox = new THREE.BoxGeometry(0.4, 0.3, 0.4);
        const nose = new THREE.Mesh(noseBox, this.colors.black);
        nose.position.set(-1.9, 0.1, 0);

        const eyeBox = new THREE.BoxGeometry(0.01, 0.5, 0.5);
        const pupilBox = new THREE.BoxGeometry(0.04, 0.2, 0.2);

        const eyeLeft = new THREE.Mesh(eyeBox, this.colors.white);
        eyeLeft.position.set(-1, 0.5, 0.5);
        const eyeRight = new THREE.Mesh(eyeBox, this.colors.white);
        eyeRight.position.set(-1, 0.5, -0.5);
        
        const pupilLeft = new THREE.Mesh(pupilBox, this.colors.black);
        pupilLeft.position.set(-1.1, 0.4, 0.5);
        const pupilRight = new THREE.Mesh(pupilBox, this.colors.black);
        pupilRight.position.set(-1.1, 0.4, -0.5);

        const earBox = new THREE.BoxGeometry(0.2, 0.7, 0.5);
        const earInnerBox = new THREE.BoxGeometry(0.2, 0.3, 0.2);

        const earLeft = new THREE.Mesh(earBox, this.colors.orange);
        earLeft.position.set(0.6, 1.25, 0.7);
        earLeft.rotation.set(0.19, 0, 0.4);

        const earRight = new THREE.Mesh(earBox, this.colors.orange);
        earRight.position.set(0.6, 1.3, -0.6);
        earRight.rotation.z = 0.2;

        const earInnerLeft = new THREE.Mesh(earInnerBox, this.colors.pink);
        earInnerLeft.position.set(0.61, 1.15, 0.68);
        earInnerLeft.rotation.set(0.19, 0, 0.4);

        const earInnerRight = new THREE.Mesh(earInnerBox, this.colors.pink);
        earInnerRight.position.set(0.59, 1.17, -0.6);
        earInnerRight.rotation.z = 0.2;

        this.head.add(face);
        this.head.add(mouth);
        this.head.add(snout);
        this.head.add(this.jaw);
        this.head.add(nose);
        this.head.add(eyeLeft);
        this.head.add(eyeRight);
        this.head.add(pupilLeft);
        this.head.add(pupilRight);
        this.head.add(earLeft);
        this.head.add(earRight);
        this.head.add(earInnerLeft);
        this.head.add(earInnerRight);

        return this.head;
    }

    createBody() {
        this.bodyPivot = new THREE.Object3D();
        this.bodyPivot.position.set(0, -2, 0);

        const body = new THREE.Group();

        const torsoBox = new THREE.BoxGeometry(2, 3, 1);
        const torso = new THREE.Mesh(torsoBox, this.colors.orange);
        torso.position.set(0, 0, -0.5);
        torso.rotation.x = Math.PI / 10;

        const bellyBox = new THREE.BoxGeometry(1, 1.5, 1);
        const belly = new THREE.Mesh(bellyBox, this.colors.white); 
        belly.position.set(0, 0.5, -0.3);
        belly.rotation.x = Math.PI / 10;

        body.add(torso);
        body.add(belly);

        this.bodyPivot.add(body);
        return this.bodyPivot;
    }

    createLegs() {
        this.leftLegPivot = new THREE.Object3D();
        const leftLegBox = new THREE.BoxGeometry(0.7, 3, 0.7);        
        const leftLeg = new THREE.Mesh(leftLegBox, this.colors.orange);
        leftLeg.position.set(0, 1, 0);

        this.leftLegPivot.add(leftLeg);
        this.leftLegPivot.position.set(0.6, -3, 0);

        this.rightLegPivot = new THREE.Object3D();
        const rightLegBox = new THREE.BoxGeometry(0.7, 3, 0.7);
        const rightLeg = new THREE.Mesh(rightLegBox, this.colors.orange);
        rightLeg.position.set(0, 1, 0);

        this.rightLegPivot.add(rightLeg);
        this.rightLegPivot.position.set(-0.6, -3, 0);

        this.leftBackLegPivot = new THREE.Object3D();
        const leftBackLegBox = new THREE.BoxGeometry(0.7, 1.5, 1);
        const leftBackLeg = new THREE.Mesh(leftBackLegBox, this.colors.orange);
        leftBackLeg.position.set(0, 1, 0);

        this.leftBackLegPivot.add(leftBackLeg);
        this.leftBackLegPivot.position.set(1.3, -4, -0.2);

        this.rightBackLegPivot = new THREE.Object3D();
        const rightBackLegBox = new THREE.BoxGeometry(0.7, 1.5, 1);
        const rightBackLeg = new THREE.Mesh(rightBackLegBox, this.colors.orange);
        rightBackLeg.position.set(0, 1, 0);

        this.rightBackLegPivot.add(rightBackLeg);
        this.rightBackLegPivot.position.set(-1.3, -4, -0.2);

        for (let i = 0; i < 4; i++) {
            const pawBox = new THREE.BoxGeometry(0.8, 0.2, 0.8);
            const paw = new THREE.Mesh(pawBox, this.colors.orange);
            paw.position.set(i - 1.5, -3.5, 0.6);

            this.scene.add(paw);
        }
    }

    eatEffect() {
        this.mouth
    }

    idle() {
        const particleBox = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const particleMat = new THREE.MeshLambertMaterial({color: 0x0000ff});

        const particle = new THREE.Mesh(particleBox, particleMat);
        let pos = new THREE.Vector3();
        this.jaw.children[0].localToWorld(pos);

        particle.position.set(pos.x - (0.4 * (Math.round(Math.random()) * 2 - 1)), pos.y + 0.3, pos.z + 2);
        this.scene.add(particle);

        const idlingClock = setInterval(() => {
            particle.position.y -= 0.2;
            
            if (particle.position.y < -3.6) {
                clearInterval(idlingClock);
                this.scene.remove(particle);
            }
        }, 1000 / 20);
        
        if (!this.isIdle) {
            this.isIdle = true;
            this.jawing = setInterval(() => {
                this.jaw.rotation.set(0, 0, this.angle);
                this.angle += this.jawAngularVelo;
                
                if (this.angle >= 0.4) this.jawAngularVelo = -0.1;
                if (this.angle <= 0.2) {
                    this.jawAngularVelo = 0.1;
                    if (this.idleCount >= 2) {
                        clearInterval(this.jawing);
                        this.isIdle = false;
                        this.jaw.rotation.set(0, 0, this.angle = 0.2);
                        this.idleCount = 0;
                    } else {
                        this.idleCount++;
                    }
                }
            }, 1000 / 20);
        }
    }

    catchBone(bone) {
        return new Promise(resolve => {
            bone.position.y -= 0.5;
            this.jaw.rotation.set(0, 0, 0.2);
            const oldPupilGeom = this.head.children[7].geometry;

            const pupilHappyBox = new THREE.RingGeometry(0.1, 0.2, 32, 32, 0, Math.PI);

            this.head.children[7].geometry = pupilHappyBox;
            this.head.children[8].geometry = pupilHappyBox;

            this.head.children[7].rotation.y -= Math.PI / 2;
            this.head.children[8].rotation.y -= Math.PI / 2;

            setTimeout(() => {
                const jawing = setInterval(() => {
                    bone.scale.multiplyScalar(0.96);
                    this.jaw.rotation.set(0, 0, this.angle);
                    this.angle += this.jawAngularVelo;

                    if (this.angle >= 0.4) this.jawAngularVelo = -0.1;
                    if (this.angle <= 0.2) {
                        this.jawAngularVelo = 0.1;
                        if (this.idleCount >= 2) {
                            clearInterval(jawing);
                            this.isIdle = false;
                            this.isCatching = false;
                            this.jaw.rotation.set(0, 0, this.angle = 0.2);
                            this.idleCount = 0;
                            setTimeout(() => {
                                this.scene.remove(bone);
                                this.head.children[7].geometry = oldPupilGeom;
                                this.head.children[8].geometry = oldPupilGeom;

                                this.head.children[7].rotation.y += Math.PI / 2;
                                this.head.children[8].rotation.y += Math.PI / 2;
                                this.isThrown = false;

                                resolve();
                            }, 200);
                        } else {
                            this.idleCount++;
                        }
                    }
                }, 1000 / 20);
            }, 1000);
        });
    }
}
