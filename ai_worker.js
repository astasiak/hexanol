
self.onmessage = function (msg) {
  var aiType = msg.data.aiType;
  console.log("Worker invoked - strategy: " + aiType);
  var board = msg.data.board;
  var n = msg.data.n;
  var postResult = function(x, y) {
    console.log("Posting result: " + x + ", " + y);
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
  }
}
