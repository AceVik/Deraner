var canvas;
var ctx;


window.onload = function() {
    canvas = document.getElementById('preview');
    var font = new Font();
    font.fontFamily = 'Regency Script';
    font.onload = function(e) {
        ctx = canvas.getContext("2d");
        draw();
    };
    font.onerror = function (e) {
      console.error(e);
    };
    font.src = 'font/RegencyScriptFLF.ttf';
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign="center";

    ctx.fillStyle = '#010101';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#dd0088';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, 2 * Math.PI);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 15;
    ctx.strokeText("D", 105, 190);

    ctx.fillStyle = '#ffd700';
    ctx.font = "bold 12em Regency Script";
    ctx.fillText("D", 110, 185);

    requestAnimationFrame(draw);
}