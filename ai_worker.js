
self.onmessage = function (msg) {
  var aiType = msg.data.aiType;
  var board = msg.data.board;
  var n = msg.data.n;
  var postResult = function(x, y) {
    postMessage({x: x, y: y});
  };
  var strategy = strategies[aiType];
  strategy(n, board, postResult);
};
var strategies = {
  "first": function(n, board, cb) {
    for(var i = 0; i<n; i++) {
      for(var j = 0; j<n; j++) {
        if(board[i][j]==0) {
          cb(i, j);
          return;
        }
      }
    }
    cb(0, 0);
  },
  "random": function(n, board, cb) {
    var empties = [];
    for(var i = 0; i<n; i++) {
      for(var j = 0; j<n; j++) {
        if(board[i][j]==0) {
          empties.push({x:i, y:j});
        }
      }
    }
    var field = empties[Math.floor(Math.random()*empties.length)];
    cb(field.x, field.y);
  },
  "monteCarlo": function(n, origBoard, cb) {
    var sims = 400;
    var simulate = function(x, y) {
      var won = 0;
      for (var s=0; s<sims; s++) {
        var localBoard = JSON.parse(JSON.stringify(origBoard));
        localBoard[x][y] = 2;
        empties = [];
        for(var i = 0; i<n; i++) {
          for(var j = 0; j<n; j++) {
            if(localBoard[i][j]==0) {
              empties.push({x:i,y:j});
            }
          }
        }
        shuffle(empties);
        restMoves = empties.slice(0,empties.length/2);
        for (i = 0; i < restMoves.length; i++) {
          localBoard[restMoves[i].x][restMoves[i].y] = 2;
        }
        if(isWon(n, localBoard)) {
          won++;
        }
      }
      return won;
    };

    var best = {x:0,y:0,winning:-1};
    for(var i = 0; i<n; i++) {
      for(var j = 0; j<n; j++) {
        if(origBoard[i][j]==0) {
          var winning = simulate(i,j);
          if(winning > best.winning) {
            best = {x:i, y:j, winning:winning};
          }
        }
      }
    }
    console.log("Probability of winning: "+(100*best.winning/sims)+"%");
    cb(best.x, best.y);
  }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
function isWon(n, board) {
  var dfs = function(x, y, visited) {
    var fieldId = x+","+y;
    if(visited.has(fieldId)) {
      return false;
    }
    visited.add(fieldId);
    if(board[x][y]==2) {
      if(x == n-1) {
        return true;
      }
      for (var i=-1;i<=1;i++) {
        for (var j=-1;j<=1;j++) {
          if(i+j>-2 && i+j<2) {
            var xx = x+i;
            var yy = y+j;
            if (xx>=0 && xx<n && yy>=0 && yy<n) {
              var won = dfs(xx, yy, visited);
              if (won) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
  var visited = new Set();
  for (var i = 0; i < n; i++ ) {
    if(dfs(0,i,visited)) {
      return true;
    }
  }
  return false;
}
