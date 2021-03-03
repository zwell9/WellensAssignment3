// author: Zach Wellens
// date: 2/28/21
// description: Two squares moving left to right at different velocities. The top most square
//               can have its velocity modified through buttons, a slider, a menu, and key 
//               commands ('U' or 'u' to speed up, 'S' or 's' to stop).
// 10/10: All criteria was met.

"use strict";

var canvas;
var gl;

var velocity1 = 0.01;
var velocityLoc1;
var velocity2 = 0.01;
var velocityLoc2;

var position1 = 0.0;
var positionLoc1;
var position2 = 0.0;
var positionLoc2;

var verticies1;
var verticies2;

var program1;
var program2;

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL 2.0 is not available");

    // Set up WebGL and canvas
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    // Square deinitions
    verticies1 = [
        vec2(-1.0, 0.2),
        vec2(-1.0, 0.8),
        vec2(-0.5, 0.2),
        vec2(-0.5, 0.8),
    ]

    verticies2 = [
        vec2(-1.0, -0.2),
        vec2(-1.0, -0.8),
        vec2(-0.5, -0.2),
        vec2(-0.5, -0.8),
    ]

    program1 = initShaders(gl, "vertex-shader-1", "fragment-shader-1");
    positionLoc1 = gl.getUniformLocation(program1, "uPosition1");
    program2 = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
    positionLoc2 = gl.getUniformLocation(program2, "uPosition2");

    document.getElementById("SpeedUp").onclick = function()
    {
        velocity1 += 0.01;
    }

    document.getElementById("Stop").onclick = function()
    {
        velocity1 = 0.0;
    }

    document.getElementById("slider").onchange = function(event)
    {
        velocity1 = parseFloat(event.target.value);
    }

    document.getElementById("Control").onclick = function(event)
    {
        switch(event.target.index)
        {
            case 0:
                velocity1 += 0.01;
                break;
            case 1:
                velocity1 = 0.0;
        }
    }

    window.onkeydown = function(event)
    {
        var key = String.fromCharCode(event.keyCode);
        switch(key)
        {
            case 'U':
            case 'u':
                velocity1 += 0.01;
                break;
            case 'S':
            case 's':
                velocity1 = 0.0;
                break;
        }
    }

    render();

}

function render ()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    //
    // Square 1
    //

    gl.useProgram(program1);

    var bufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticies1), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program1, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    position1 += velocity1;
    if(position1 > 1.5)
    {
        position1 = 0.0;
    }
    gl.uniform1f(positionLoc1, position1);
    gl.uniform1f(velocityLoc1, velocity1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    //
    // Square 2
    //

    gl.useProgram(program2);

    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticies2), gl.STATIC_DRAW);

    var positionLocTwo = gl.getAttribLocation(program2, "aPosition");
    gl.vertexAttribPointer(positionLocTwo, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocTwo);

    position2 += velocity2;
    if(position2 > 1.5)
    {
        position2 = 0.0;
    }
    gl.uniform1f(positionLoc2, position2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}