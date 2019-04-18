/** CONSTANTS **/
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';

let a = [90, 90];
let dx = 42;
var houses = [];
var matrix = [];
M = 5; N = 6;
Hn = 0;  // houses counter
nSteps = 0;
nSalesmen = 0;
maxSalesmen = M * N;


// Get the canvas element
var gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
var ctx = gameCanvas.getContext("2d");
//  Select the colour to fill the canvas
ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
//  Select the colour for the border of the canvas
ctx.strokestyle = CANVAS_BORDER_COLOUR;
// Draw a "filled" rectangle to cover the entire canvas
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
// Draw a "border" around the entire canvas
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
// font size
ctx.font = "bold 12px Arial";

function createMatrix(m, n) {
    for (var i = 0; i < m; i++) {
        matrix[i] = new Array(n);
    }
}

function addHouse(b, a) {
    // use this only at the beginning while creating house
    a1 = a + 1; b1 = b + 1;
    ax = a1 * dx + (a1 - 1) * 2 * dx;
    by = b1 * dx + (b1 - 1) * 2 * dx;
    var house =
    {
        hidx: Hn,
        x: by,
        y: ax,
        color: 'orange',
        s: 0,
        u: 1
    };
    houses.push(house);
    ++Hn;
}

function geth(i, j) {
    return j + N * i;
}


function getij(h) {
    j = h % N;
    i = parseInt(h / N);
    return [i, j];
}


function drawHousePart(h) {
    ctx.fillStyle = houses[h].color;
    ctx.strokestyle = houses[h].color;
    var x = houses[h].x;
    var y = houses[h].y;

    ctx.fillRect(x, y, dx, dx);
    ctx.strokeRect(x, y, dx, dx);
    ctx.fillStyle = 'black';
    ctx.fillText(`S: ${houses[h].s}`, x + dx / 4, y + dx / 2.25);
    ctx.fillText(`U: ${houses[h].u}`, x + dx / 4, y + dx / 1.15);
    ij = getij(h);
    ctx.fillText(`${ij[0]},${ij[1]}`, x + dx / 4, y + dx / 0.75);
}

function updateHouse(h, colorh, s, u) {
    houses[h].color = colorh;
    houses[h].s = s;
    houses[h].u = u;
    drawHousePart(h);
}

function initialization() {
    h = 0;
    createMatrix(M, N);
    for (var i = 0; i < M; i++) {
        for (var j = 0; j < N; j++) {
            addHouse(j, i);
            drawHousePart(h);
            ++h;
        }
    }
    updateHouse(0, 'lightgreen', 1, 0); // initialize with 1 salesman at top left
    nSalesmen = 1;
    $("#curSalesMenID").text(nSalesmen);  // update ui counter as well
}



function getneighbors(i, j) {
    var nei = [];  // each element will have minimum 2 to max 4 neighbors    
    switch (i) {
        case 0:  // first row
            switch (j) {
                case 0: // top left
                    nei.push([0, 1]);
                    nei.push([1, 0]);
                    break;
                case (N - 1): // top right
                    nei.push([0, N - 2]);
                    nei.push([1, N - 1]);
                    break;
                default: // other middle elements on 1st row will have 3 neighbors
                    nei.push([i, j - 1]);
                    nei.push([i, j + 1]);
                    nei.push([i + 1, j]);
                    break;
            }
            break;
        case (M - 1): // last row
            switch (j) {
                case 0: // bottom left
                    nei.push([M - 2, 0]);
                    nei.push([M - 1, 1]);
                    break;
                case (N - 1): // bottom right
                    nei.push([M - 2, N - 1]);
                    nei.push([M - 1, N - 2]);
                    break;
                default: // other middle elements on last row will have 3 neighbors
                    nei.push([M - 1, j - 1]);
                    nei.push([M - 1, j + 1]);
                    nei.push([M - 2, j]);
                    break;
            }
            break;
        default: // somewhere in middle
            switch (j) {
                case 0: // 0th column middle
                    if (i < (M - 1)) {
                        nei.push([i, j + 1]);
                        nei.push([i - 1, j]);
                        nei.push([i + 1, j]);
                    }
                    break;
                case (N - 1): // Nth column middle
                    if (i < (M - 1)) {
                        nei.push([i, N - 2]);
                        nei.push([i - 1, N - 1]);
                        nei.push([i + 1, N - 1]);
                    }
                    break;
                default: // middle elements in array will have 4 neighbors
                    if (i < (M - 1)) {
                        nei.push([i, j - 1]);
                        nei.push([i, j + 1]);
                        nei.push([i - 1, j]);
                        nei.push([i + 1, j]);
                    }
                    break;
            }
            break;
    }
    return nei;
}


function getgreenhouses() {
    // return a list of house indices, where S > 0
    var nehs = [];
    for (var k = 0; k < houses.length; k++) {
        if (houses[k].s > 0) {
            var h = houses[k].hidx;
            var ijs = getij(h);
            var i = ijs[0]; var j = ijs[1];
            nehs.push([i, j]);
        }
    }
    return nehs;
}

function getSalesmenCount() {
    // return current total salesmen count
    var nSales = 0;
    for (var k = 0; k < houses.length; k++) {
        nSales += houses[k].s;
    }
    return nSales;
}

function trigOnce() {

    if (nSalesmen == maxSalesmen) 
    {
        alert('No more houses to hire new salesmen. Please reset and try again.');
    }
    else 
    {
        // get all non empty houses
        var nehsidxarray = getgreenhouses();

        console.log(`No of Green houses:${nehsidxarray.length}`);

        // for each non empty house, ..
        for (var i = 0; i < nehsidxarray.length; i++) // this is array of neighbor index [ [0,1], [1,0], ... ]
        {

            var tmpSourIdx = nehsidxarray[i];
            var si = tmpSourIdx[0]; var sj = tmpSourIdx[1];
            var sh = geth(si, sj);
            var ss = houses[sh].s;  // get no of available sales men in that..
            var su = houses[sh].u;
            console.log(`source house address:${si},${sj}     S:${ss} U:${su}`);

            // for each SOURCE HOUSE, find neighboring houses
            var neisidxarray = getneighbors(si, sj);

            // send one salesmen to each neighboring house 
            var k = ss;
            for (var j = 0; j < neisidxarray.length; j++)  // this is array of neighbor index [ [0,1], [1,0], ... ]
            {
                var tmpTarIdx = neisidxarray[j];  // get one neighbor index pair, say [0,1]
                var ti = tmpTarIdx[0]; tj = tmpTarIdx[1];  // assign to individual i, j
                var th = geth(ti, tj);
                var ts = houses[th].s;  // get no of available sales men in that..
                var tu = houses[th].u;
                console.log(`neighbor house address:${ti},${tj}     S:${ts} U:${tu}`);

                // only when that house has u = 1 and we haev enough salesman
                if (tu == 1 && k > 0) {
                    // target gets 2 additional salesmen with already whatever it has
                    // because of 1 incoming salesman and 1 resident unemployed
                    updateHouse(th, 'lightgreen', 2, 0);

                    // source loses one salesmen per target
                    k = k - 1;
                    updateHouse(sh, 'lightgreen', k, su);

                }
            }

        }
        nSalesmen = getSalesmenCount()
        $("#curSalesMenID").text(nSalesmen);  // update ui counters
        ++nSteps;
        $("#curStepsID").text(nSteps);
        $("#curTimeID").text(nSteps);
        nehsidxarray.length = 0;
    }

}

function reset()
{

    houses = [];
    matrix = [];
    Hn = 0;  // houses counter
    nSteps = 0;
    nSalesmen = 0;
    maxSalesmen = M * N;    
    $("#curSalesMenID").text(nSalesmen);  // update ui counters
    $("#curStepsID").text(nSteps);
    $("#curTimeID").text(nSteps);    
    initialization();
}

initialization();

// short tests
// console.log(geth(1,3));  // quick test
// console.log(getij(9));  // quick test
// updateHouse(geth(4,0),'lightgreen',5,3);
// console.log(getneighbors(2,5));
// console.log(getgreenhouses());




