//settings
var num				= 5;				//cubes per side
var matrixSize		= 500;				//size of the canvas
var space			= 20;				//space between cubes
var speed			= 4;				//rotation speed
var backMult		= 0.1;				//back rotation speed relative to normal speed
var bkg				= 255;				//background color
var selectColor		= [0, 75, 90];	//color of the selected cube
var rotationSide	= 1;				//rotate on X(0) or Y(1) axis

//task variables
var singleBoxSize;
var prevSelected	= [[num + 1, num + 1]];
var selected		= [num + 1, num + 1];
var prevRotation	= [];
var rotation		= 1;
var back			= 0;
var matrices		= [];
var colors			= [];

function setup() {
	angleMode(DEGREES);
	colorMode(HSB);
	init();
}

function init() {
	var cnv = createCanvas(matrixSize, matrixSize, WEBGL);
	cnv.mouseOut(function(){selected = [num + 1, num + 1]});
	definePoints();
	for (let i = 0; i < num; i++) {
		let tempArray = [];
		let tempColors = []
		for (let j = 0; j < num; j++) {
			let x =	(singleBoxSize  + space ) * j;
			let y =	(singleBoxSize  + space) * (num - i);
			let h = random(255);
			let s = random(255);
			let b = random(255);
			tempArray.push([x, y, 0]);
			tempColors.push([h, s, b]);
		}
		matrices.push(tempArray);
		colors.push(tempColors);
	}
	//help console log
	console.log("Settings: you can find them explained at the top of the souce code");
	console.log("You can manipulate them as you like, remember to launch init() when finished changing settings to see results");
	console.log("Have fun! :D");
}

function definePoints() {
	//input check
	if (num <= 0) {
		throw new Error("set settings bigger than 0, then init()");
	}
	//set single box size
	singleBoxSize = ((matrixSize / num) - ((space / num) * (num - 1)));
}

function drawBoxes() {
	translate((-width / 2) + (singleBoxSize / 2), (height / 2) - (singleBoxSize / 2), -singleBoxSize / 2);
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			fill(colors[i][j][0], colors[i][j][1], colors[i][j][2])
			if ((mouseX > matrices[i][j][0] - space / 2 && mouseX <= matrices[i][j][0] + singleBoxSize + space / 2) && (mouseY > matrices[i][j][1] - singleBoxSize  - space / 2 && mouseY <= matrices[i][j][1] + space / 2)) {
				if (selected[0] != i || selected[1] != j)
				{
						if (selected[0] != num + 1)
						{
							prevSelected.push(selected);
							prevRotation.push(rotation);
						}
						selected = [i, j];
						rotation = 0;
						print(prevSelected);
				}
				for (let v = 0; v < prevSelected.length; v++) {
					const el = prevSelected[v];
					if (el[0] == i && el[1] == j)
					{
						rotation = prevRotation[v - 1];
						prevRotation.splice(v - 1, 1);
						prevSelected.splice(v, 1);
					}
				}
				if (rotation < 90)
					rotation += speed;
				if (rotationSide == 1)
				{
					rotateY(rotation);
					fill(lerpColor(color(colors[i][j]), color(selectColor), rotation / 90));
					box(singleBoxSize);
					rotateY(-rotation);
				}
				else
				{
					rotateX(rotation);
					fill(lerpColor(color(selectColor), color(colors[i][j]), rotation / 90));
					box(singleBoxSize);
					rotateX(-rotation);
				}
				translate(singleBoxSize + space, 0, 0);
			}
			else
			{
				if (prevSelected.length == 1)
				{
					box(singleBoxSize);
					translate(singleBoxSize + space, 0, 0);
					continue;
				}
				else
				{
					let sel = -1;
					for (let v = 0; v < prevSelected.length; v++) {
						const el = prevSelected[v];
						if (el[0] == i && el[1] == j)
							sel = v;
					}
					print(sel);
					if (sel == -1)
					{
					box(singleBoxSize);
					translate(singleBoxSize + space, 0, 0);
					continue;
					}
					if (rotationSide == 1)
					{
						rotateY(prevRotation[sel - 1]);
						fill(lerpColor(color(colors[i][j]), color(selectColor), prevRotation[sel - 1] / 90));
						box(singleBoxSize);
						rotateY(-prevRotation[sel - 1]);
					}
					else
					{
						rotateX(prevRotation[sel - 1]);
						fill(lerpColor(color(colors[i][j]), color(selectColor), prevRotation[sel - 1] / 90));
						box(singleBoxSize);
						rotateX(-prevRotation[sel - 1]);
					}
					// rotateX(prevRotation[sel - 1]);
					// box(singleBoxSize);
					// rotateX(-prevRotation[sel - 1]);
					if (prevRotation[sel - 1] > 0)
						prevRotation[sel - 1] -= speed * backMult;
					else
					{
						prevRotation.splice(sel - 1, 1);
						prevSelected.splice(sel, 1);
					}
					translate(singleBoxSize + space, 0, 0);
				}
			}
		}
		translate((-singleBoxSize * num) + (-space * num), -(singleBoxSize + space), 0);
	}
}

function draw() {
	background(255);
	drawBoxes(bkg);
}