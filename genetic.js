let population = [];
let populationSize;
let mutationRate = 0.01;

let bestPath = 0;
let bestPathDNA = [];
let bestCurrPath = 0;
let bestCurrPathDNA = [];
let nGeneration = 0;

let sumPathHeuristic = 0;
let sleepV = 200;


async function genetic(){    
   
    //lifeLength = floor(maze[0].length * 1.5);
    //lifeLength = 25;
    
    nGeneration = 0;
    populationSize = Math.floor(matrix.length / 3);
    clearVisited();
    for (let i = 0; i < populationSize; i++)
    {
        //await sleep(0);
        
        let path = new Path();
        population.push(path);  
        
        if (path.heurstic > bestPath)
        {
            bestPath = path.heurstic;
            bestPathDNA = path.dna;           
        }
        sumPathHeuristic += path.heurstic;  
    }       

    bestPath = 0;
    await drawCurrentBestPathGenetic();
    await drawBestPathGenetic();
    
    newGeneration();        
}

async function newGeneration()
{   
    if (stopGenetic){
        prevStatus = status + "\n\n" + prevStatus;
        showStatus = false;
        return true;
    }

    nGeneration++;

    makeNewGeneration();
    calculatePath();

    clearMatrix();
    
    if (sleepV < 400)
        sleepV++;

    drawCurrentBestPathGenetic();
    await drawBestPathGenetic();

    newGeneration();
}

async function drawCurrentBestPathGenetic(){
    let currPos = start.slice();
    for (let i = 0; i < bestCurrPathDNA.length; i++)
    {        
        currPos[0] += bestCurrPathDNA[i][0];
        currPos[1] += bestCurrPathDNA[i][1];

        let y = currPos[0];
        let x = currPos[1];

        matrix[y][x] = -4;
        visited[y][x] = true;
    }    
}


async function drawBestPathGenetic(){
    let currPos = start.slice();
    for (let i = 0; i < bestPathDNA.length; i++)
    {        
        currPos[0] += bestPathDNA[i][0];
        currPos[1] += bestPathDNA[i][1];

        let y = currPos[0];
        let x = currPos[1];

        matrix[y][x] = -5;
        visited[y][x] = true;
    }

    await sleep(sleepV);
    
}

function makeNewGeneration(){
    let newPopulation = [];
    for (let i = 0; i < populationSize; i++)
    {
        let parent = findParent();
        let path = new Path(population[parent]);
        newPopulation.push(path);
    }
    population = newPopulation;
}

function findParent(){
    let index = 0;
    let rnd = random(sumPathHeuristic);
    while (rnd > 0){
        rnd -= population[index].heurstic;
        index++;
    }
    index--;
    return index;
}

function calculatePath(){
    sumPathHeuristic = 0;
    /* bestPath = 0;
    bestPathDNA = []; */
    bestCurrPath = 0;
    bestCurrPathDNA = [];    
    
    for (let i = 0; i < populationSize; i++)
    {
        let path = population[i];

        if (path.heurstic > bestCurrPath)
        {
            bestCurrPath = path.heurstic;
            bestCurrPathDNA = path.dna;           
        }
        sumPathHeuristic += path.heurstic;        
    } 
    
    if (bestCurrPath > bestPath){
        bestPath = bestCurrPath;
        bestPathDNA = bestCurrPathDNA;
    }
    
}

class Path{
    dna = [];
    heurstic;

    constructor(parent){
        let stuck = false;
        let found = false;
        let currPos;
            if (!parent)
            {           
            currPos = start.slice();

            clearVisited();

            visited[currPos[0]][currPos[1]] = true;
        
            while(true)
            {
                let viable = viableDirections(currPos);
                let direction = floor(random(viable.length));
        
                if (viable.length > 0){            
                    currPos[0] += viable[direction][0];
                    currPos[1] += viable[direction][1];
                    
                    this.dna.push(viable[direction]);
                    
                    let y = currPos[0];
                    let x = currPos[1];
                    
                    
                    visited[y][x] = true;
                    
                    if (matrix[y][x] == -3){
                        found = true;
                        break;                                   
                    }
                }
                else {
                    stuck = true;
                    break;
                }
            }                       
            this.heurstic = 1 / this.dna.length;   
            if (found){
                this.heurstic *= 5;
            }        
        }
        else
        {
            clearVisited();            
            let l = floor(random(parent.dna.length / 2) + parent.dna.length / 2);

            // kinda mutation ??
            for (let i = 0; i < l; i++)
            {
                let rnd = random(1);
                if (rnd < mutationRate)
                    l = i;
            }

            this.dna = parent.dna.slice(0, l);
            
            
            currPos = start.slice();
            visited[currPos[0]][currPos[1]] = true;
            for (let i = 0; i < l; i++)
            {
                currPos[0] += this.dna[i][0];
                currPos[1] += this.dna[i][1];
                visited[currPos[0]][currPos[1]] = true;
            }

            while (true){
                let viable = viableDirections(currPos);
                let direction = floor(random(viable.length));
                
                if (viable.length > 0){            
                    currPos[0] += viable[direction][0];
                    currPos[1] += viable[direction][1];
                    
                    this.dna.push(viable[direction]);
                    
                    let y = currPos[0];
                    let x = currPos[1];
                    
                    
                    visited[y][x] = true;

                    if (matrix[y][x] == -3){
                        found = true;
                        break;                                   
                    }  
                }
                else{                    
                    stuck = true;
                    break;
                }
                l++;
            }                        
            
            this.heurstic = 1 / this.dna.length;    
            if (found){
                this.heurstic *= 5;
            }   
        }
        if (stuck)
            this.heurstic = 1 / (200 - this.dna.length);
        
        this.heurstic *= this.heurstic + 0.05 * 1 / (heuristicManhattan(currPos) + 1);
    }
    
}



function viableDirections(pos){
    let directions = [];

    let y = pos[0];
    let x = pos[1];
    
    if (!visited[y + 1][x])
        directions.push([1, 0]);
    if (!visited[y - 1][x])
        directions.push([-1, 0]);
    if (!visited[y][x + 1])
        directions.push([0, 1]);
    if (!visited[y][x - 1])
        directions.push([0, -1]);    
    
    return directions;
}
