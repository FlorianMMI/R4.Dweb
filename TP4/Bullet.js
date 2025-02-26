import * as THREE from 'three';

export default class Bullet extends THREE.Group {
    constructor() {
        super();
        this.Bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.2),
            new THREE.MeshLambertMaterial({ color: 0xff0000 })
        );
        this.Bullet.castShadow = true;
        this.add(this.Bullet);
        this.visible = false;
    }

    fire(robot) {
        if (this.visible) return;

        this.Bullet.position.copy(robot.position);
        this.Bullet.position.y += 1.5;
        this.Bullet.position.y = robot.rotation.y;
        this.visible = true;

    }

    update() {
        if (!this.visible) return;
        this.Bullet.position.x += Math.sin(this.Bullet.rotation.y) ;
        this.Bullet.position.z += Math.cos(this.Bullet.rotation.y) ;
        if (this.Bullet.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 100) {
            this.visible = false;
        }
    }
}
