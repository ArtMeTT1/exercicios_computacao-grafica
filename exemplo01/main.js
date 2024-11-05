const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  throw new Error('WebGL not supported');
}

//pixels
const vertexShaderGLSL = `
attribute vec2 position;

void main() {
    gl_Position = vec4(position,0.0,1.0);
}
`;

//cores
const fragmentShaderGLSL = `
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderGLSL);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader))
};

//cria o fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//inicializacao
gl.shaderSource(fragmentShader, fragmentShaderGLSL);
//compila e ve se ta tudo certo
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader))
};

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program))
};

gl.useProgram(program);

// vertex positions for a square
const squareVertexPositions = new Float32Array([
  //coordenadas do triangulo 1
    -0.5, 0.5,
    0.5,-0.5,
    0.5, 0.5,
    //coordendas do triangulo 2
    -0.5, 0.5,
    0.5,-0.5,
    -0.5,-0.5,
]);


//criacao do buffer de posicao
const positionBuffer = gl.createBuffer();
//habilita o buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//preenchimento do buffer com o vetor de posicao
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertexPositions), gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.drawArrays(gl.TRIANGLES, 0, 6);
