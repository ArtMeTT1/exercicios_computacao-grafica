function main(){
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

  if (!gl) {
      throw new Error('WebGL not supported');
  }

  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  var program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();

  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const colorLocation = gl.getAttribLocation(program, `color`);
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  canvas.addEventListener("mousedown",mouseClick,false);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0,0.0,0.0]), gl.STATIC_DRAW);

  let xi,yi,xf,yf;

  function mouseClick(event){
    console.log(event.offsetX,event.offsetY);
    let x = event.offsetX; 
    let y = event.offsetY;
    if(xi == undefined && yi == undefined){
      xi= x;
      yi = y;
    }
    else{
      xf = x;
      yf = y;
      createLineBresenham(gl, xi, xf, yi, yf, positionBuffer);
      xi = undefined;
      yi = undefined;
    }
  }

  const bodyElement = document.querySelector("body");
  bodyElement.addEventListener("keydown",keyDown,false);

  let colorVector = [0.0,0.0,0.0];
  function keyDown(event){
    switch(event.key){
      case "0":
        colorVector = [0.0,0.0,0.0];
        break;
      case "1":
        colorVector = [1.0,0.0,0.0];
        break;
      case "2":
        colorVector = [0.0,1.0,0.0];
        break;
      case "3":
        colorVector = [0.0,0.0,1.0];
        break;
      case "4":
        colorVector = [1.0,1.0,0.0];
        break;
      case "5":
        colorVector = [0.0,1.0,1.0];
        break;
      case "6":
        colorVector = [1.0,0.0,1.0];
        break;
      case "7":
        colorVector = [1.0,0.5,0.5];
        break;
      case "8":
        colorVector = [0.5,1.0,0.5];
        break;
      case "9":
        colorVector = [0.5,0.5,1.0];
        break;
    }
    draw(colorVector);
  }

  function drawPoints(){
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, 1);
  }

  function draw(vector){
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vector), gl.STATIC_DRAW);
    drawPoints();
  }
  



  drawPoints();
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
      return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
      return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createLineBresenham(gl, xi, xf, yi, yf, positionBuffer) {
  let dx = Math.abs(xf - xi);
  let dy = Math.abs(yf - yi);
  let p = 2 * dy - dx; 

  let incInf = 2 * dy;
  let incSup = 2 * (dy - dx);

  let x = xi;
  let y = yi;

  let xIncrement = (xf > xi) ? 1 : -1;
  let yIncrement = (yf > yi) ? 1 : -1;

  if (dx >= dy) {
    write_pixel(gl, x, y, positionBuffer);
    for (let i = 0; i < dx; i++) {
      x += xIncrement;
      if (p < 0) {
        p += incInf;
      } else {
        y += yIncrement;
        p += incSup;
      }
      write_pixel(gl, x, y, positionBuffer);
    }
  } else {
    p = 2 * dx - dy;
    incInf = 2 * dx;
    incSup = 2 * (dx - dy);

    write_pixel(gl, x, y, positionBuffer);
    for (let i = 0; i < dy; i++) {
      y += yIncrement;
      if (p < 0) {
        p += incInf;
      } else {
        x += xIncrement;
        p += incSup;
      }
      write_pixel(gl, x, y, positionBuffer);
    }
  }
}

function write_pixel(gl, x, y, positionBuffer){
  let xGrid = (2/canvas.width * x) - 1;
  let yGrid = (-2/canvas.height * y) + 1;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([xGrid,yGrid]), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 1);
}

main();