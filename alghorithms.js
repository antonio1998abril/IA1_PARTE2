async function depthFirstSearch(location = start, path = []) {
    let y = location[0];
    let x = location[1];

    
    if (matrix[y][x] === -3)
    {
        path["end"] = [y, x];
        await drawFinalPath(path);
        return path;
    }

    checked++;

    visited[y][x] = true;

    matrix[y][x] = -4;


    counter++;
    if (size < 30)
    {
        if (counter % Math.floor(10 - size) === 0)
            await sleep(size);
    }
    else
        await sleep(size);

    if (!visited[y + 1][x])
    {
        path[[y + 1, x]] = [y, x];
        let newpath = await depthFirstSearch([y + 1, x], path);
        if (newpath)
        {
            await drawFinalPath(path);
            return newpath;
        }
    }
    if (!visited[y - 1][x])
    {
        path[[y - 1, x]] = [y, x];
        let newpath = await depthFirstSearch([y - 1, x], path);
        if (newpath)
        {
            await drawFinalPath(path);
            return newpath;
        }
    }
    if (!visited[y][x + 1])
    {
        path[[y, x + 1]] = [y, x];
        let newpath = await depthFirstSearch([y, x + 1], path);
        if (newpath)
        {
            await drawFinalPath(path);
            return newpath;
        }
    }
    if (!visited[y][x - 1])
    {
        path[[y, x - 1]] = [y, x];
        let newpath = await depthFirstSearch([y, x - 1], path);
        if (newpath)
        {
            await drawFinalPath(path);
            return newpath;
        }
    }

    return false;
}


async function breathFirstSearch(order = [start], path = []) {
    let y = order[0][0];
    let x = order[0][1];    

    if (matrix[y][x] === -3)
    {
        path["end"] = [y, x];
        await drawFinalPath(path);
        return path;
    }

    checked++;

    visited[y][x] = true;

    counter++;
    if (size < 30)
    {
        if (counter % Math.floor(40 - size) === 0)
            await sleep(size);
    }
    else
        await sleep(size);

    matrix[y][x] = -4;

    if (!visited[y + 1][x])
    {
        visited[y + 1][x] = true;
        path[[y + 1, x]] = [y, x];
        order.push([y + 1, x]);
    }
    if (!visited[y - 1][x])
    {
        visited[y - 1][x] = true;
        path[[y - 1, x]] = [y, x];
        order.push([y - 1, x]);
    }
    if (!visited[y][x + 1])
    {
        visited[y][x + 1] = true;
        path[[y, x + 1]] = [y, x];
        order.push([y, x + 1]);
    }
    if (!visited[y][x - 1])
    {
        visited[y][x - 1] = true;
        path[[y, x - 1]] = [y, x];
        order.push([y, x - 1]);
    }

    order.shift();
    let newpath = breathFirstSearch(order, path);
    if (newpath)
    {
        return newpath;
    }
}

function heuristicManhattan(location){
    let x = location[1];
    let y = location[0];

    let distance = Infinity;

    for(let i = 0; i < allEnds.length; i++)
    {
        let xDistance = Math.abs(x - allEnds[i][1]);
        let yDistance = Math.abs(y - allEnds[i][0]);
        let d = xDistance + yDistance;
        if (d < distance)
            distance = d;
    }    
    return distance * minCost;
}

async function greedyBestFirstSearch(location = start, path = [], heap = new Heap()) {
    let x = location[1];
    let y = location[0];

    if (matrix[y][x] === -3)
    {
        path["end"] = [y, x];
        await drawFinalPath(path);
        return path;
    }

    checked++;

    visited[y][x] = true;
    matrix[y][x] = -4;
    await sleep(size);

    if (!visited[y + 1][x])
    {
        let grade = await heuristicManhattan([y + 1, x]);
        heap.push(grade, [y + 1, x]);
        path[[y + 1, x]] = [y, x];
        visited[y + 1][x] = true;
    }
    if (!visited[y - 1][x])
    {
        let grade = await heuristicManhattan([y - 1, x]);
        heap.push(grade, [y - 1, x]);
        path[[y - 1, x]] = [y, x];
        visited[y - 1][x] = true;
    }
    if (!visited[y][x + 1])
    {
        let grade = await heuristicManhattan([y, x + 1]);
        heap.push(grade, [y, x + 1]);
        path[[y, x + 1]] = [y, x];
        visited[y][x + 1] = true;
    }
    if (!visited[y][x - 1])
    {
        let grade = await heuristicManhattan([y, x - 1]);
        heap.push(grade, [y, x - 1]);
        path[[y, x - 1]] = [y, x];
        visited[y][x - 1] = true;
    }

    nextN = heap.popHeap();

    let newpath =  greedyBestFirstSearch(nextN, path, heap);
    if (newpath)
    {
        return newpath;
    }
}

async function astar(location = start, path = [], heap = new Heap(), priceArray = []) {
    let x = location[1];
    let y = location[0];


    if (matrix[y][x] === -3)
    {
        path["end"] = [y, x];
        await drawFinalPath(path);
        return path;
    }

    let priceToThis = priceArray[[y, x]];
    if (!priceToThis)
        priceToThis = 0;


    checked++;
    if (!visited[y][x])
    {

        counter++;
        if (size < 30)
        {
            if (counter % Math.floor(10 - size) === 0)
                await sleep(size);
        }
        else
            await sleep(size);

        matrix[y][x] = -4;
        visited[y][x] = true;

        if (!visited[y + 1][x])
        {
            let priceToChild = priceToThis + maze[y + 1][x];
            let grade = await heuristicManhattan([y + 1, x]) + priceToChild;
            heap.push(grade, [y + 1, x]);
            priceArray[[y + 1, x]] = priceToChild;
            path[[y + 1, x]] = [y, x];
        }
        if (!visited[y - 1][x])
        {
            let priceToChild = priceToThis + maze[y - 1][x];
            let grade = await heuristicManhattan([y - 1, x]) + priceToChild;
            heap.push(grade, [y - 1, x]);
            priceArray[[y - 1, x]] = priceToChild;
            path[[y - 1, x]] = [y, x];
        }
        if (!visited[y][x + 1])
        {
            let priceToChild = priceToThis + maze[y][x + 1];
            let grade = await heuristicManhattan([y, x + 1]) + priceToChild;
            heap.push(grade, [y, x + 1]);
            priceArray[[y, x + 1]] = priceToChild;
            path[[y, x + 1]] = [y, x];
        }
        if (!visited[y][x - 1])
        {
            let priceToChild = priceToThis + maze[y][x - 1];
            let grade = await heuristicManhattan([y, x - 1]) + priceToChild;
            heap.push(grade, [y, x - 1]);
            priceArray[[y, x - 1]] = priceToChild;
            path[[y, x - 1]] = [y, x];
        }
    }

    let nextN = heap.popHeap();
    let newpath =  await astar(nextN, path, heap, priceArray);
    if (newpath)
    {
        return newpath;
    }
}