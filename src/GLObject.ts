import { multiplyMatrix,inverse } from './utils/matrix'
import { lookAt,perspective,xRotation,yRotate } from './utils/m4'

function cos_sine(rad) {
    const deg = rad * Math.PI / 180;
    return [Math.cos(deg), Math.sin(deg)]
}


class GLObject {
    public id: number;
    public points: number[];
    public indices: number[];
    public normals: number[];
    public wireIndices: Uint16Array;
    public shader: WebGLProgram;
    public wireShader: WebGLProgram | null = null;
    public FieldOfView: number;
    public pos: [number, number, number];
    public rot3: [number, number, number];
    public scale: [number, number, number];
    public gl: WebGL2RenderingContext;
    public projectionMat: number[];
    public childs: GLObject[];
    public parentTransfomationMatrix: number[];
    public anchorPoint: number[];
    public parentAnchorPoint: number[];
    public vbo: WebGLBuffer
    public vboIndices: WebGLBuffer
    public vboNormals: WebGLBuffer
    public wireBuffer: WebGLBuffer

    public sceneDepth: number;

    constructor(id: number, shader: WebGLProgram, gl: WebGL2RenderingContext) {
        this.id = id;
        this.shader = shader;
        this.gl = gl;
        this.childs = new Array<GLObject>();
        this.sceneDepth = 1000
        // this.parentTransfomationMatrix = [
        //     2 / clientWidth, 0, 0, 0,
        //     0, -2 / clientHeight, 0, 0,
        //     0, 0, 2 / sceneDepth, 0,
        //     -1, 1, 0, cameraDistance
        // ];
        this.parentTransfomationMatrix = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]
        this.parentAnchorPoint = [0,0,0]
        this.rot3 = [0,0,0]
        this.FieldOfView = 60
        this.scale = [1,1,1]
        // console.log(this.parentTransfomationMatrix)
    }

    setAnchorPoint(anchorPoint: number[], dimension: number) {
        if (dimension === 2) {
            this.anchorPoint = [anchorPoint[0], anchorPoint[1]]
        } else if (dimension === 3) {
            this.anchorPoint = [anchorPoint[0], anchorPoint[1], anchorPoint[2]]
        }
        
    }

    setPoints(points: number[]) {
        this.points = points;
    }

    setIndices(indices: number[]) {
        this.indices = indices;

        // make wire indices
        const wireIndices = new Uint16Array(indices.length * 2)
        let j = 0;
        for (let i = 0; i < indices.length; i += 3) {
            wireIndices[j++] = indices[i];
            wireIndices[j++] = indices[i + 1];

            wireIndices[j++] = indices[i + 1];
            wireIndices[j++] = indices[i + 2];

            wireIndices[j++] = indices[i + 2];
            wireIndices[j++] = indices[i];
        }
        this.wireIndices = wireIndices

    }
    setNormals(normals: number[]) {
        this.normals = normals;
    }

    setPosition(x: number, y: number, z: number) {
        this.pos = [x,y,z];
        const mat = this.calcProjectionMatrix()
        this.projectionMat = mat
    }

    setRotation(x: number, y: number, z: number) {
        this.rot3 = [x,y,z];
        this.projectionMat = this.calcProjectionMatrix()
    }

    setFieldOfView(a: number) {
        this.FieldOfView = a;
        this.projectionMat = this.calcProjectionMatrix()
    }

    setScale(x: number, y: number, z: number) {
        this.scale = [x,y,z];
        this.projectionMat = this.calcProjectionMatrix()
    }

    addChild(obj: GLObject) {
        if (!this.childs.find(x => x.id === obj.id)) {
            this.childs.push(obj);
        }
    }

    setWireShader(shader: WebGLProgram) {
        this.wireShader = shader
    }

    getPoint(index: number) {
        if(index >= this.points.length / 3) return null
        let point = []
        for(var i = 0; i < 3; i++){
            point.push(this.points[index * 3 + i])
        }
        return point
    }

    

    /* localProjectionMatrix() {
        if (this.pos === undefined || this.rot === undefined || this.scale === undefined) return null
        const [u,v] = this.pos
        const translateMat = [
            1, 0, 0,
            0, 1, 0,
            u, v, 1
        ]
        const degrees = this.rot;
        const rad = degrees * Math.PI / 180;
        const sin = Math.sin(rad)
        const cos = Math.cos(rad)
        const rotationMat = [
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        ]
        const [k1, k2] = this.scale
        const scaleMat = [
            k1, 0, 0,
            0, k2, 0,
            0, 0, 1
        ]
        const projectionMat = multiplyMatrix(
            multiplyMatrix(
                multiplyMatrix(rotationMat, scaleMat),
                translateMat
            ),
            this.parentTransfomationMatrix
        )
        console.log(projectionMat)
        return projectionMat
    } */

    calcProjectionMatrix() {
        if (this.pos === undefined || this.rot3 === undefined || this.scale === undefined) return null
        const [a,b,c] = this.parentAnchorPoint
        const anchorMat = [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            a, b, c, 1,
        ]
        const negAnchorMat = [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            -a, -b, -c, 1,
        ]
        /* const translateMat = [
            1, 0, 0,
            0, 1, 0,
            u+a, v+b, 1
        ] */
        const [u,v,w] = this.pos
        const translateMat3 = [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            u+a, v+b, w+c, 1,
        ]
        /* const degrees = this.rot;
        const rad = degrees * Math.PI / 180;
        const sin = Math.sin(rad)
        const cos = Math.cos(rad)
        const rotationMat = [
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        ] */
        
        // rotation matrix 3 dim
        const trigX = cos_sine(this.rot3[0])
        const trigY = cos_sine(this.rot3[1])
        const trigZ = cos_sine(this.rot3[2])
        const rotX = [
            1, 0, 0, 0,
            0, trigX[0], trigX[1], 0,
            0, -trigX[1], trigX[0], 0,
            0, 0, 0, 1,
        ]
        const rotY = [
            trigY[0], 0, -trigY[1], 0,
            0, 1, 0, 0,
            trigY[1], 0, trigY[0], 0,
            0, 0, 0, 1,
        ]
        const rotZ = [
            trigZ[0], trigZ[1], 0, 0,
            -trigZ[1], trigZ[0], 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
        const rot3Mat = multiplyMatrix(
            multiplyMatrix(rotX, rotY),
            rotZ
        )
            
            
        const [k1, k2, k3] = this.scale
        const scaleMat = [
            k1, 0,  0,  0,
            0, k2,  0,  0,
            0,  0, k3,  0,
            0,  0,  0,  1,
        ]
            
        const identity = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]
        const localProjectionMat = multiplyMatrix(
            translateMat3,
            multiplyMatrix(rot3Mat, scaleMat),
        )
        const projectionMat = multiplyMatrix(
            this.parentTransfomationMatrix,
            localProjectionMat
        )
        // console.log(`P: ${projectionMat}`)
        // console.log(projectionMat)
        return projectionMat
    }

    bind() {
        const gl = this.gl
        const vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW)
        
        const vboIndices = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboIndices)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW)
        const wireBuffer = gl.createBuffer()
        
        this.vbo = vbo
        this.vboIndices = vboIndices

        if(this.wireShader !== null) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.wireIndices, gl.STATIC_DRAW)
            this.wireBuffer = wireBuffer
        }

    }

    bindEnv() {
        const gl = this.gl
        const vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW)
        
        // const vboIndices = gl.createBuffer()
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboIndices)
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW)
        // const wireBuffer = gl.createBuffer()

        const vboNormals = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vboNormals)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW)

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        const faceInfos = [
            {
              target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
              url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-x.jpg',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
              url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-x.jpg',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
              url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-y.jpg',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
              url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-y.jpg',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
              url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-z.jpg',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
              url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-z.jpg',
            },
        ];
        faceInfos.forEach((faceInfo) => {
          const {target, url} = faceInfo;
    
          // Upload the canvas to the cubemap face.
          const level = 0;
          const internalFormat = gl.RGBA;
          const width = 512;
          const height = 512;
          const format = gl.RGBA;
          const type = gl.UNSIGNED_BYTE;
    
          // setup each face so it's immediately renderable
          gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
    
          // Asynchronously load an image
          const image = new Image();
          image.crossOrigin = "anonymous";
          image.src = url;
          image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            gl.texImage2D(target, level, internalFormat, format, type, image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
          });
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);


        this.vbo = vbo
        this.vboNormals = vboNormals
        // this.texture = texture

        // if(this.wireShader !== null) {
        //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer)
        //     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.wireIndices, gl.STATIC_DRAW)
        //     this.wireBuffer = wireBuffer
        // }

    }

    draw() {
        const gl = this.gl

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.useProgram(this.shader)
        
        var vertexPos = gl.getAttribLocation(this.shader, 'a_pos')
        var uniformCol = gl.getUniformLocation(this.shader, 'u_fragColor')
        var uniformPos = gl.getUniformLocation(this.shader, 'u_proj_mat')
        var uniformRes = gl.getUniformLocation(this.shader, 'u_resolution')
        
        gl.enableVertexAttribArray(vertexPos)
        gl.vertexAttribPointer(vertexPos, 3, gl.FLOAT, false, 0, 0)
        // console.log(this.projectionMat)
        gl.uniformMatrix4fv(uniformPos, false, this.projectionMat)
        gl.uniform4fv(uniformCol, [1.0, 0.0, 0.0, 1.0])
        gl.uniform3fv(uniformRes, [gl.canvas.width, gl.canvas.height, this.sceneDepth])

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboIndices)
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0)
        
        if(this.wireShader !== null) {
            console.log("WIRE SHADER")
            gl.useProgram(this.wireShader)
            var vertexPos = gl.getAttribLocation(this.wireShader, 'a_pos')
            var uniformCol = gl.getUniformLocation(this.wireShader, 'u_fragColor')
            var uniformPos = gl.getUniformLocation(this.wireShader, 'u_proj_mat')
            var uniformRes = gl.getUniformLocation(this.wireShader, 'u_resolution')
            gl.enableVertexAttribArray(vertexPos)
            gl.vertexAttribPointer(vertexPos, 3, gl.FLOAT, false, 0, 0)
            gl.uniformMatrix4fv(uniformPos, false, this.projectionMat)
            gl.uniform4fv(uniformCol, [0.0, 0.0, 0.0, 1.0])
            gl.uniform3fv(uniformRes, [gl.canvas.width, gl.canvas.height, this.sceneDepth])
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.wireBuffer)
            gl.drawElements(gl.LINES, this.wireIndices.length, gl.UNSIGNED_SHORT, 0)
        } 

        const proj = this.calcProjectionMatrix()
        // if (this.id === 0)
        //     console.log(proj)
        // console.log(`${this.id} Outer : ${this.parentAnchorPoint}`)
        // render childs
        for (const obj of this.childs) {
            obj.parentTransfomationMatrix = [...proj]
            obj.parentAnchorPoint = [
                obj.anchorPoint[0],
                obj.anchorPoint[1],
                obj.anchorPoint[2],
            ]
            // console.log(`Print: ${this.id}\n`, proj)
            obj.projectionMat = obj.calcProjectionMatrix()
            obj.draw();
        }
    }

    drawEnv() {
        const gl = this.gl

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.useProgram(this.shader)
        
        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(this.shader, "a_position");
        var normalLocation = gl.getAttribLocation(this.shader, "a_normal");

        // lookup uniforms
        var projectionLocation = gl.getUniformLocation(this.shader, "u_projection");
        var viewLocation = gl.getUniformLocation(this.shader, "u_view");
        var worldLocation = gl.getUniformLocation(this.shader, "u_world");
        var textureLocation = gl.getUniformLocation(this.shader, "u_texture");
        var worldCameraPositionLocation = gl.getUniformLocation(this.shader, "u_worldCameraPosition");
        
        var fieldOfViewRadians = this.degToRad(this.FieldOfView);
        var modelXRotationRadians = this.degToRad(0);
        var modelYRotationRadians = this.degToRad(0);
        var cameraYRotationRadians = this.degToRad(0);

        gl.enableVertexAttribArray(positionLocation);
        // Turn on the normal attribute
        gl.enableVertexAttribArray(normalLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
        //Normalnya juga
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0)
        // console.log(this.projectionMat)
        gl.uniformMatrix4fv(projectionLocation, false, this.projectionMat)
        // Compute the projection matrix
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var projectionMatrix = perspective(fieldOfViewRadians, aspect, 1, 2000);
        gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);

        var cameraPosition = [0, 0, 2];
        var target = [0, 0, 0];
        var up = [0, 1, 0];
        // Compute the camera's matrix using look at.
        var cameraMatrix = lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        var viewMatrix = inverse(cameraMatrix);

        var worldMatrix = xRotation(this.degToRad(this.rot3[0]));
        worldMatrix = yRotate(worldMatrix, this.degToRad(this.rot3[1]));

        // Set the uniforms
        gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewLocation, false, viewMatrix);
        gl.uniformMatrix4fv(worldLocation, false, worldMatrix);
        gl.uniform3fv(worldCameraPositionLocation, cameraPosition);

        // Tell the shader to use texture unit 0 for u_texture
        gl.uniform1i(textureLocation, 0);

        // Draw the geometry.
        gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
    

        // gl.uniform4fv(uniformCol, [1.0, 0.0, 0.0, 1.0])
        // gl.uniform3fv(uniformRes, [gl.canvas.width, gl.canvas.height, this.sceneDepth])

        // if(this.wireShader !== null) {
        //     console.log("WIRE SHADER")
        //     gl.useProgram(this.wireShader)
        //     var vertexPos = gl.getAttribLocation(this.wireShader, 'a_pos')
        //     var uniformCol = gl.getUniformLocation(this.wireShader, 'u_fragColor')
        //     var uniformPos = gl.getUniformLocation(this.wireShader, 'u_proj_mat')
        //     var uniformRes = gl.getUniformLocation(this.wireShader, 'u_resolution')
        //     gl.enableVertexAttribArray(vertexPos)
        //     gl.vertexAttribPointer(vertexPos, 3, gl.FLOAT, false, 0, 0)
        //     gl.uniformMatrix4fv(uniformPos, false, this.projectionMat)
        //     gl.uniform4fv(uniformCol, [0.0, 0.0, 0.0, 1.0])
        //     gl.uniform3fv(uniformRes, [gl.canvas.width, gl.canvas.height, this.sceneDepth])
        //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.wireBuffer)
        //     gl.drawElements(gl.LINES, this.wireIndices.length, gl.UNSIGNED_SHORT, 0)
        // } 

        const proj = this.calcProjectionMatrix()
        // if (this.id === 0)
        //     console.log(proj)
        // console.log(`${this.id} Outer : ${this.parentAnchorPoint}`)
        // render childs
        for (const obj of this.childs) {
            obj.parentTransfomationMatrix = [...proj]
            obj.parentAnchorPoint = [
                obj.anchorPoint[0],
                obj.anchorPoint[1],
                obj.anchorPoint[2],
            ]
            // console.log(`Print: ${this.id}\n`, proj)
            obj.projectionMat = obj.calcProjectionMatrix()
            obj.draw();
        }
    }

    radToDeg(r) {
        return r * 180 / Math.PI;
    }
    
    degToRad(d) {
        return d * Math.PI / 180;
    }

    
}

export default GLObject