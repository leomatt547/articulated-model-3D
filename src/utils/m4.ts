let MatType = Float32Array;

export function lookAt(cameraPosition, target, up, dst?): Float32Array[] {
    dst = dst || new MatType(16);
    var zAxis = normalize(
        subtractVectors(cameraPosition, target));
    var xAxis = normalize(cross(up, zAxis));
    var yAxis = normalize(cross(zAxis, xAxis));

    dst[ 0] = xAxis[0];
    dst[ 1] = xAxis[1];
    dst[ 2] = xAxis[2];
    dst[ 3] = 0;
    dst[ 4] = yAxis[0];
    dst[ 5] = yAxis[1];
    dst[ 6] = yAxis[2];
    dst[ 7] = 0;
    dst[ 8] = zAxis[0];
    dst[ 9] = zAxis[1];
    dst[10] = zAxis[2];
    dst[11] = 0;
    dst[12] = cameraPosition[0];
    dst[13] = cameraPosition[1];
    dst[14] = cameraPosition[2];
    dst[15] = 1;

    return dst;
}

export function perspective(fieldOfViewInRadians, aspect, near, far, dst?) {
    dst = dst || new MatType(16);
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    dst[ 0] = f / aspect;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = f;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = (near + far) * rangeInv;
    dst[11] = -1;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = near * far * rangeInv * 2;
    dst[15] = 0;

    return dst;
}

export function xRotation(angleInRadians, dst?) {
    dst = dst || new MatType(16);
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = 1;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = c;
    dst[ 6] = s;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = -s;
    dst[10] = c;
    dst[11] = 0;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 0;
    dst[15] = 1;

    return dst;
  }

export function yRotate(m, angleInRadians, dst?) {
    // this is the optimized version of
    // return multiply(m, yRotation(angleInRadians), dst);
    dst = dst || new MatType(16);

    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = c * m00 - s * m20;
    dst[ 1] = c * m01 - s * m21;
    dst[ 2] = c * m02 - s * m22;
    dst[ 3] = c * m03 - s * m23;
    dst[ 8] = c * m20 + s * m00;
    dst[ 9] = c * m21 + s * m01;
    dst[10] = c * m22 + s * m02;
    dst[11] = c * m23 + s * m03;

    if (m !== dst) {
      dst[ 4] = m[ 4];
      dst[ 5] = m[ 5];
      dst[ 6] = m[ 6];
      dst[ 7] = m[ 7];
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
}



function normalize(v, dst?): Float32Array[]{
    dst = dst || new Float32Array(3);
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      dst[0] = v[0] / length;
      dst[1] = v[1] / length;
      dst[2] = v[2] / length;
    }
    return dst;
}

function subtractVectors(a, b, dst?) {
    dst = dst || new MatType(3);
    dst[0] = a[0] - b[0];
    dst[1] = a[1] - b[1];
    dst[2] = a[2] - b[2];
    return dst;
}

function cross(a, b, dst?) {
    dst = dst || new MatType(3);
    dst[0] = a[1] * b[2] - a[2] * b[1];
    dst[1] = a[2] * b[0] - a[0] * b[2];
    dst[2] = a[0] * b[1] - a[1] * b[0];
    return dst;
  }

