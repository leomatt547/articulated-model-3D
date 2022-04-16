import GLObject from '../GLObject'

function makeBalok(id: number, shader: WebGLProgram, gl: WebGL2RenderingContext) {
  const baseVal = 150
  // const points = [
  //   //bottom vertices
  //   0,0,0,
  //   baseVal,0,0,
  //   baseVal,0,baseVal,
  //   0,0,baseVal,

  //   //top vertcies
  //   0,baseVal,0,
  //   baseVal,baseVal,0,
  //   baseVal,baseVal,baseVal,
  //   0,baseVal,baseVal,
  // ]

  const points = [
    -0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,

    -0.5, -0.5,   0.5,
     0.5, -0.5,   0.5,
    -0.5,  0.5,   0.5,
    -0.5,  0.5,   0.5,
     0.5, -0.5,   0.5,
     0.5,  0.5,   0.5,

    -0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
     0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
     0.5,   0.5,  0.5,
     0.5,   0.5, -0.5,

    -0.5,  -0.5, -0.5,
     0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,  -0.5,  0.5,
     0.5,  -0.5, -0.5,
     0.5,  -0.5,  0.5,

    -0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5,  0.5,
    -0.5,   0.5, -0.5,

     0.5,  -0.5, -0.5,
     0.5,   0.5, -0.5,
     0.5,  -0.5,  0.5,
     0.5,  -0.5,  0.5,
     0.5,   0.5, -0.5,
     0.5,   0.5,  0.5,
  ]

  const indices = [
    //front face
    0,1,5,
    5,4,0,

    //back face
    2,3,7,
    7,6,2,

    //right face
    1,2,6,
    6,5,1,

    //left face
    3,0,4,
    4,7,3,

    //top face
    4,5,6,
    6,7,4,

    //bot face
    3,2,1,
    1,0,3,
  ]

  const normals =
    [
       0, 0, -1,
       0, 0, -1,
       0, 0, -1,
       0, 0, -1,
       0, 0, -1,
       0, 0, -1,

       0, 0, 1,
       0, 0, 1,
       0, 0, 1,
       0, 0, 1,
       0, 0, 1,
       0, 0, 1,

       0, 1, 0,
       0, 1, 0,
       0, 1, 0,
       0, 1, 0,
       0, 1, 0,
       0, 1, 0,

       0, -1, 0,
       0, -1, 0,
       0, -1, 0,
       0, -1, 0,
       0, -1, 0,
       0, -1, 0,

      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

       1, 0, 0,
       1, 0, 0,
       1, 0, 0,
       1, 0, 0,
       1, 0, 0,
       1, 0, 0,
    ]

  console.log("makebalok")

  let glObject = new GLObject(id, shader, gl)
  glObject.setPoints(points)
  glObject.setIndices(indices)
  glObject.setNormals(normals)
  // glObject.setPosition(position[0],position[1],position[2])
  // glObject.setRotation(0,0,0)
  // glObject.setScale(1,1,1)
  // glObject.bind()

  return glObject;
}

export default makeBalok



