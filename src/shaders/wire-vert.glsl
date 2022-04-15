attribute vec4 a_pos;
uniform mat4 u_proj_mat;
uniform vec3 u_resolution;

void main() {
    vec3 pos = (u_proj_mat * a_pos).xyz;
    vec3 a = pos / u_resolution;
    vec3 b = a * 2.0;
    vec3 c = b - 1.0;
    gl_Position = vec4(c, 1);
}