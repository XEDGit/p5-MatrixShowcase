//settings
var num = 100; //cubes per side
var matrixSize = 800; //size of the canvas
var space = 0; //space between cubes
var speed = 90; //rotation speed
var backMult = 0.01; //back rotation speed relative to normal speed
var bkg = 255; //background color
var selectColor = [0, 10, 0]; //color of the selected cube
var selMode = 0; //mode of color selection, 0 or 1 for colors, 2 for textures
var rotationSide = 0; //rotate on X(0) or Y(1) axis
var border = 20; //space between cubes and border of canvas
var maxCubes = -1; //max number of cubes per line, -1 for all

//task variables
class Cube {
	constructor() {
		var x, y, i, j;
		var rotation = 0;
		var direction = true;
		var color;
		var image;
	}
}
var selected;
var recording = true;
var run = false;
var cubes = [];
var prevSelected = [];
var singleBoxSize;

//resouces variables
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
 	imgArray = [py_logo, p5_logo, c_logo, unity_logo];
}

function setup() {
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
	definePoints();
	run = true;
}

function definePoints() {
	//set single box size
	singleBoxSize =
		matrixSize / num - (space / num) * (num - 1) - (border * 2) / num;
	//mouse check values
	let y = height - border;
	for (let i = 0; i < num; i++) {
		let x = border;
		let tempCubes = [];
		for (let j = 0; j < num; j++) {
			let tempCube = new Cube();
			tempCube.i = i;
			tempCube.j = j;
			tempCube.x = x;
			tempCube.y = y;
			let h = random(360);
			let s = random(90, 100);
			let b = random(90, 100);
			tempCube.color = [h, s, b];
			tempCubes.push(tempCube);
			x += singleBoxSize;
			if (j != 0) x += space;
		}
		cubes.push(tempCubes);
		y -= singleBoxSize + space;
	}
	endCube = new Cube();
	endCube.i = num + 1;
	endCube.j = num + 1;
	endCube.x = 0;
	endCube.y = 0;
	let h = random(360);
	let s = random(90, 100);
	let b = random(90, 100);
	endCube.color = [h, s, b];
	selected = endCube;
}

function changeSelect(i, j, rec) {
	//change selected
	if ((selected.i != i || selected.j != j) && rec) {
		if (selected.i != endCube.i) {
			prevSelected.push(selected);
		}
		if (i == endCube.i)
		{
			selected = endCube;
			return;
		}
		selected = cubes[i][j];
		selected.rotation = 0;
	}
	for (let v = 1; v < prevSelected.length; v++) {
		const el = prevSelected[v];
		if (el.i == i && el.j == j) {
			selected.rotation = prevSelected[v].rotation;
			prevSelected.splice(v, 1);
		}
	}
}

function drawBoxes() {
	//go to bottom left to start rendering
	translate(
		-width / 2 + singleBoxSize / 2 + border,
		height / 2 - singleBoxSize / 2 - border,
		-singleBoxSize / 2
	);
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			//maxCubes handle
			if (j == maxCubes)
				break;
			//if mouseOver
			if (
				mouseX > cubes[i][j].x &&
				mouseX <= cubes[i][j].x + singleBoxSize &&
				mouseY > cubes[i][j].y - singleBoxSize &&
				mouseY <= cubes[i][j].y
			) {
				changeSelect(i, j, recording);
				//draw with rotationSide and selMode conditions
				if (selected.rotation < 90) selected.rotation += speed;
				else selected.rotation = 90;
				if (rotationSide == 1) {
					rotateY(selected.rotation);
					if (selMode == 1)
						fill(
							lerpColor(color(selected.color), color(selectColor), selected.rotation / 90)
						);
					else if (i * j + j < imgArray.length && selMode == 2)
						texture(selected.image);
					else
						fill(
							lerpColor(color(selectColor), color(selected.color), selected.rotation / 90)
						);
					box(singleBoxSize);
					rotateY(-selected.rotation);
				} else {
					rotateX(selected.rotation);
					if (selMode == 1)
						fill(
							lerpColor(color(selected.color), color(selectColor), selected.rotation / 90)
						);
					else if (i * j + j < imgArray.length && selMode == 2)
						texture(selected.image);
					else
						fill(
							lerpColor(color(selectColor), color(selected.color), selected.rotation / 90)
						);
					box(singleBoxSize);
					rotateX(-selected.rotation);
				}
				translate(singleBoxSize + space, 0, 0);
			//if is not mouseOver
			} else {
				//if rendering selected
				if (selected.i == i && selected.j == j) {
					if (selected.rotation < 90) selected.rotation += speed;
					else selected.rotation = 90;
					if (rotationSide == 1) {
						rotateY(selected.rotation);
						if (selMode == 1)
							fill(
								lerpColor(
									color(selected.color),
									color(selectColor),
									selected.rotation / 90
								)
							);
						else if (i * j + j < imgArray.length && selMode == 2)
							texture(selected.image);
						else
							fill(
								lerpColor(
									color(selectColor),
									color(selected.color),
									selected.rotation / 90
								)
							);
						box(singleBoxSize);
						rotateY(-selected.rotation);
					} else {
						rotateX(selected.rotation);
						if (selMode == 1)
							fill(
								lerpColor(
									color(selected.color),
									color(selectColor),
									selected.rotation / 90
								)
							);
						else if (i * j + j < imgArray.length && selMode == 2)
							texture(selected.image);
						else
							fill(
								lerpColor(
									color(selectColor),
									color(selected.color),
									selected.rotation / 90
								)
							);
						box(singleBoxSize);
						rotateX(-selected.rotation);
					}
					translate(singleBoxSize + space, 0, 0);
					changeSelect(num + 1, num + 1, true);
					continue;
				}
				let sel = -1;
				for (let v = 1; v < prevSelected.length; v++) {
					const el = prevSelected[v];
					if (el.i == i && el.j == j) sel = v;
				}
				if (sel == -1) {
					if (selMode == 1)
						fill(cubes[i][j].color);
					else if (i * j + j < imgArray.length && selMode == 2)
						texture(cubes[i][j].image);
					else fill(selectColor);
					box(singleBoxSize);
					translate(singleBoxSize + space, 0, 0);
					continue;
				}
				if (rotationSide == 1) {
					rotateY(prevSelected[sel].rotation);
					if (selMode == 1)
						fill(
							lerpColor(
								color(cubes[i][j].color),
								color(selectColor),
								prevSelected[v].rotation / 90
							)
						);
					else if (i * j + j < imgArray.length && selMode == 2)
						texture(cubes[i][j].image);
					else
						fill(
							lerpColor(
								color(selectColor),
								color(cubes[i][j].color),
								prevSelected[sel].rotation / 90
							)
						);
					box(singleBoxSize);
					rotateY(-prevSelected[sel].rotation);
				} else {
					rotateX(prevSelected[sel].rotation);
					if (selMode == 1)
						fill(
							lerpColor(
								color(cubes[i][j].color),
								color(selectColor),
								prevSelected[sel].rotation / 90
							)
						);
					else if (i * j + j < imgArray.length && selMode == 2)
						texture(cubes[i][j].image);
					else
						fill(
							lerpColor(
								color(selectColor),
								color(cubes[i][j].color),
								prevSelected[sel].rotation / 90
							)
						);
					box(singleBoxSize);
					rotateX(-prevSelected[sel].rotation);
				}
				if (prevSelected[sel].rotation > 0)
					prevSelected[sel].rotation -= speed * backMult;
				else {
					prevSelected.splice(sel, 1);
				}
				translate(singleBoxSize + space, 0, 0);
			}
		}
		if(maxCubes != -1)
			translate(-singleBoxSize * maxCubes + -space * maxCubes, -(singleBoxSize + space), 0);
		else
			translate(-singleBoxSize * num + -space * num, -(singleBoxSize + space), 0);
	}
}

function draw() {
	if(run)
	{
	background(bkg);
	drawBoxes();
	}
}
