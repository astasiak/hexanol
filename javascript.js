$(function() {
  var Game = {
    initGame: function (n) {
      Game.n = n;
      Game.board = new Array(n);
      for (var i = 0; i < n; i++) {
        Game.board[i] = new Array(n);
        for (var j = 0; j < n; j++) {
          Game.board[i][j] = 0;
        }
      }
      Board.drawBoard(Game.board);
    },
    moveRequest: function(a, b) {
      Game.board[a][b] = (Game.board[a][b]+1)%3;
      Board.drawBoard(Game.board);
    }
  }

  var Board = {
    between: 2,
    margin: 30,
    initBoard: function (canvas, n) {
      Board.n = n;
      Board.canvas = canvas;
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
          click: () => Game.moveRequest(a,b)
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

  var size = 10;
  Board.initBoard($("#hex-board"), size);
  Game.initGame(size);
});
