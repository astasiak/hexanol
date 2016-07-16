$(function() {
  var AI = {
    initAI: function(aiType) {
      AI.aiType = aiType;
    },
    notifyWorker: function(n, board, cb) {
      worker = new Worker("ai_worker.js");
      worker.onmessage = function(e) {
        cb(e.data.x, e.data.y);
      }
      worker.postMessage({n: n, board: board, aiType: AI.aiType});
    }
  };
  var Game = {
    initGame: function (n, whoStarts, infoBox) {
      Game.infoBox = infoBox;
      Game.n = n;
      Game.board = new Array(n);
      for (var i = 0; i < n; i++) {
        Game.board[i] = new Array(n);
        for (var j = 0; j < n; j++) {
          Game.board[i][j] = 0;
        }
      }
      Game.setCurrentPlayer(whoStarts);
      Board.drawBoard(Game.board);
    },
    setInfoBox: function(text, cssClass) {
      Game.infoBox.removeClass();
      if(cssClass) {
        Game.infoBox.addClass(cssClass);
      }
      Game.infoBox.text(text);
    },
    setCurrentPlayer: function(whoPlays) {
      Game.currentPlayer = whoPlays;
      if(whoPlays==1) {
        Game.setInfoBox("Human plays", "human");
      }
      if(whoPlays==2) {
        Game.setInfoBox("Computer plays", "computer");
      }
    },
    moveRequest: function(a, b, player) {
      if(Game.board[a][b]==0 && Game.currentPlayer == player) {
        Game.board[a][b] = player;
        Game.setCurrentPlayer([0,2,1][player]);
        var gameResult = Game.checkFinish();
        Board.drawBoard(Game.board);
        if (gameResult>0) {
          Game.currentPlayer = 0;
          if (gameResult==1) {
            Game.setInfoBox("Human won", "human");
          } else if(gameResult==2) {
            Game.setInfoBox("Computer won", "computer");
          }
        } else {
          if(Game.currentPlayer == 2) {
            AI.notifyWorker(Game.n, Game.board, (x, y) => Game.moveRequest(x, y, 2));
          }
        }
      }
    },
    humanMoveRequest: function(a, b) {
      if(Game.currentPlayer==1) {
        Game.moveRequest(a,b,1);
      }
    },
    checkFinish: function() {
      var dfs = function(x, y, player, visited, finished) {
        var fieldId = x+","+y;
        if(visited.has(fieldId)) {
          return false;
        }
        visited.add(fieldId);
        if(Game.board[x][y]==player) {
          if(finished(x,y)) {
            return true;
          }
          for (var i=-1;i<=1;i++) {
            for (var j=-1;j<=1;j++) {
              if(i+j>-2 && i+j<2) {
                var xx = x+i;
                var yy = y+j;
                if (xx>=0 && xx<Game.n && yy>=0 && yy<Game.n) {
                  var won = dfs(xx, yy, player, visited, finished);
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
      var visited1 = new Set();
      var isFinished1 = function(x,y) { return y==Game.n-1; };
      for (var i = 0; i < Game.n; i++ ) {
        if(dfs(i,0,1,visited1, isFinished1)) {
          return 1;
        }
      }
      var visited2 = new Set();
      var isFinished2 = function(x,y) { return x==Game.n-1; };
      for (var i = 0; i < Game.n; i++ ) {
        if(dfs(0,i,2,visited2, isFinished2)) {
          return 2;
        }
      }
      return 0;
    }
  }

  var Board = {
    between: 2,
    margin: 30,
    initBoard: function (canvas, n) {
      n = Number(n);
      Board.n = n;
      Board.canvas = canvas;
      Board.canvas.removeLayers().drawLayers();
      var boxHeight = (Board.canvas.height() - 2*Board.margin)/(0.75*n+0.25);
      var boxWidth = (Board.canvas.width() - 2*Board.margin)/(1.5*n-0.5);
      var widthBaseSize = boxWidth*2/Math.sqrt(3);
      if (boxHeight > widthBaseSize) {
        var size = widthBaseSize;
        boxHeight = size;
      } else {
        var size = boxHeight;
        boxWidth = size*Math.sqrt(3)/2;
      }
      Board.boxSize = {size: size, height: boxHeight, width: boxWidth};
      var drawBorder = function(a,b,off,color) {
        var center = {
          x: Board.margin+(a+0.5+b*0.5)*boxWidth + off.x,
          y: Board.margin+(0.75*b+0.5)*boxHeight + off.y
        };
        if(a==="5") {
          console.log(a);
          console.log(a+0.5);
          console.log(a+0.5+b*0.5);
          console.log((a+0.5+b*0.5)*boxWidth);
          console.log(Board.margin+(a+0.5+b*0.5)*boxWidth);
        }
        Board.canvas.drawPolygon({
          layer: true,
          x: center.x, y: center.y,
          radius: (size+1)/2,
          sides: 6,
          rotate: 30,
          fillStyle: color
        });
      }
      for (i = 0; i < n; i++) {
        drawBorder(i, -1, {x: 0, y: -5}, '#f66');
        drawBorder(i, n, {x: 0, y: 5}, '#f66');
        drawBorder(-1, i, {x: -4, y: 2}, '#66f');
        drawBorder(n, i, {x: 4, y: -2}, '#66f');
      }
      var drawField = function(a,b) {
        var center = {
          x: Board.margin+(a+0.5+b*0.5)*Board.boxSize.width,
          y: Board.margin+(0.75*b+0.5)*Board.boxSize.height
        };
        Board.canvas.drawPolygon({
          layer: true,
          name: "box_"+a+"_"+b,
          x: center.x, y: center.y,
          radius: (Board.boxSize.size-Board.between)/2,
          sides: 6,
          rotate: 30,
          fillStyle: '#666',
          click: () => Game.humanMoveRequest(a,b)
        });
      };
      for (i = 0; i < Board.n; i++) {
        for (j = 0; j < Board.n; j++) {
          drawField(i,j);
        }
      }
    },
    drawBoard: (board) => {
      var colors = ['#bbb','#f00','#00f'];
      for (i = 0; i < Board.n; i++) {
        for (j = 0; j < Board.n; j++) {
          Board.canvas.setLayer("box_"+i+"_"+j, { fillStyle: colors[board[i][j]] });
        }
      }
      Board.canvas.drawLayers();
    }
  }

  $("#startButton").click(function() {
    var size = $("#size").val();
    var whoStarts = $("#whoStarts").val();
    var aiType = $("#aiType").val();
    Board.initBoard($("#hex-board"), size);
    AI.initAI(aiType);
    Game.initGame(size, whoStarts, $("#infoBox"));
  });
});
