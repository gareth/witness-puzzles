window.DISABLE_CACHE = true

window.onload = function() {
  var table = document.getElementById('meta')
  var numFailures = 0
  var testNames = Object.keys(tests)
  for (var i=0; i<testNames.length; i++) {
    if (i%3 === 0) table.insertRow()
    var testName = testNames[i]

    var cell = table.rows[table.rows.length - 1].insertCell()
    cell.style.textAlign = 'center'
    cell.width = '33%'
    var puzzleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    puzzleSvg.id = testName
    cell.appendChild(puzzleSvg)

    try {
      var puzzleData = tests[testName]()
      var puzzle = puzzleData[0]
      var expectedSolutions = puzzleData[1]
      window.draw(puzzle, testName)
      var solutions = window.solve(puzzle)
    } catch (e) {
      console.error('Test', testName, 'errored:', e)
      var border = puzzleSvg.firstChild
      border.setAttribute('stroke', 'red')
      numFailures++
    }
    if (solutions.length !== expectedSolutions) {
      console.error('Test', testName, 'has', solutions.length, 'solutions, should have', expectedSolutions)
      for (var solution of solutions) {
        solution.logGrid()
      }
      var border = puzzleSvg.firstChild
      border.setAttribute('stroke', 'red')
      numFailures++
    }
  }
  return numFailures
}

var tests = {
  'end-left': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[4][4].start = true
    puzzle.grid[0][2].end = 'left'
    return [puzzle, 10]
  }, 'end-right': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][0].start = true
    puzzle.grid[4][2].end = 'right'
    return [puzzle, 10]
  }, 'end-up': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[2][0].end = 'top'
    return [puzzle, 10]
  }, 'end-down': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[4][0].start = true
    puzzle.grid[2][4].end = 'bottom'
    return [puzzle, 10]
  }, 'mid-segment-end': function() {
    var puzzle = new Puzzle(1, 1)
    puzzle.grid[0][0].start = true
    puzzle.grid[0][1].end = 'left'
    puzzle.grid[0][2].start = true
    puzzle.grid[1][0].end = 'top'
    puzzle.grid[1][2].end = 'bottom'
    puzzle.grid[2][0].start = true
    puzzle.grid[2][1].end = 'right'
    puzzle.grid[2][2].start = true
    return [puzzle, 32]
  }, 'gap-2-internal-end': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][0].start = true
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].start = true
    puzzle.grid[4][4].start = true
    puzzle.grid[1][2].gap = 2
    puzzle.grid[2][1].gap = 2
    puzzle.grid[2][3].gap = 2
    puzzle.grid[3][2].gap = 2
    puzzle.grid[0][1].end = 'right'
    puzzle.grid[0][2].end = 'right'
    puzzle.grid[0][3].end = 'right'
    puzzle.grid[1][0].end = 'bottom'
    puzzle.grid[2][0].end = 'bottom'
    puzzle.grid[3][0].end = 'bottom'
    puzzle.grid[4][1].end = 'left'
    puzzle.grid[4][2].end = 'left'
    puzzle.grid[4][3].end = 'left'
    puzzle.grid[1][4].end = 'top'
    puzzle.grid[2][4].end = 'top'
    puzzle.grid[3][4].end = 'top'
    return [puzzle, 96]
  }, 'negation-with-dots': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[3][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[2][1].dot = 1
    puzzle.grid[4][1].dot = 1
    puzzle.grid[3][0].dot = 1
    puzzle.grid[3][2].dot = 1
    return [puzzle, 39]
  }, 'simple-negation': function() {
    var puzzle = new Puzzle(3, 1)
    puzzle.grid[0][2].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[3][1] = {'type':'square', 'color':'orange'}
    puzzle.grid[5][1] = {'type':'square', 'color':'blue'}
    return [puzzle, 2]
  }, 'simple-double-negation': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[5][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[5][5] = {'type':'nega', 'color':'white'}
    puzzle.grid[1][1] = {'type':'square', 'color':'orange'}
    puzzle.grid[3][1] = {'type':'square', 'color':'blue'}
    puzzle.grid[3][5] = {'type':'poly', 'color': 'yellow', 'polyshape':1}
    return [puzzle, 41]
  }, 'double-negation-with-double-squares': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[3][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[1][3] = {'type':'square', 'color':'orange'}
    puzzle.grid[3][3] = {'type':'square', 'color':'blue'}
    puzzle.grid[5][3] = {'type':'square', 'color':'blue'}
    return [puzzle, 62]
  }, 'double-negation-with-double-squares-2': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[3][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[1][3] = {'type':'square', 'color':'orange'}
    puzzle.grid[3][3] = {'type':'square', 'color':'blue'}
    puzzle.grid[5][3] = {'type':'square', 'color':'blue'}
    puzzle.grid[2][2].dot = 1
    return [puzzle, 80]
  }, 'negation-complexity': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[1][3] = {'type':'square', 'color':'orange'}
    puzzle.grid[3][1] = {'type':'square', 'color':'blue'}
    puzzle.grid[3][3] = {'type':'square', 'color':'orange'}
    return [puzzle, 5]
  }, 'negation-complexity-2': function() {
    var puzzle = new Puzzle(3, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[3][1] = {'type':'square', 'color':'blue'}
    puzzle.grid[5][1] = {'type':'star', 'color':'blue'}
    puzzle.grid[3][3] = {'type':'square', 'color':'orange'}
    puzzle.grid[5][3] = {'type':'square', 'color':'orange'}
    return [puzzle, 6]
  }, 'negation-complexity-3': function() {
    var puzzle = new Puzzle(3, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[3][1] = {'type':'square', 'color':'blue'}
    puzzle.grid[5][1] = {'type':'star', 'color':'blue'}
    puzzle.grid[1][3] = {'type':'nega', 'color':'white'}
    puzzle.grid[3][3] = {'type':'square', 'color':'orange'}
    puzzle.grid[5][3] = {'type':'square', 'color':'orange'}
    return [puzzle, 7]
  }, 'negation-complexity-B1': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'black'}
    puzzle.grid[1][3] = {'type':'nega', 'color':'black'}
    puzzle.grid[3][1] = {'type':'square', 'color':'white'}
    puzzle.grid[3][3] = {'type':'star', 'color':'black'}
    return [puzzle, 0]
  }, 'negation-complexity-B2': function() {
    var puzzle = new Puzzle(4, 4)
    puzzle.grid[0][8].start = true
    puzzle.grid[8][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'black'}
    puzzle.grid[1][3] = {'type':'nega', 'color':'black'}
    puzzle.grid[3][3] = {'type':'star', 'color':'black'}
    return [puzzle, 0]
  }, 'simple-polyominos': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':1}
    puzzle.grid[3][1] = {'type':'poly', 'color':'yellow', 'polyshape':17}
    return [puzzle, 14]
  }, 'simple-polyominos-2': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[5][1] = {'type':'poly', 'color':'yellow', 'polyshape':273}
    puzzle.grid[3][3] = {'type':'poly', 'color':'yellow', 'polyshape':50}
    return [puzzle, 1]
  }, 'negation-with-polyominos': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[1][3] = {'type':'poly', 'color':'yellow', 'polyshape':19}
    puzzle.grid[3][1] = {'type':'poly', 'color':'yellow', 'polyshape':35}
    return [puzzle, 5]
  }, 'paiorange-stars': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[1][3] = {'type':'star', 'color':'orange'}
    puzzle.grid[3][1] = {'type':'star', 'color':'blue'}
    puzzle.grid[3][3] = {'type':'star', 'color':'blue'}
    return [puzzle, 4]
  }, 'stars-and-squares': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[1][3] = {'type':'square', 'color':'orange'}
    puzzle.grid[3][1] = {'type':'square', 'color':'orange'}
    puzzle.grid[3][3] = {'type':'star', 'color':'orange'}
    return [puzzle, 4]
  }, 'coloorange-polyominos': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[3][1] = {'type':'poly', 'color':'orange', 'polyshape':17}
    return [puzzle, 2]
  }, 'corner-polyomino': function() {
    var puzzle = new Puzzle(4, 4)
    puzzle.grid[0][8].start = true
    puzzle.grid[8][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':19}
    return [puzzle, 47]
  }, 'polyomino-with-center-start': function() {
    var puzzle = new Puzzle(3, 2)
    puzzle.grid[2][2].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':273}
    puzzle.grid[1][3] = {'type':'poly', 'color':'yellow', 'polyshape':273}
    return [puzzle, 4]
  }, 'polyomino/ylop-with-center-start': function() {
    var puzzle = new Puzzle(3, 2)
    puzzle.grid[2][2].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':273}
    puzzle.grid[1][3] = {'type':'poly', 'color':'yellow', 'polyshape':273}
    puzzle.grid[3][1] = {'type':'ylop', 'color':'blue', 'polyshape':3}
    return [puzzle, 2]
  }, 'polyomino/ylop-with-center-start-2': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[2][4].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':1911}
    puzzle.grid[3][1] = {'type':'ylop', 'color':'blue', 'polyshape':51}
    return [puzzle, 4]
  }, 'polyomino/ylop-with-edge-start': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][2].start = true
    puzzle.grid[6][6].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':823}
    puzzle.grid[3][1] = {'type':'ylop', 'color':'blue', 'polyshape':3}
    return [puzzle, 3]
  }, 'impossible-squares': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'square', 'color':'orange'}
    puzzle.grid[1][3] = {'type':'square', 'color':'blue'}
    puzzle.grid[3][1] = {'type':'square', 'color':'blue'}
    puzzle.grid[3][3] = {'type':'square', 'color':'orange'}
    return [puzzle, 0]
  }, 'dot-and-gap-test': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[0][1].dot = 1
    puzzle.grid[0][3].dot = 1
    puzzle.grid[1][0].dot = 1
    puzzle.grid[3][0].dot = 1
    puzzle.grid[1][2].gap = 1
    puzzle.grid[2][1].gap = 1
    puzzle.grid[2][3].gap = 1
    puzzle.grid[3][2].gap = 1
    return [puzzle, 1]
  }, 'completely-cancel': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':3}
    puzzle.grid[3][3] = {'type':'ylop', 'color':'blue', 'polyshape':3}
    return [puzzle, 6]
  }, 'half-of-game-puzzle': function() {
    var puzzle = new Puzzle(4, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[8][0].end = 'right'
    puzzle.grid[1][3] = {'type':'poly', 'color':'yellow', 'polyshape':547}
    puzzle.grid[3][3] = {'type':'ylop', 'color':'blue'  , 'polyshape':51}
    puzzle.grid[7][3] = {'type':'poly', 'color':'yellow', 'polyshape':802}
    return [puzzle, 2]
  }, 'completely-cancel-2': function() {
    var puzzle = new Puzzle(3, 1)
    puzzle.grid[0][2].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':1}
    puzzle.grid[3][1] = {'type':'ylop', 'color':'blue'  , 'polyshape':17}
    puzzle.grid[5][1] = {'type':'poly', 'color':'yellow', 'polyshape':1}
    return [puzzle, 2]
  }, 'many-partial-cancels': function() {
    var puzzle = new Puzzle(4, 4)
    puzzle.grid[0][8].start = true
    puzzle.grid[8][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':51}
    puzzle.grid[7][1] = {'type':'poly', 'color':'yellow', 'polyshape':1}
    puzzle.grid[3][3] = {'type':'ylop', 'color':'blue'  , 'polyshape':1}
    puzzle.grid[5][3] = {'type':'poly', 'color':'yellow', 'polyshape':1}
    puzzle.grid[7][3] = {'type':'poly', 'color':'yellow', 'polyshape':1}
    puzzle.grid[3][5] = {'type':'ylop', 'color':'blue'  , 'polyshape':1}
    puzzle.grid[5][5] = {'type':'ylop', 'color':'blue'  , 'polyshape':1}
    puzzle.grid[1][7] = {'type':'poly', 'color':'yellow', 'polyshape':50}
    puzzle.grid[7][7] = {'type':'poly', 'color':'yellow', 'polyshape':51}
    puzzle.grid[5][4].gap = 1
    return [puzzle, 17]
  }, 'simple-rpoly': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':1048611}
    return [puzzle, 5]
  }, 'negation-with-stars': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[3][3] = {'type':'nega', 'color':'white'}
    return [puzzle, 6]
  }, 'coloorange-negation-with-stars': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[3][3] = {'type':'nega', 'color':'orange'}
    return [puzzle, 0]
  }, 'coloorange-negation-with-stars-2': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[1][3] = {'type':'star', 'color':'orange'}
    puzzle.grid[3][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[3][3] = {'type':'nega', 'color':'orange'}
    return [puzzle, 2]
  }, 'coloorange-negation-with-stars-3': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.grid[0][4].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[1][3] = {'type':'nega', 'color':'orange'}
    puzzle.grid[3][3] = {'type':'nega', 'color':'orange'}
    return [puzzle, 0]
  }, 'triangles': function() {
    var puzzle = new Puzzle(5, 1)
    puzzle.grid[0][2].start = true
    puzzle.grid[10][0].end = 'right'
    puzzle.grid[1][1] = {'type':'triangle', 'color':'orange', 'count':1}
    puzzle.grid[5][1] = {'type':'triangle', 'color':'orange', 'count':2}
    puzzle.grid[9][1] = {'type':'triangle', 'color':'orange', 'count':3}
    return [puzzle, 2]
  }, 'impossible-triangles': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][0].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'triangle', 'color':'orange', 'count':1}
    puzzle.grid[3][1] = {'type':'triangle', 'color':'orange', 'count':2}
    puzzle.grid[5][1] = {'type':'triangle', 'color':'orange', 'count':3}
    puzzle.grid[1][3] = {'type':'triangle', 'color':'orange', 'count':4}
    puzzle.grid[3][3] = {'type':'triangle', 'color':'orange', 'count':5}
    puzzle.grid[5][3] = {'type':'triangle', 'color':'orange', 'count':6}
    puzzle.grid[1][5] = {'type':'triangle', 'color':'orange', 'count':7}
    puzzle.grid[3][5] = {'type':'triangle', 'color':'orange', 'count':8}
    puzzle.grid[5][5] = {'type':'triangle', 'color':'orange', 'count':9}
    return [puzzle, 0]
  }, 'not-quite-impossible-triangles': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[3][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[3][5] = {'type':'triangle', 'color':'orange', 'count':4}
    return [puzzle, 12]
  }, 'not-quite-impossible-triangles-2': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[3][0].end = 'top'
    puzzle.grid[3][1] = {'type':'triangle', 'color':'orange', 'count':4}
    return [puzzle, 12]
  }, 'triple-negation': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[1][1] = {'type':'nega', 'color':'white'}
    puzzle.grid[3][3] = {'type':'nega', 'color':'white'}
    puzzle.grid[5][5] = {'type':'nega', 'color':'white'}
    return [puzzle, 0]
  }, 'pillar-with-gap': function() {
    var puzzle = new Puzzle(2, 1, pillar=true)
    puzzle.grid[0][2].start = true
    puzzle.grid[2][0].end = 'top'
    puzzle.grid[1][0].gap = 1
    puzzle.grid[1][2].gap = 1
    return [puzzle, 2]
  }, 'pillar-with-stones': function() {
    var puzzle = new Puzzle(2, 1, pillar=true)
    puzzle.grid[2][2].start = true
    puzzle.grid[2][0].end = 'top'
    puzzle.grid[1][1] = {'type':'square', 'color':'white'}
    puzzle.grid[3][1] = {'type':'square', 'color':'black'}
    puzzle.end = {'x':2, 'y':0}
    return [puzzle, 0]
  }, 'pillar-with-poly': function() {
    var puzzle = new Puzzle(2, 2, pillar=true)
    puzzle.grid[2][4].start = true
    puzzle.grid[2][0].end = 'top'
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':49}
    return [puzzle, 0]
  }, 'pillar-with-stars': function() {
    var puzzle = new Puzzle(2, 1, pillar=true)
    puzzle.grid[2][2].start = true
    puzzle.grid[2][0].end = 'top'
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[3][1] = {'type':'star', 'color':'orange'}
    return [puzzle, 5]
  }, 'invisible-poly': function() {
    var puzzle = new Puzzle(2, 1)
    puzzle.grid[0][2].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'polyshape':0}
    return [puzzle, 4]
  }, 'invisible-ylop': function() {
    var puzzle = new Puzzle(2, 1)
    puzzle.grid[0][2].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[3][1] = {'type':'ylop', 'polyshape':0}
    return [puzzle, 4]
  }, 'invisible-poly-and-ylop': function() {
    var puzzle = new Puzzle(2, 1)
    puzzle.grid[0][2].start = true
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[1][1] = {'type':'poly', 'polyshape':0}
    puzzle.grid[3][1] = {'type':'ylop', 'polyshape':0}
    return [puzzle, 4]
  }, 'laser-key': function() {
    var puzzle = new Puzzle(0, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[0][0].end = 'right'
    return [puzzle, 1]
  }, 'straight': function() {
    var puzzle = new Puzzle(3, 0)
    puzzle.grid[0][0].start = true
    puzzle.grid[6][0].end = 'right'
    return [puzzle, 1]
  }, 'pillar-square-bug': function() {
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.grid[0][8].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[3][1] = {'type':'square', 'color':'black'}
    puzzle.grid[3][3] = {'type':'square', 'color':'black'}
    puzzle.grid[3][5] = {'type':'square', 'color':'black'}
    puzzle.grid[3][7] = {'type':'square', 'color':'black'}
    puzzle.grid[5][1] = {'type':'square', 'color':'white'}
    puzzle.grid[5][3] = {'type':'square', 'color':'white'}
    puzzle.grid[5][5] = {'type':'square', 'color':'white'}
    puzzle.grid[5][7] = {'type':'square', 'color':'white'}
    puzzle.end = {'x':0, 'y':0, 'dir':'top'}
    return [puzzle, 40]
  }, 'simpler-pillar-square-bug': function() {
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.grid[0][8].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[3][7] = {'type':'square', 'color':'black'}
    puzzle.grid[5][1] = {'type':'square', 'color':'white'}
    puzzle.end = {'x':0, 'y':0, 'dir':'top'}
    return [puzzle, 1373]
  }, 'pillar-poly-bug': function() {
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.grid[0][8].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[7][7] = {'type':'poly', 'color':'yellow', 'polyshape':17}
    puzzle.end = {'x':0, 'y':0, 'dir':'top'}
    return [puzzle, 467]
  }, 'pillar-triangles-bug-NOCACHE': function() {
    window.DISABLE_CACHE = false
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.grid[0][8].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[3][3] = {'type':'triangle', 'color':'orange', 'count':3}
    puzzle.grid[5][5] = {'type':'triangle', 'color':'orange', 'count':3}
    return [puzzle, 111]
  }, 'pillar-triangles-bug': function() {
    window.DISABLE_CACHE = true
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.grid[0][8].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[3][3] = {'type':'triangle', 'color':'orange', 'count':3}
    puzzle.grid[5][5] = {'type':'triangle', 'color':'orange', 'count':3}
    return [puzzle, 111]
  }, 'small-pillar-triangles-bug-NOCACHE': function() {
    window.DISABLE_CACHE = false
    var puzzle = new Puzzle(3, 2, pillar=true)
    puzzle.grid[0][4].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[1][1] = {'type':'triangle', 'color':'orange', 'count':2}
    puzzle.grid[3][3] = {'type':'triangle', 'color':'orange', 'count':2}
    return [puzzle, 7]
  }, 'small-pillar-triangles-bug': function() {
    window.DISABLE_CACHE = true
    var puzzle = new Puzzle(3, 2, pillar=true)
    puzzle.grid[0][4].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[1][1] = {'type':'triangle', 'color':'orange', 'count':2}
    puzzle.grid[3][3] = {'type':'triangle', 'color':'orange', 'count':2}
    return [puzzle, 7]
  }, 'laser-key-pillar': function() {
    var puzzle = new Puzzle(1, 3, pillar=true)
    puzzle.grid[0][6].start = true
    puzzle.grid[0][0].end = 'top'
    return [puzzle, 1]
  }, 'laser-key-pillar-2': function() {
    var puzzle = new Puzzle(2, 5, pillar=true)
    puzzle.grid[0][10].start = true
    puzzle.grid[0][0].end = 'top'
    return [puzzle, 365]
  }, 'multistart-simple': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[2][6].start = true
    puzzle.grid[4][6].start = true
    puzzle.grid[6][6].start = true
    puzzle.grid[6][0].end = 'right'
    return [puzzle, 649]
  }, 'multiend-simple': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[2][0].end = 'top'
    puzzle.grid[4][0].end = 'top'
    puzzle.grid[6][0].end = 'top'
    return [puzzle, 649]
  }, 'multistart-and-end-simple': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[2][6].start = true
    puzzle.grid[4][6].start = true
    puzzle.grid[6][6].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[2][0].end = 'top'
    puzzle.grid[4][0].end = 'top'
    puzzle.grid[6][0].end = 'top'
    return [puzzle, 2320]
  }, 'missing-segments': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[0][1].gap = 2
    puzzle.grid[1][0].gap = 2
    puzzle.grid[6][0].end = 'right'
    return [puzzle, 108]
  }, 'symmetry-1': function() {
    var puzzle = new Puzzle(1, 1)
    puzzle.symmetry = {'x':true, 'y':false}
    puzzle.grid[0][2].start = true
    puzzle.grid[2][2].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[2][0].end = 'top'
    return [puzzle, 2]
  }, 'symmetry-2': function() {
    var puzzle = new Puzzle(2, 2)
    puzzle.symmetry = {'x':true, 'y':false}
    puzzle.grid[0][4].start = true
    puzzle.grid[4][4].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[4][0].end = 'top'
    return [puzzle, 2]
  }, 'symmetry-3-down': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.symmetry = {'x':true, 'y':false}
    puzzle.grid[0][6].start = true
    puzzle.grid[6][6].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[6][0].end = 'top'
    return [puzzle, 16]
  }, 'symmetry-3-left': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.symmetry = {'x':false, 'y':true}
    puzzle.grid[0][6].start = true
    puzzle.grid[0][0].start = true
    puzzle.grid[6][6].end = 'right'
    puzzle.grid[6][0].end = 'right'
    return [puzzle, 16]
  }, 'symmetry-dots': function() {
    var puzzle = new Puzzle(3, 3)
    puzzle.symmetry = {'x':true, 'y':false}
    puzzle.grid[0][6].start = true
    puzzle.grid[6][6].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[6][0].end = 'top'
    puzzle.grid[0][4].dot = 1
    puzzle.grid[0][2].dot = 2
    puzzle.grid[6][4].dot = 1
    puzzle.grid[6][2].dot = 3
    return [puzzle, 5]
  }, 'invisible-dots-with-border': function() {
    window.activeParams = {}
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[0][4].dot = 4
    puzzle.grid[0][2].dot = 4
    puzzle.grid[6][4].dot = 4
    puzzle.grid[6][2].dot = 4
    return [puzzle, 56]
  }, 'invisible-dots': function() {
    window.activeParams = undefined
    var puzzle = new Puzzle(3, 3)
    puzzle.grid[0][6].start = true
    puzzle.grid[6][0].end = 'right'
    puzzle.grid[0][4].dot = 4
    puzzle.grid[0][2].dot = 4
    puzzle.grid[6][4].dot = 4
    puzzle.grid[6][2].dot = 4
    return [puzzle, 56]
  }, 'symmetry-pillar-horizontal': function() {
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.symmetry = {'x':true, 'y':false}
    puzzle.grid[0][8].start = true
    puzzle.grid[4][8].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[4][0].end = 'top'
    return [puzzle, 2]
  }, 'symmetry-pillar-vertical': function() {
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.symmetry = {'x':false, 'y':true}
    puzzle.grid[0][8].start = true
    puzzle.grid[4][0].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[4][8].end = 'bottom'
    return [puzzle, 186]
  }, 'symmetry-pillar-rotation': function() {
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.symmetry = {'x':true, 'y':true}
    puzzle.grid[0][8].start = true
    puzzle.grid[4][0].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[4][8].end = 'bottom'
    return [puzzle, 50]
  }, 'symmetry-pillar-none': function() {
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.symmetry = {'x':false, 'y':false}
    puzzle.grid[1][8].start = true
    puzzle.grid[5][8].start = true
    puzzle.grid[1][0].end = 'top'
    puzzle.grid[5][0].end = 'top'
    return [puzzle, 432]
  }, 'ezra333-quad-start-end-offset': function() {
    var puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.symmetry = {'x':false, 'y':true}
    puzzle.grid[0][0].start = true
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[4][0].start = true
    puzzle.grid[4][0].end = 'top'
    puzzle.grid[0][8].start = true
    puzzle.grid[0][8].end = 'bottom'
    puzzle.grid[4][8].start = true
    puzzle.grid[4][8].end = 'bottom'
    return [puzzle, 376]
  }, 'ezra333-4x4-poly-is-offcenter': function() {
    var puzzle = new Puzzle(2, 1)
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':65535}
    puzzle.grid[3][1] = {'type':'poly', 'color':'black', 'polyshape':38505}
    return [puzzle, 0]
  }, 'hecklechet-r-symmetry-double-r-poly': function() {
    puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.symmetry ={'x':true, 'y':true}
    puzzle.grid[0][0].end = 'top'
    puzzle.grid[4][8].end = 'bottom'
    puzzle.grid[6][0].start = true
    puzzle.grid[6][8].start = true
    puzzle.grid[3][1] = {'type':'poly', 'color':'black', 'polyshape':1048692}
    puzzle.grid[7][7] = {'type':'poly', 'color':'black', 'polyshape':1048692}
    return [puzzle, 2]
  }, 'gap-2-looks-like-endpoint': function() {
    puzzle = new Puzzle(4, 4)
    puzzle.grid[0][3].gap = 2
    puzzle.grid[0][7].gap = 2
    puzzle.grid[0][8].start = true
    puzzle.grid[1][6].gap = 2
    puzzle.grid[2][1].gap = 2
    puzzle.grid[2][5].gap = 2
    puzzle.grid[3][2].gap = 2
    puzzle.grid[3][8].gap = 2
    puzzle.grid[4][1].gap = 2
    puzzle.grid[6][1].gap = 2
    puzzle.grid[6][5].gap = 2
    puzzle.grid[7][2].gap = 2
    puzzle.grid[7][4].gap = 2
    puzzle.grid[8][0].end = 'top'
    puzzle.grid[8][1].gap = 2
    puzzle.grid[8][7].gap = 2
    return [puzzle, 1]
  }, 'gap-2-looks-like-endpoint-pillar': function() {
    puzzle = new Puzzle(4, 4, pillar=true)
    puzzle.grid[0][3].gap = 2
    puzzle.grid[0][7].gap = 2
    puzzle.grid[0][8].start = true
    puzzle.grid[1][6].gap = 2
    puzzle.grid[2][1].gap = 2
    puzzle.grid[2][5].gap = 2
    puzzle.grid[3][2].gap = 2
    puzzle.grid[3][8].gap = 2
    puzzle.grid[4][1].gap = 2
    puzzle.grid[6][1].gap = 2
    puzzle.grid[6][5].gap = 2
    puzzle.grid[7][2].gap = 2
    puzzle.grid[7][4].gap = 2
    /*
    puzzle.grid[8][0].end = 'top'
    puzzle.grid[8][1].gap = 2
    puzzle.grid[8][7].gap = 2
    */
    return [puzzle, 0]
  }, 'mid-segment-polyominos': function() {
    puzzle = new Puzzle(2, 4)
    puzzle.grid[0][5].start = true
    puzzle.grid[1][1] = {'type':'poly', 'polyshape':1, 'color':'yellow'}
    puzzle.grid[3][0].end = 'top'
    puzzle.grid[3][3] = {'type':'poly', 'polyshape':113, 'color':'yellow'}
    return [puzzle, 6]
  }, 'identical-1x1': function() {
    puzzle = new Puzzle(4, 4)
    puzzle.grid[0][8].start = true
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':1}
    puzzle.grid[1][3] = {'type':'poly', 'color':'yellow', 'polyshape':2}
    puzzle.grid[1][5] = {'type':'poly', 'color':'yellow', 'polyshape':4}
    puzzle.grid[1][7] = {'type':'poly', 'color':'yellow', 'polyshape':8}
    puzzle.grid[3][1] = {'type':'poly', 'color':'yellow', 'polyshape':16}
    puzzle.grid[3][3] = {'type':'poly', 'color':'yellow', 'polyshape':32}
    puzzle.grid[3][5] = {'type':'poly', 'color':'yellow', 'polyshape':64}
    puzzle.grid[3][7] = {'type':'poly', 'color':'yellow', 'polyshape':128}
    puzzle.grid[5][1] = {'type':'poly', 'color':'yellow', 'polyshape':256}
    puzzle.grid[5][3] = {'type':'poly', 'color':'yellow', 'polyshape':512}
    puzzle.grid[5][5] = {'type':'poly', 'color':'yellow', 'polyshape':1024}
    puzzle.grid[5][7] = {'type':'poly', 'color':'yellow', 'polyshape':2048}
    puzzle.grid[7][1] = {'type':'poly', 'color':'yellow', 'polyshape':4096}
    puzzle.grid[7][3] = {'type':'poly', 'color':'yellow', 'polyshape':8192}
    puzzle.grid[7][5] = {'type':'poly', 'color':'yellow', 'polyshape':16384}
    puzzle.grid[7][7] = {'type':'poly', 'color':'yellow', 'polyshape':32768}
    puzzle.grid[8][0].end = 'right'
    return [puzzle, 8512]
  }, 'regions-with-mid-start': function() {
    var puzzle = new Puzzle(2, 1)
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[2][1].start = true
    puzzle.grid[3][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[4][1].end = 'right'
    return [puzzle, 4]
  }, 'regions-with-mid-end': function() {
    var puzzle = new Puzzle(3, 1)
    puzzle.grid[1][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[2][1].end = 'right'
    puzzle.grid[5][1] = {'type':'star', 'color':'orange'}
    puzzle.grid[6][1].start = true
    return [puzzle, 4]
  }, 'polyominos-with-mid-start': function() {
    var puzzle = new Puzzle(2, 1)
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':17}
    puzzle.grid[2][1].start = true
    puzzle.grid[4][1].end = 'right'
    return [puzzle, 0]
  }, 'polyominos-with-mid-end': function() {
    var puzzle = new Puzzle(2, 1)
    puzzle.grid[1][1] = {'type':'poly', 'color':'yellow', 'polyshape':17}
    puzzle.grid[2][1].end = 'right'
    puzzle.grid[4][1].start = true
    return [puzzle, 0]
  }, 'gap2-should-adjust-edge': function() {
    var puzzle = new Puzzle(4, 4)
    puzzle.grid[0][1].gap = 2
    puzzle.grid[0][3].gap = 2
    puzzle.grid[0][8].start = true
    puzzle.grid[1][0].gap = 2
    puzzle.grid[1][2].gap = 2
    puzzle.grid[1][7] = {'type':'poly', 'color':'yellow', 'polyshape':51}
    puzzle.grid[2][1].gap = 2
    puzzle.grid[2][3].gap = 2
    puzzle.grid[3][0].gap = 2
    puzzle.grid[3][2].gap = 2
    puzzle.grid[4][1].gap = 2
    puzzle.grid[4][3].gap = 2
    puzzle.grid[5][0].gap = 2
    puzzle.grid[5][2].gap = 2
    puzzle.grid[6][1].gap = 2
    puzzle.grid[6][3].gap = 2
    puzzle.grid[7][0].gap = 2
    puzzle.grid[7][2].gap = 2
    puzzle.grid[8][1].gap = 2
    puzzle.grid[8][3].gap = 2
    puzzle.grid[8][4].end = 'right'
    return [puzzle, 7]
  }, 'gap2-internal-should-do-nothing': function() {
    var puzzle = new Puzzle(4, 4)
    puzzle.grid[0][8].start = true
    puzzle.grid[3][3] = {'type':'poly', 'color':'yellow', 'polyshape':119}
    puzzle.grid[3][4].gap = 2
    puzzle.grid[4][3].gap = 2
    puzzle.grid[4][5].gap = 2
    puzzle.grid[5][4].gap = 2
    puzzle.grid[8][0].end = 'right'
    return [puzzle, 2]
  }, 'gap1-gap2-symmetrical-tracing': function() {
    var puzzle = new Puzzle(2, 3)
    puzzle.symmetry = {'y':true}
    puzzle.grid[0][0].start = true
    puzzle.grid[0][6].start = true
    puzzle.grid[1][0].gap = 1
    puzzle.grid[3][6].gap = 2
    puzzle.grid[4][0].end = 'right'
    puzzle.grid[4][6].end = 'right'
    return [puzzle, 2]
  }
}
