//settings
var num = 5;
var matrixSize = 400;
var space = 20;

//task variables
var singleBoxSize;
var selected = [0, 0];
var rotation = 1;
var back = 0;

function setup() {
	angleMode(DEGREES);
	init();
}

function init() {

	createCanvas(matrixSize, matrixSize, WEBGL);
	definePoints();
	//help console log
	console.log("Settings: num (number of cubes on every side), space (space between cubes), matrixSize(canvas size)");
	console.log("You can manipulate them as you like, remember to launch init() when finished changing settings to see results");
	console.log("Have fun! :D");
}

function definePoints() {
	//input check
	if (num <= 0) {
		throw new Error("set settings bigger than 0, then init()");
	}
	//set single box size
	singleBoxSize = ((matrixSize / num) - space) * 0.83;
}

function selectBox() {
	if (rotation >= 90) {
		rotation = 0;
		selected[0]++;
		if (selected[0] == num) {
			selected[0] = 0;
			selected[1]++;
			if (selected[1] == num)
				selected[1] = 0;
			return;
		}
	}
}

function drawBoxes() {
	translate((-width / 2) + (singleBoxSize * 0.9), (-height / 2) + (singleBoxSize * 0.9));
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			if (selected[0] == j && selected[1] == i) {
				if (rotation < 90)
					rotation += 3;
				rotateX(rotation);
				back = 1
			}
			box(singleBoxSize);
			if (back == 1) {
				rotateX(-rotation);
				back = 0;
			}
			translate(singleBoxSize + space, 0, 0);
		}
		translate((-singleBoxSize * num) + (-space * num), singleBoxSize + space);
	}
}

function draw() {
	background(255);
	selectBox();
	drawBoxes();
}