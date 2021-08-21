//Set variables for script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const grid = document.querySelector(".grid");
const inkSelector = document.querySelector(".colourSelector");
inkSelector.addEventListener("input", setColour);
let mouseDown = false;
let inkcolour = "#000"
let gridlines = true;
let tiles;

//Set variables for script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
document.body.onmousedown = function(){
    mouseDown = true;
}
document.body.onmouseup = function(){
    mouseDown = false;
}

function makeGrid(rows, cols){
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for(let i = 0; i < (rows*cols); i++){
        let tile = document.createElement("div");
        tile.classList.add("square");
        tile.setAttribute("draggable", false);
        tile.setAttribute("ondragstart", "return false;")
        tile.style.outline = "0"
        tile.addEventListener("mousedown", colourInFirst);
        tile.addEventListener("mouseenter", colourInSecond);

        grid.appendChild(tile);
    }
    
}

//Colouring in~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Colours in cell if mouse is dragged over whilst being held down
function colourInSecond(e){
    
    if(mouseDown){
        e.target.style.backgroundColor = inkcolour;
    }
}
//Colours in cell if mouse is clicked whilst over cell
function colourInFirst(e){
    console.log(mouseDown);
    e.target.style.backgroundColor = inkcolour;
}

function setColour(e){
    inkcolour = e.target.value;
}

//Settings~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const gridlinesButton = document.querySelector(".gridlines");
gridlinesButton.addEventListener("click", toggleGridlines);
gridlinesButton.addEventListener("mouseenter", buttonFocus);
gridlinesButton.addEventListener("mouseleave", buttonUnfocus);


function toggleGridlines(e){
    if(gridlines){
        tiles.forEach(tile => tile.style.outline = "1px #CCC solid");
        gridlines = false;
        e.target.style.backgroundColor = "#384950";
        e.target.style.color = "#091318";
    }else{
        tiles.forEach(tile => tile.style.outline = "0");
        gridlines = true;
        e.target.style.backgroundColor = "#42565e";
        e.target.style.color = "#0f2027";
    }
}

function buttonFocus(e){
    e.target.style.backgroundColor = "#384950";
    e.target.style.color = "#091318";
}
function buttonUnfocus(e){
    if(gridlines){
        e.target.style.backgroundColor = "#42565e";
        e.target.style.color = "#0f2027";
    }
}

const clear = document.querySelector(".clear");
clear.addEventListener("click", clearBoard);

function clearBoard(e){
    tiles.forEach(tile => tile.style.backgroundColor = "white");
}

//Established on load~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.onload = () =>{
    makeGrid(16,16);
    tiles = document.querySelectorAll(".square");
    console.log(tiles);
}
