let result;
let all = [];
let matrix = [];
let maze = [];
let visited = [];
let visitedReset = [];

let size;
let start;

let showCostCheckbox;
let showCost = false;


let izris = true;
let sleepValue;
let free = true;

let counter = 0;
let allEnds = [];

let checked = 0;
let price = 0;
let pathlength = 0;

let mazetest = [];
let minCost = Infinity;

let showStatus = false;
let prevStatus = ""
let status = ""
let algoStatus = ""
let stopGenetic = false;
let firstGenetic = true;

function preload() {
    for (let i = 1; i <= 15; i++)
        all.push(loadStrings('res/labyrinth_' + i + '.txt'));
    result = loadStrings('res/labyrinth_10.txt');
    //result = loadStrings('res/genetictest.txt');
}

function setup() {
    createCanvas(800, 800);
    background(51);
    loadMaze();
    size = (matrix.length > matrix[0].length) ? matrix.length : matrix[0].length;
    size = 800 / size;
    
    showCostCheckbox = document.getElementById("ShowCost");
    sleepValue = 0;
    drawMaze();    
}

function draw() {
    showCost = showCostCheckbox.checked;

    if (result)
        drawMaze();

    if (algoStatus == "GENETIC"){
        status = algoStatus + "\nPopulation: " + populationSize + "\nGeneration: " + nGeneration; // + "\nHeuristic sum: " + sumPathHeuristic;
    }
    else{
        status = algoStatus + "\nComprobado: " + checked + "\nLongitud de trayecoria: " + pathlength + "\nCosto: " + price;
    }
    let resultStatus = prevStatus;
    if (showStatus){
        resultStatus = status + "\n \n" + resultStatus;        
    }

    document.getElementById("status").innerText = resultStatus;      
}

function loadMaze() {
    visitedReset = [];
    for (let i = 0; i < result.length - 1; i++) {
        let row = result[i].split(",");
        let rowToPush = [];
        let rowToPush2 = [];
        let v = [];
        for (let j = 0; j < row.length; j++)
        {
            rowToPush.push(parseInt(row[j]));
            rowToPush2.push(parseInt(row[j]));
            if (rowToPush[j] === -1)
                v.push(true);
            else
                v.push(false);

            if (rowToPush[j] === -3)
                allEnds.push([i, j]);
            else if (rowToPush[j] === -2)
                start = [i, j];
            
            if (rowToPush[j] >= 0)
            {
                minCost = (rowToPush[j] < minCost) ? rowToPush[j] : minCost;
            }
        }
        visited.push(v);
        matrix.push(rowToPush);
        maze.push(rowToPush2);        
    }
    for (let i = 0; i < visited.length; i++)
    {
        visitedReset.push(visited[i].slice());
    }
    
}

function drawMaze() {
    matrix[start[0]][start[1]] = -2;
    for (let i = 0; i < allEnds.length; i++)
        matrix[allEnds[i][0]][allEnds[i][1]] = -3;
    for (let i = 0; i < matrix.length; i++)
    {
        for (let j = 0; j < matrix[i].length; j++)
        {
            switch (matrix[i][j]) {
                case -1:
                    fill("black");
                    break;
                case -2:
                    fill("red");
                    break;
                case -3:
                    fill("yellow");
                    break;
                case -4:
                    fill("blue");
                    break;
                case -5:
                    fill("magenta");
                    break;
                default:
                    fill("white");
                    break;
            }
            rect(j * size, i * size, size, size);
            if (showCost && matrix[i][j] !== -3 && matrix[i][j] !== -2){
                fill("black");
                textSize(320 / matrix.length);
                text(maze[i][j], j * size + size / 3, (i + 1) * size - size / 2.5);
            }
        }
    }
}

async function drawFinalPath(path) {
    if (izris) {
        let end = path["end"];
        let pathb = [end];
        while(end[0] !== start[0] || end[1] !== start[1])
        {
            end = path[end];
            pathb.push(end);
        }
        path = pathb.reverse();
        for (let i = 0; i < path.length; i++)
        {
            await sleep(size / 2);
            let y = path[i][0];
            let x = path[i][1];
            if (i !== 0 && i !== path.length - 1)
                price += (maze[y][x]);
            pathlength++;
            matrix[y][x] = -5;
        }
        pathlength--;
        izris = false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




document.getElementById("GBFS").onclick = async function() {
    if (free) {
        await clearF();
        free = false;
        algoStatus = "Primero el mejor";
        showStatus = true;
        await greedyBestFirstSearch();
        showStatus = false;
        prevStatus = status + "\n\n" + prevStatus;
        free = true;
    }
};

document.getElementById("ASTAR").onclick = async function() {
    if (free) {
        await clearF();
        free = false;
        algoStatus = "A*";
        showStatus = true;
        await astar();
        showStatus = false;
        prevStatus = status + "\n\n" + prevStatus;
        free = true;
    }
};



document.getElementById("Clear").onclick = async function() {
    stopGenetic = true;
    if (free) {
        clearF();
    }
};



document.getElementById("Random").onclick = async function() {
    stopGenetic = true;
    if (free) {
        free = false;
        let rand = Math.floor(Math.random() * 15 + 1);
        let tmp = all[rand];
        while (tmp === result)
        {
            rand = Math.floor(Math.random() * 15 + 1);
            tmp = all[rand];
        }
        result = tmp;
        clearF();        
        size = (matrix.length > matrix[0].length) ? matrix.length : matrix[0].length;
        size = 800 / size;
        free = true;        
    }
};

function tryingToSave()
{
    let rand = Math.floor(Math.random() * 15 + 1);
    let tmp = all[rand];
    while (tmp === result)
    {
        rand = Math.floor(Math.random() * 15 + 1);
        tmp = all[rand];
    }
    result =  tmp;
    loadMaze();
}

async function clearF() {
    free = false;
    matrix = [];
    maze = [];
    visited = [];
    allEnds = [];

    population = [];
    bestPath = 0;
    bestPathDNA = [];
    bestCurrPath = 0;
    bestCurrPathDNA = [];
    sumPathHeuristic = 0;
    sleepV = 200;  
    

    izris = true;
    checked = 0;
    price = 0;
    pathlength = 0;
    minCost = Infinity;
    if (result)
        loadMaze();
    else
        tryingToSave();
    free = true;
}

function clearVisited(){
    visited = [];
    for (let i = 0; i < visitedReset.length; i++)
    {
        visited.push(visitedReset[i].slice());
    }
}

function clearMatrix(){
    matrix = [];
    for (let i = 0; i < maze.length; i++)
    {
        matrix.push(maze[i].slice());
    }
}


class Heap {
    elements;

    constructor(){
        this.elements = [];
        this.elementsC = [];
    }

    push(element, coords){
        this.elements.push(element);
        this.elementsC.push(coords);
        this.siftup(this.elements.length - 1);
    }

    popHeap()
    {
        let res = this.elementsC[0];
        this.swap(0, this.elements.length - 1);
        this.elements.pop();
        this.elementsC.pop();
        this.siftdown(0);
        return res;
    }

    siftdown(i)
    {
        let l = 2 * i + 1;
        let r = 2 * i + 2;
        let n = this.elements.length;
        if (l < n)
        {
            if (r < n && this.elements[r] < this.elements[l])
            {
                l = r;
            }
            if (this.elements[l] < this.elements[i])
            {
                this.swap(i, l);
                this.siftdown(l);
            }
        }
    }

    siftup(i)
    {
        let parent = Math.floor((i - 1) / 2);
        if (this.elements[i] < this.elements[parent])
        {
            this.swap(i, parent);
            this.siftup(parent);
        }
    }

    swap(a, b)
    {
        let tmp = this.elements[a];
        this.elements[a] = this.elements[b];
        this.elements[b] = tmp;
        tmp = this.elementsC[a];
        this.elementsC[a] = this.elementsC[b];
        this.elementsC[b] = tmp;
    }
}
