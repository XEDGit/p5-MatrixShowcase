//settings
var num = 25; //cubes per side
var matrixSize = 800; //size of the canvas
var space = 0; //space between cubes
var speed = 20; //rotation speed
var backMult = 0.02; //back rotation speed relative to normal speed
var bkg = 0; //background color
var selectColor = [0, 0, 0]; //color of the selected cube
var selMode = 0; //mode of color selection, 0 or 1 for colors, 2 for textures
var rotationSide = 0; //rotate on X(0) or Y(1) axis
var border = 0; //space between cubes and border of canvas
var maxCubes = -1; //max number of cubes per line, -1 for all

//task variables
var singleBoxSize;
var prevSelected = [[num + 1, num + 1]];
var selected = [num + 1, num + 1];
var prevRotation = [];
var rotation = 1;
var back = 0;
var matrices = [];
var colors = [];
var recording = true;
var run = true;
var imgArray;
var py_logo;
var p5_logo;
var c_logo;
var unity_logo;

function preload() {
  //resources import
  py_logo = loadImage("resources/py_logo.png");
  p5_logo = loadImage("resources/p5_logo.png");
  c_logo = loadImage("resources/c_logo.png");
  unity_logo = loadImage("resources/unity_logo.png");
}

function setup() {
  imgArray = new Array(py_logo, p5_logo, c_logo, unity_logo);
  //help console log
  console.log(
    "Settings: you can find them explained at the top of the souce code"
  );
  console.log(
    "You can manipulate them as you like, remember to launch init() when finished changing settings to see results"
  );
  console.log("Have fun! :D");
  //settings and start
  angleMode(DEGREES);
  noLoop();
  colorMode(HSB);
  //debug
  init();
}

function init() {
  //input check
  if (
    matrixSize <= 0 ||
    num <= 0 ||
    space < 0 ||
    speed < 0 ||
    backMult < 0 ||
    rotationSide > 255 ||
    rotationSide < 0
  )
    throw new Error("set settings bigger than 0, then init()");
  //canvas creation
  var cnv = createCanvas(matrixSize, matrixSize, WEBGL);
  cnv.mouseOut(function () {
    recording = false;
  });
  cnv.mouseOver(function () {
    recording = true;
  });
  matrices.splice(0, matrices.length);
  definePoints();
  loop();
}

function definePoints() {
  //set single box size
  singleBoxSize =
    matrixSize / num - (space / num) * (num - 1) - (border * 2) / num;
  //mouse check values
  let y = height - border;
  for (let i = 0; i < num; i++) {
    let tempArray = [];
    let tempColors = [];
    let x = border;
    for (let j = 0; j < num; j++) {
      let h, s, b;
      h = random(0, 360);
      s = b = random(75, 101);
      tempArray.push([x, y, 0]);
      tempColors.push([h, s, b]);
      x += singleBoxSize;
      if (j != 0) x += space;
    }
    y -= singleBoxSize + space;
    matrices.push(tempArray);
    colors.push(tempColors);
  }
}

function changeSelect(i, j, rec) {
  //change selected
  if ((selected[0] != i || selected[1] != j) && rec) {
    if (selected[0] != num + 1) {
      prevSelected.push(selected);
      prevRotation.push(rotation);
    }
    selected = [i, j];
    rotation = 0;
  }
  for (let v = 1; v < prevSelected.length; v++) {
    const el = prevSelected[v];
    if (el[0] == i && el[1] == j) {
      rotation = prevRotation[v - 1];
      prevRotation.splice(v - 1, 1);
      prevSelected.splice(v, 1);
    }
  }
}

function drawBoxes() {
  translate(
    -width / 2 + singleBoxSize / 2 + border,
    height / 2 - singleBoxSize / 2 - border,
    -singleBoxSize / 2
  );
  for (let i = 0; i < num; i++) {
    let counter = 0;
    for (let j = 0; j < num; j++) {
      //maxCubes handle
      if (counter == maxCubes) {
        translate(singleBoxSize + space, 0, 0);
        continue;
      }
      counter++;
      //get if mouse is on a cube
      if (
        mouseX > matrices[i][j][0] &&
        mouseX <= matrices[i][j][0] + singleBoxSize &&
        mouseY > matrices[i][j][1] - singleBoxSize &&
        mouseY <= matrices[i][j][1]
      ) {
        changeSelect(i, j, recording);
        //draw with rotationSide and selMode conditions
        if (rotation < 90) rotation += speed;
        if (rotationSide == 1) {
          rotateY(rotation);
          if (selMode == 1)
            fill(
              lerpColor(color(colors[i][j]), color(selectColor), rotation / 90)
            );
          else if (i * j + j < imgArray.length && selMode == 2)
            texture(imgArray[i * j + j]);
          else
            fill(
              lerpColor(color(selectColor), color(colors[i][j]), rotation / 90)
            );
          box(singleBoxSize);
          rotateY(-rotation);
        } else {
          rotateX(rotation);
          if (selMode == 1)
            fill(
              lerpColor(color(colors[i][j]), color(selectColor), rotation / 90)
            );
          else if (i * j + j < imgArray.length && selMode == 2)
            texture(imgArray[i * j + j]);
          else
            fill(
              lerpColor(color(selectColor), color(colors[i][j]), rotation / 90)
            );
          box(singleBoxSize);
          rotateX(-rotation);
        }
        translate(singleBoxSize + space, 0, 0);
      } else {
        if (selected[0] == i && selected[1] == j) {
          if (rotation < 90) rotation += speed;
          if (rotationSide == 1) {
            rotateY(rotation);
            if (selMode == 1)
              fill(
                lerpColor(
                  color(colors[i][j]),
                  color(selectColor),
                  rotation / 90
                )
              );
            else if (i * j + j < imgArray.length && selMode == 2)
              texture(imgArray[i * j + j]);
            else
              fill(
                lerpColor(
                  color(selectColor),
                  color(colors[i][j]),
                  rotation / 90
                )
              );
            box(singleBoxSize);
            rotateY(-rotation);
          } else {
            rotateX(rotation);
            if (selMode == 1)
              fill(
                lerpColor(
                  color(colors[i][j]),
                  color(selectColor),
                  rotation / 90
                )
              );
            else if (i * j + j < imgArray.length && selMode == 2)
              texture(imgArray[i * j + j]);
            else
              fill(
                lerpColor(
                  color(selectColor),
                  color(colors[i][j]),
                  rotation / 90
                )
              );
            box(singleBoxSize);
            rotateX(-rotation);
          }
          translate(singleBoxSize + space, 0, 0);
          changeSelect(num + 1, num + 1, true);
          continue;
        }
        let sel = -1;
        for (let v = 1; v < prevSelected.length; v++) {
          const el = prevSelected[v];
          if (el[0] == i && el[1] == j) sel = v;
        }
        if (sel == -1) {
          if (selMode == 1)
            fill(colors[i][j][0], colors[i][j][1], colors[i][j][2]);
          else if (i * j + j < imgArray.length && selMode == 2)
            texture(imgArray[i * j + j]);
          else fill(selectColor[0], selectColor[1], selectColor[2]);
          box(singleBoxSize);
          translate(singleBoxSize + space, 0, 0);
          continue;
        }
        if (rotationSide == 1) {
          rotateY(prevRotation[sel - 1]);
          if (selMode == 1)
            fill(
              lerpColor(
                color(colors[i][j]),
                color(selectColor),
                prevRotation[sel - 1] / 90
              )
            );
          else if (i * j + j < imgArray.length && selMode == 2)
            texture(imgArray[i * j + j]);
          else
            fill(
              lerpColor(
                color(selectColor),
                color(colors[i][j]),
                prevRotation[sel - 1] / 90
              )
            );
          box(singleBoxSize);
          rotateY(-prevRotation[sel - 1]);
        } else {
          rotateX(prevRotation[sel - 1]);
          if (selMode == 1)
            fill(
              lerpColor(
                color(colors[i][j]),
                color(selectColor),
                prevRotation[sel - 1] / 90
              )
            );
          else if (i * j + j < imgArray.length && selMode == 2)
            texture(imgArray[i * j + j]);
          else
            fill(
              lerpColor(
                color(selectColor),
                color(colors[i][j]),
                prevRotation[sel - 1] / 90
              )
            );
          box(singleBoxSize);
          rotateX(-prevRotation[sel - 1]);
        }
        if (prevRotation[sel - 1] > 0)
          prevRotation[sel - 1] -= speed * backMult;
        else {
          prevRotation.splice(sel - 1, 1);
          prevSelected.splice(sel, 1);
        }
        translate(singleBoxSize + space, 0, 0);
      }
    }
    translate(-singleBoxSize * num + -space * num, -(singleBoxSize + space), 0);
  }
}

function draw() {
  background(bkg);
  drawBoxes();
}
