//settings
var num = 3;						//cubes per side
var rotation = 360;					//rotation in Degrees
var matrixSize = 500;				//size of the canvas
var space = 20;						//space between cubes
var speed = 5;						//rotation speed
var backMult = 0.2;					//back rotation speed relative to normal speed
var bkg = 255;						//background color
var selectColor = [0, 10, 0];		//color of the selected cube
var rotationSide = 0;				//rotate on X(0) or Y(1) axis
var border = 30;					//space between cubes and border of canvas
var maxCubes = -1;					//max number of cubes per line, -1 for all
var selMode = 2;					//mode of color selection, 0 or 1 for colors, 2 for textures
var resDirectory = "resources";		//used with selMode = 2, the path of the folder where source images are stored, no / at the end
var resExt = ".png";				//used with selMode = 2, extension of images in resDirectory folder
var imgNumber = 5;					//used with selMode = 2, number of images in resDirectory folder
var deleteNormal = false;			//used with selMode = 2, deletes cubes without image
var links = [
	"xedgit.com/project/gcodesimulator.html",
	"xedgit.com/project/matrixShowcase.html",
	"xedgit.com/project/python.html",
	"xedgit.com/project/unity.html",
	"xedgit.com/project/adventofcode.html"
]

//task variables
class Cube {
	constructor() {
		var x, y, i, j;
		var rotation = 0;
		var direction = true;
		var color;
		var image;
		var a;
	}

	onClick() {
		if (
			mouseX > this.x &&
			mouseX <= this.x + singleBoxSize &&
			mouseY < this.y + singleBoxSize &&
			mouseY >= this.y
			) 
			{
				var ind = index(this.i, this.j);
				if (ind < imgArray.length)
					window.location.href = links[ind];
			}
	}
}
var selected;
var recording = true;
var run = false;
var cubes = [];
var prevSelected = [];
var singleBoxSize;

//resouces variables
var imgArray = [];

function preload() {
	if (selMode != 2) return;
	//resources import
	for (let i = 1; i <= imgNumber; i++)
		imgArray.push(loadImage(resDirectory + "/" + i + resExt));
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

function index(i, j) {
	if (maxCubes == -1) return (i * num + j);
	return i * maxCubes + j;
}

function definePoints() {
	//set single box size
	singleBoxSize =
		matrixSize / num - (space / num) * (num - 1) - (border * 2) / num;
	//mouse check values
	let y = border;
	//endcube
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
	//cubes array
	for (let i = 0; i < num; i++) {
		let x = border;
		let tempCubes = [];
		for (let j = 0; j < num; j++) {
			let tempCube = new Cube();
			tempCube.i = i;
			tempCube.j = j;
			tempCube.x = x;
			tempCube.y = y;
			if (index(i, j) < imgArray.length)
				tempCube.image = imgArray[index(i, j)];
			let h = random(360);
			let s = random(90, 100);
			let b = random(90, 100);
			tempCube.color = [h, s, b];
			tempCubes.push(tempCube);
			x += singleBoxSize;
			x += space;
		}
		cubes.push(tempCubes);
		y += singleBoxSize + space;
	}
	print(cubes);
}

function changeSelect(i, j, rec) {
	//change selected
	if ((selected.i != i || selected.j != j) && rec) {
		if (i != endCube.i || j != endCube.j) {
			if (selected.i != endCube.i || selected.j != endCube.j)
				prevSelected.push(selected);
			selected = cubes[i][j];
		}
		else {
			prevSelected.push(selected);
			selected = endCube;
		}

		let found = false;
		for (let v = 0; v < prevSelected.length; v++) {
			const el = prevSelected[v];
			if (el.i == i && el.j == j) {
				found = true;
				selected.rotation = prevSelected[v].rotation;
				prevSelected.splice(v, 1);
				break;
			}
		}
		if (!found) selected.rotation = 0;
	}
}

function drawBoxes() {
	//go to bottom left to start rendering
	translate(
		-width / 2 + singleBoxSize / 2 + border,
		-height / 2 + singleBoxSize / 2 + border,
		-singleBoxSize / 2
	);
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			if (deleteNormal && imgArray.length == index(i, j) && selMode == 2)
				return;
			//maxCubes handle
			if (j == maxCubes) break;
			//if mouseOver
			if (
				mouseX > cubes[i][j].x &&
				mouseX <= cubes[i][j].x + singleBoxSize &&
				mouseY < cubes[i][j].y + singleBoxSize &&
				mouseY >= cubes[i][j].y
			) {
				if (selected.i != i || selected.j != j) { changeSelect(i, j, recording); }
				//draw with rotationSide and selMode conditions
				if (selected.rotation < rotation) selected.rotation += speed;
				else selected.rotation = rotation;
				if (rotationSide == 1) {
					rotateY(selected.rotation);
					if (selMode == 1)
						fill(
							lerpColor(
								color(selected.color),
								color(selectColor),
								selected.rotation / rotation
							)
						);
					else if (index(i, j) < imgArray.length && selMode == 2)
						texture(selected.image);
					else
						fill(
							lerpColor(
								color(selectColor),
								color(selected.color),
								selected.rotation / rotation
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
								selected.rotation / rotation
							)
						);
					else if (index(i, j) < imgArray.length && selMode == 2)
						texture(selected.image);
					else
						fill(
							lerpColor(
								color(selectColor),
								color(selected.color),
								selected.rotation / rotation
							)
						);
					box(singleBoxSize);
					rotateX(-selected.rotation);
				}
				translate(singleBoxSize + space, 0, 0);
				//if is not mouseOver
			} else {
				//if rendering selected
				if (selected.i == i && selected.j == j) {
					changeSelect(num + 1, num + 1, true);
					j--;
					continue;
				}
				let sel = -1;
				for (let v = 0; v < prevSelected.length; v++) {
					const el = prevSelected[v];
					if (el.i == i && el.j == j) sel = v;
				}
				if (sel == -1) {
					if (selMode == 1) fill(cubes[i][j].color);
					else if (index(i, j) < imgArray.length && selMode == 2)
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
								prevSelected[v].rotation / rotation
							)
						);
					else if (index(i, j) < imgArray.length && selMode == 2)
						texture(cubes[i][j].image);
					else
						fill(
							lerpColor(
								color(selectColor),
								color(cubes[i][j].color),
								prevSelected[sel].rotation / rotation
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
								prevSelected[sel].rotation / rotation
							)
						);
					else if (index(i, j) < imgArray.length && selMode == 2)
						texture(cubes[i][j].image);
					else
						fill(
							lerpColor(
								color(selectColor),
								color(cubes[i][j].color),
								prevSelected[sel].rotation / rotation
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
		if (maxCubes != -1)
			translate(
				-singleBoxSize * maxCubes + -space * maxCubes,
				singleBoxSize + space,
				0
			);
		else
			translate(
				-singleBoxSize * num + -space * num,
				(singleBoxSize + space),
				0
			);
	}
}

function mouseClicked() {
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			cubes[i][j].onClick();
		}
	}
}

function draw() {
	if (run) {
		background(bkg);
		drawBoxes();
	}
}
