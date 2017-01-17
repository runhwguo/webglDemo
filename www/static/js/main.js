let scene, renderer, camera;
let target = new THREE.Vector3();   //相机焦点
let lon = 90, lat = 0;// 经度 维度
let phi = 0, theta = 0;
let touchX, touchY;

function init() {
    /**
     * 创建场景
     * @type {THREE.Scene}
     */
    scene = new THREE.Scene();

    /**
     * 添加相机
     * @type {THREE.PerspectiveCamera}
     */
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    /**
     * 添加一个渲染器
     * @type {THREE.CSS3DRenderer}
     */
    renderer = new THREE.CSS3DRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    /**
     *正方体的6个面的资源及相关（坐标、旋转等）设置
     */
    let pic = '/static/img/pantry';
    let sides = [
        {url: `${pic}/front.jpg`, position: [-512, 0, 0], rotation: [0, Math.PI / 2, 0]}, // 右
        {url: `${pic}/back.jpg`, position: [512, 0, 0], rotation: [0, -Math.PI / 2, 0]}, // 左
        {url: `${pic}/top.jpg`, position: [0, 512, 0], rotation: [Math.PI / 2, 0, Math.PI]}, // 顶
        {url: `${pic}/bottom.jpg`, position: [0, -512, 0], rotation: [-Math.PI / 2, 0, Math.PI]}, // 底
        {url: `${pic}/left.jpg`, position: [0, 0, 512], rotation: [0, Math.PI, 0]},// 里
        {url: `${pic}/right.jpg`, position: [0, 0, -512], rotation: [0, 0, 0]} // 外
    ];

    for (let i = 0; i < sides.length; i++) {
        let side = sides[i];
        let element = document.createElement('section');
        document.body.appendChild(element);
        element.id = 'section_' + i;
        let imgElement = document.createElement('img');
        imgElement.width = 1026; // 2 pixels extra to close the gap.
        imgElement.height = 1026;
        imgElement.src = side.url;
        element.appendChild(imgElement);
        let object = new THREE.CSS3DObject(element);
        object.position.set(side.position[0], side.position[1], side.position[2]);
        object.rotation.set(side.rotation[0], side.rotation[1], side.rotation[2]);
        scene.add(object);
    }
    document.body.appendChild(renderer.domElement);

    /**
     * 注册监听
     */
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);

    render();
}

/**
 * 实时渲染函数
 */
function render() {
    lon = Math.max(-180, Math.min(180, lon));//限制固定角度内旋转
    lon += 0.1;//自动旋转
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);
    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);
    camera.lookAt(target);
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

/**
 * 窗体大小改变
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}

function onDocumentMouseMove(event) {
    console.log('onDocumentMouseMove');
    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    lon -= movementX * 0.1;
    lat += movementY * 0.1;
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
}

/**
 * 鼠标滚轮改变相机焦距
 */
function onDocumentMouseWheel(event) {
    camera.fov -= event.wheelDeltaY * 0.05;
    camera.updateProjectionMatrix();
}
/**
 * 触摸事件
 * @param event
 */
function onDocumentTouchStart(event) {
    console.log('onDocumentTouchStart');

    event.preventDefault();
    let touch = event.touches[0];
    touchX = touch.screenX;
    touchY = touch.screenY;
}

function onDocumentTouchMove(event) {
    console.log('onDocumentTouchMove');

    event.preventDefault();
    let touch = event.touches[0];
    lon -= (touch.screenX - touchX) * 0.1;
    lat += (touch.screenY - touchY) * 0.1;
    touchX = touch.screenX;
    touchY = touch.screenY;
}

/**
 * 脚本入口
 * @type {init}
 */
window.onload = init;