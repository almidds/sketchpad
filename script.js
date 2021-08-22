//Set variables for script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const grid = document.querySelector(".grid");
const inkSelector = document.querySelector(".colourSelector");
inkSelector.value = "black";
inkSelector.addEventListener("input", setColour);
let mouseDown = false;
let inkcolour = "#000"
let colourCatcher = false;
let fillToggle = false;
//whether there are grid lines
let nogridlines = true;
//the array of tiles in the grid
let tiles;
//default size of board is 16x16
let size = 16;
//Goes between 0 and 1; defines how quickly shading shades a square
let shadingConstant = 0.85;
//Goes between 0 and 1; defines how quickly tinting tints a square
let tintConstant = 0.12;


document.body.onmousedown = function(){
    mouseDown = true;
}
document.body.onmouseup = function(){
    mouseDown = false;
}
//Make the grid~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function makeGrid(rows, cols){
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for(let i = 0; i < (rows*cols); i++){
        let tile = document.createElement("div");
        tile.classList.add("square");
        tile.setAttribute("draggable", false);
        tile.setAttribute("ondragstart", "return false;");
        if(nogridlines){
            
            tile.style.outline = "0"
        }else{
            tile.style.outline = "1px #CCC solid"
        }
        tile.addEventListener("mousedown", colourInFirst);
        tile.addEventListener("mouseenter", colourInSecond);

        grid.appendChild(tile);
    }
    tiles = document.querySelectorAll(".square");
}

//Colouring in~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Colours in cell if mouse is dragged over whilst being held down
function colourInSecond(e){
    if(mouseDown){
        e.target.style.backgroundColor = getInkColour(e);
    }
}
//Colours in cell if mouse is clicked whilst over cell
function colourInFirst(e){
    e.target.style.backgroundColor = getInkColour(e);
}

function setColour(e){
    inkcolour = e.target.value;
}
//Colour catcher
const colourCatcherButton = document.querySelector(".colour-picker");
colourCatcherButton.addEventListener("click", pickColour);

function pickColour(e){
    if(!(colourCatcher)){
        disableFillerButton(e);
        colourCatcherButton.classList.add("selected");
        tiles.forEach(tile => {
            tile.addEventListener("click", getColourOfMe);
            tile.removeEventListener("mousedown", colourInFirst);
            tile.removeEventListener("mouseenter", colourInSecond);
        });
        colourCatcher = true;
    }else{
        disablePickerButton(e);

    }
}

function getColourOfMe(e){
    disablePickerButton(e);
    let colour = e.target.style.backgroundColor;
    if(colour == ""){
        inkSelector.value = "#FFFFFF";
    }else{
        let colours = colour.slice(4, -1).replace(/ /g, "").split(",", 3);
        inkSelector.value = getFullHex(colours);
    }

    inkcolour = e.target.style.backgroundColor;
}

function disablePickerButton(e){
    colourCatcherButton.classList.remove("selected");
    tiles.forEach(tile => {
        tile.removeEventListener("click", getColourOfMe);
        tile.addEventListener("mousedown", colourInFirst);
        tile.addEventListener("mouseenter", colourInSecond);
    });
    colourCatcher = false;
}

//fill tool
const fillButton = document.querySelector(".fill");
fillButton.addEventListener("click", fill);

function fill(e){
    if(!(fillToggle)){
        disablePickerButton(e);
        tiles.forEach(tile => {
            tile.addEventListener("click", fillaround);
            tile.removeEventListener("mousedown", colourInFirst);
            tile.removeEventListener("mouseenter", colourInSecond);
        });
        fillButton.classList.add("selected");
        fillToggle = true;
    }else{
        disableFillerButton(e);
    }
}

function disableFillerButton(e){
    fillButton.classList.remove("selected");
    tiles.forEach(tile => {
        tile.removeEventListener("click", fillaround);
        tile.addEventListener("mousedown", colourInFirst);
        tile.addEventListener("mouseenter", colourInSecond);
    });
    fillToggle = false;
}


//This function is going to use flood fill, I'm aware there are more efficient
//ways but on a small enough scale this is easier to implement bug-free
function fillaround(e){
    //First need to convert tiles to 2D array to get positions
    let grid = tilesToMatrix(tiles);
    //Convert index of tile in 1D array to coordinates in 2D matrix (starting at 0,0)
    tilesArray = Array.from(tiles);
    index = tilesArray.indexOf(e.target);
    let xStart = index%size;
    let yStart = Math.floor(index/size);
    let colourToCheck = grid[yStart][xStart].style.backgroundColor;

    //Now from the starting point, a list of all connected points must be collated
    fillConnected(xStart, yStart, grid, colourToCheck, e);

    disableFillerButton(e);
}

//Eraser
//finding all the buttons that will be grouped together
let eraser = false;
let shading = false;
let lighten = false;
let rainbow = false;
const eraserButton = document.querySelector(".eraser");
const shadingButton = document.querySelector(".darken");
const lightenButton = document.querySelector(".lighten");
const rainbowButton = document.querySelector(".rainbow");

eraserButton.addEventListener("click", function(e){
    if(!(eraser)){
        eraser = true;
        shading = false;
        lighten = false;
        rainbow = false;
        eraserButton.classList.add("selected");
        disableOtherButtons();
    }else{
        eraserButton.classList.remove("selected");
        eraser = false;
    }

});
shadingButton.addEventListener("click", function(e){
    if(!(shading)){
        eraser = false;
        shading = true;
        lighten = false;
        rainbow = false;
        shadingButton.classList.add("selected");
        disableOtherButtons();
    }else{
        shadingButton.classList.remove("selected");
        shading = false;
    }

});
lightenButton.addEventListener("click", function(e){
    if(!(lighten)){
        eraser = false;
        shading = false;
        lighten = true;
        rainbow = false;
        lightenButton.classList.add("selected");
        disableOtherButtons();
    }else{
        lightenButton.classList.remove("selected");
        lighten = false;
    }

});
rainbowButton.addEventListener("click", function(e){
    if(!(rainbow)){
        eraser = false;
        shading = false;
        lighten = false;
        rainbow = true;
        rainbowButton.classList.add("selected");
        disableOtherButtons();
    }else{
        rainbowButton.classList.remove("selected");
        rainbow = false;
    }

});



function disableOtherButtons(){
    if(eraser){
        shadingButton.classList.remove("selected");
        lightenButton.classList.remove("selected");
        rainbowButton.classList.remove("selected");
    }
    if(shading){
        eraserButton.classList.remove("selected");
        lightenButton.classList.remove("selected");
        rainbowButton.classList.remove("selected");
    }
    if(lighten){
        eraserButton.classList.remove("selected");
        shadingButton.classList.remove("selected");
        rainbowButton.classList.remove("selected");
    }
    if(rainbow){
        eraserButton.classList.remove("selected");
        shadingButton.classList.remove("selected");
        lightenButton.classList.remove("selected");
        console.log("I'm selected");
    }
}

function getInkColour(e){
    if(eraser){
        return("");
    }else if(shading){
        colours = getColours(e);
        return(`rgb(${colours[0]*shadingConstant}, ${colours[1]*shadingConstant}, ${colours[2]*shadingConstant})`);
    }else if(lighten){
        colours = getColours(e);
        coloursFloat = [parseFloat(colours[0]), parseFloat(colours[1]), parseFloat(colours[2])];
        return(`rgb(${coloursFloat[0] + (255 - coloursFloat[0])*tintConstant}, ${coloursFloat[1] + (255 - coloursFloat[1])*tintConstant}, ${coloursFloat[2] + (255 - coloursFloat[2])*tintConstant})`);
    }else if(rainbow){
        console.log("I'm getting here");
        return(`rgb(${randomColour()},${randomColour()},${randomColour()})`);
    }else{
        return inkcolour;
    }
}
//Settings~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const gridlinesButton = document.querySelector(".gridlines");
gridlinesButton.addEventListener("click", toggleGridlines);
gridlinesButton.addEventListener("mouseenter", buttonFocus);
gridlinesButton.addEventListener("mouseleave", buttonUnfocus(nogridlines));

//toggles gridlines
function toggleGridlines(e){
    if(nogridlines){
        tiles.forEach(tile => tile.style.outline = "1px #CCC solid");
        nogridlines = false;
        e.target.style.backgroundColor = "#384950";
        e.target.style.color = "#091318";
    }else{
        tiles.forEach(tile => tile.style.outline = "0");
        nogridlines = true;
        e.target.style.backgroundColor = "#42565e";
        e.target.style.color = "#0f2027";
    }
}


//Colours in buttons when hovered over
function buttonFocus(e){
    e.target.style.backgroundColor = "#384950";
    e.target.style.color = "#091318";
}
function buttonUnfocus(e, state){
    if(state){
        e.target.style.backgroundColor = "#42565e";
        e.target.style.color = "#0f2027";
    }
}

//Defines grid size of board
const boardSize = document.querySelector(".size");
boardSize.value = 16;
const boardSizeText = document.querySelector(".sizeText");
boardSizeText.innerText = "gridsize: 16 × 16";
boardSize.addEventListener("input", function(e){
    size = e.target.value;
    boardSizeText.innerText = `gridsize: ${size} × ${size}`;
    clearBoard(e);
});




//Clears board~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const clear = document.querySelector(".clear");
clear.addEventListener("click", clearBoard);

function clearBoard(e){
    tiles.forEach(tile => tile.parentNode.removeChild(tile));
    makeGrid(size, size);
}

//Established on load~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.onload = () =>{
    makeGrid(size,size);
}

function rgbToHex(rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
};
  
function getFullHex(arr) {  
    var red = rgbToHex(arr[0]);
    var green = rgbToHex(arr[1]);
    var blue = rgbToHex(arr[2]);
    return "#" + red+green+blue;
}

function tilesToMatrix(arr){
    const matrix = [];
    for(let i = 0; i < size; i++){
        let row = [];
        for(let j = 0; j < size; j++){
            let temp = i*size + j;
            row.push(tiles[temp]);
        }
        matrix.push(row);
    }
    return(matrix);
}

function coordToIndex(x,y){
    return(y*size + x);
}

function fillConnected(x, y, grid, colourToCheck, e){
    //remember it goes grid[y][x]
    if(x < 0 || y < 0 || x > size - 1 || y > size - 1 || grid[y][x].style.backgroundColor != colourToCheck){
        return;
    }else{
        grid[y][x].style.backgroundColor = getInkColour(e);
        fillConnected(x+1, y, grid, colourToCheck, e);
        fillConnected(x-1, y, grid, colourToCheck, e);
        fillConnected(x, y+1, grid, colourToCheck, e);
        fillConnected(x, y-1, grid, colourToCheck, e);
    }
}

function getColours(e){
    let colour = e.target.style.backgroundColor;
    let colours = colour.slice(4, -1).replace(/ /g, "").split(",", 3);
    if(colours.length == 1){
        colours = [255,255,255];
    }
    return(colours);
}

function randomColour(){
    let rand = Math.floor(Math.random()*255);
    console.log(rand);
    return(rand);
}