# p5-MatrixShowcase v0.6

#### Changelog v0.6
Rendering order have been changed to from top left to bottom right

Now there's possibility to add **links**!
check Available Settings for more info

## Release 1 v0.5

A small script to create a interactive showcase matrix for your website within a single JS function!
You'll find a basic example on how to import the file in index.html

A working example here: https://xedgit.dev/projects

The rendering order is from bottom left to top right in rows

#### Available Settings: (you can edit any directly at top of the source code of the imported file)

	-num				//number of cubes per side
	-rotation			//rotation in Degrees
	-matrixSize			//size of the canvas, in both x and y axes
	-space				//space between cubes
	-speed				//rotation speed
	-backMult			//back rotation speed relative to normal speed (speed * backMult)
	-bkg				//background color
	-selectColor			//main color
	-rotationSide			//rotate on X(0) or Y(1) axis
	-border				//space between cubes and border of canvas
	-maxCubes			//maximum number of cubes per line, set this to -1 to ignore it

	 -selMode
		this is a particular setting regarding the way the random colors and your selectColor get distributed in the canvas, 
		it can be set to 0, 1 or 2
		mode 0
			-rotation 0:		selectColor
			-rotation max:		random color
		mode 1
			-rotation 0:		random color
			-rotation max:		selectColor
		mode 2
			-add image support, don't forget to fill in all the dependant variables to make this work

##### -selMode dependant variables
	-resDirectory
		the path of the folder where source images are stored, no / at the end
	-resExt
		extension of images in resDirectory folder, including leading dot (ex. '.png', '.jpg')
	-imgNumber
		number of images stored in resDirectory folder
	-deleteNormal
		deletes cubes without image assigned
	-links
		an array containing links, its lenght must match the imgNumber.
		Ex. (
			"yourwebsite.com/location.html",
			"yourwebsite.com/location2.html",
			...
		)
***these variables doesn't need to be set if selMode is not set to 2**

#### Libraries:
	<p5.js>		-	https://p5js.org/
