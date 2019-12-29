{
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 1, 1000);
    camera.position.z = 12;
    camera.position.y = 0;
    const renderer = new THREE.WebGLRenderer({antialias: true});
    let bone;
    renderer.setClearColor(0x03cffc);
    renderer.setSize(innerWidth, innerHeight);

    window.addEventListener("resize", () => {
        renderer.setSize(innerWidth, innerHeight);
        camera.aspect = innerWidth / innerHeight;

        camera.updateProjectionMatrix();
    });
    let counter = 0;
    const doge = new Doge(scene);

    doge.rotateHead(0, 0);
    render();

    function render() {
        if (!doge.isCatching) {
            if (counter > 5) {
                if (Math.random() < 0.2) doge.idle();
                counter = 0;
            }

            counter++;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    document.body.addEventListener("mousemove", function(mouse) {
        const x = mouse.clientX / innerWidth * 2 - 1;
        const y = mouse.clientY / innerHeight * 2 - 1;
        
        if (!bone) bone = new Bone(scene, doge, x, y);
        else if (!bone.thrown) bone.update(x, y);
        if (bone.pos && !doge.isThrown) {
            doge.rotateHead(bone.pos.x / bone.dFromOrigin, -bone.pos.y / bone.dFromOrigin);
            doge.rotateBody(bone.pos.x / bone.dFromOrigin);
        }
    });

    document.addEventListener("contextmenu", evt => {evt.preventDefault();});

    document.body.addEventListener("mousedown", (mouse) => {
        const x = mouse.clientX / innerWidth * 2 - 1;
        const y = mouse.clientY / innerHeight * 2 - 1;

        if (mouse.button === 0 && !doge.isThrown) {
            if(bone) {
                doge.isThrown = true;
                doge.isCatching = true;
                doge.jaw.rotation.set(0, 0, 0.4);
                clearInterval(doge.jawing);

                bone.throwBone(x, y).then(() => {
                    doge.isThrown = false;
                    doge.isCatching = false;
                    doge.isIdle = true;
                    counter = 0;
                    bone = null;
                });
            }
        }
    });

    letThereBeLight();
    letThereBeFloor();

    document.body.appendChild(renderer.domElement);
    function letThereBeLight() {
        const backlight = new THREE.AmbientLight(0xffffff, 0.5);
        backlight.castShadow = true;

        const directionLight = new THREE.SpotLight(0xffffff);
        directionLight.position.set(0, 20, 20);
        directionLight.castShadow = true;
        directionLight.lookAt(0, 0, 0);
        scene.add(backlight);
        scene.add(directionLight);
    }

    function letThereBeFloor() {
        const floorBox = new THREE.PlaneBufferGeometry(100, 100);
        const floorMat = new THREE.MeshLambertMaterial({color: 0xffffff, flatShading: true});

        const floor = new THREE.Mesh(floorBox, floorMat);
        floor.rotateX(-Math.PI / 2);
        floor.position.y = -3.6;
        floor.receiveShadow = true;
        scene.add(floor);
    }
}