/* source: https://blog.howlingmoon.dev/posts/AwooCAD---TypeScript%2C-WebGL%2C-and-Renderer*/
/* source: https://blog.howlingmoon.dev/posts/AwooCAD---Articulated-Models-*/

import { multiplyMatrix } from './utils/matrix'
import { fetchShader } from './loaders/shader'
import GLObject from './GLObject'
import Renderer from './renderer'
import makeCube from './models/cube'
import makeBalok from './models/balok'

var canvas = document.getElementById('canvas') as HTMLCanvasElement
canvas.width = 800
canvas.height = 600
var gl = canvas.getContext('webgl2')

let appState = {
    mousePos : {
        x: 0,
        y: 0
    },
    rotation: 0,
}

async function main() {
    if (!gl) {
        alert('Your browser does not support WebGL')
        return
    }
    gl.clearColor(1,1,1,1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    console.log('initialized')
    
    var vert = await fetchShader('draw-vert.glsl')
    var frag = await fetchShader('draw-frag.glsl')
    
    var vertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertShader, vert)
    gl.compileShader(vertShader)
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(vertShader))
    }
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, frag)
    gl.compileShader(fragShader)
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(fragShader))
    }
    var shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertShader)
    gl.attachShader(shaderProgram, fragShader)
    gl.linkProgram(shaderProgram)

    var wireVert = await fetchShader('wire-vert.glsl')
    var wireFrag = await fetchShader('wire-frag.glsl')
    
    var wireVertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(wireVertShader, wireVert)
    gl.compileShader(wireVertShader)
    if (!gl.getShaderParameter(wireVertShader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(wireVertShader))
    }
    var wireFragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(wireFragShader, wireFrag)
    gl.compileShader(wireFragShader)
    if (!gl.getShaderParameter(wireFragShader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(wireFragShader))
    }
    var wireShaderProgram = gl.createProgram()
    gl.attachShader(wireShaderProgram, wireVertShader)
    gl.attachShader(wireShaderProgram, wireFragShader)
    gl.linkProgram(wireShaderProgram)

    var envVert = await fetchShader('env-vert.glsl')
    var envFrag = await fetchShader('env-frag.glsl')

    var envVertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(envVertShader, envVert)
    gl.compileShader(envVertShader)
    if (!gl.getShaderParameter(envVertShader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(envVertShader))
    }
    var envFragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(envFragShader, envFrag)
    gl.compileShader(envFragShader)
    if (!gl.getShaderParameter(envFragShader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(envFragShader))
    }
    var envShaderProgram = gl.createProgram()
    gl.attachShader(envShaderProgram, envVertShader)
    gl.attachShader(envShaderProgram, envFragShader)
    gl.linkProgram(envShaderProgram)


    /* var selectVert = await fetchShader('select-vert.glsl')
    var selectFrag = await fetchShader('select-frag.glsl')
    
    var selectVertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(selectVertShader, selectVert)
    gl.compileShader(selectVertShader)
    if (!gl.getShaderParameter(selectVertShader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(selectVertShader))
    }
    var selectFragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(selectFragShader, selectFrag)
    gl.compileShader(selectFragShader)
    if (!gl.getShaderParameter(selectFragShader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(selectFragShader))
    }
    var selectProgram = gl.createProgram()
    gl.attachShader(selectProgram, selectVertShader)
    gl.attachShader(selectProgram, selectFragShader)
    gl.linkProgram(selectProgram) */

    // mouseevent block
    canvas.addEventListener('mousemove', (event) => {
        const bound = canvas.getBoundingClientRect()
        const res = {
            x: event.clientX - bound.left,
            y: event.clientY - bound.top
        }
        appState.mousePos = res
        const evt = new CustomEvent('glmousemove', {
            detail: {
                pos: {
                    x: res.x,
                    y: res.y
                }
            }
        })
        document.getElementById('rt-mousepos').dispatchEvent(evt)

    }, false)

    const glObject = makeCube(0, shaderProgram, gl)
    glObject.setAnchorPoint([0,0,0], 3)
    glObject.setPosition(200,200,0)
    glObject.setRotation(0,45,0)
    glObject.setScale(1,1,1)
    glObject.setWireShader(wireShaderProgram)
    glObject.bind()

    const glObject2 = makeCube(1, shaderProgram, gl)
    glObject2.setAnchorPoint(glObject.getPoint(4), 3)
    glObject2.setPosition(0,0,0)
    glObject2.setRotation(0,0,0)
    glObject2.setScale(1,1,1)
    glObject2.setWireShader(wireShaderProgram)
    glObject2.bind()

    const glObject3 = makeCube(2, shaderProgram, gl)
    glObject3.setAnchorPoint(glObject2.getPoint(2), 3)
    glObject3.setPosition(0,0,0)
    glObject3.setRotation(0,0,0)
    glObject3.setScale(1,1,1)
    glObject3.setWireShader(wireShaderProgram)
    glObject3.bind()

    const glObject4 = makeCube(3, shaderProgram, gl)
    glObject4.setAnchorPoint(glObject4.getPoint(1), 3)
    glObject4.setPosition(0,0,0)
    glObject4.setRotation(0,0,0)
    glObject4.setScale(1,1,1)
    glObject4.setWireShader(wireShaderProgram)
    glObject4.bind()

    // parent;
    glObject3.addChild(glObject4)
    glObject2.addChild(glObject3)
    glObject.addChild(glObject2)

    const balok = makeBalok(0, envShaderProgram, gl)
    balok.setAnchorPoint([0,0,0], 3)
    balok.setPosition(200,200,0)
    balok.setRotation(0,45,0)
    balok.setScale(1,1,1)
    // balok.setWireShader(wireShaderProgram)
    balok.bindEnv()

    canvas.addEventListener('ui-rotate', (e: CustomEvent) => {
        console.log('ui-rotate event')
        appState.rotation = e.detail.rot;
        console.log('appstate-rot' + appState.rotation)
        switch (e.detail.id) {
            // case 0:
            //     glObject.setRotation(appState.rotation, appState.rotation, appState.rotation)
            //     break;
            // case 1:
            //     glObject2.setRotation(appState.rotation, appState.rotation, appState.rotation)
            //     break;
            // case 2:
            //     glObject3.setRotation(appState.rotation, appState.rotation, appState.rotation)
            //     break;
            // case 3:
            //     glObject4.setRotation(appState.rotation, appState.rotation, appState.rotation)
            //     break;
            case 4:
                balok.setRotation(appState.rotation, appState.rotation, appState.rotation)
                break;
            case 5:
                balok.setFieldOfView(appState.rotation)
                break;
        
            default:
                break;
        }
        
        // glObject2.setRotation(appState.rotation)
        // glObject3.setRotation(appState.rotation)
        // glObject4.setRotation(appState.rotation)
    })

    const renderer = new Renderer()
    // renderer.addObject(glObject);
    renderer.addObject(balok);

    function render(now: number) {
        gl.viewport(0,0, gl.canvas.width, gl.canvas.height)
        gl.enable(gl.DEPTH_TEST)
        gl.clearColor(1,1,1,1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        /* gl.useProgram(selectProgram)
        const resolutionPos = gl.getUniformLocation(selectProgram, 'u_resolution')
        gl.uniform2f(resolutionPos, gl.canvas.width, gl.canvas.height)
        renderer.renderTex(selectProgram)
        // getting the pixel value
        const pixelX = appState.mousePos.x * gl.canvas.width / canvas.clientWidth
        const pixelY = gl.canvas.height - appState.mousePos.y * gl.canvas.height / canvas.clientHeight - 1
        const data = new Uint8Array(4)
        gl.readPixels(pixelX, pixelY, 1,1, gl.RGBA, gl.UNSIGNED_BYTE, data)
        const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24)
        console.log(id)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null) */
        // draw the actual objects
        gl.useProgram(shaderProgram)
        renderer.renderEnv()
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

main()