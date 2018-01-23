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
    ctx.textAlign="center";

    ctx.fillStyle = 'rgba(25, 25, 25, 0.95)';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'rgba(25, 25, 25, 1.0)';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.font = "bold 12em Regency Script";
    ctx.fillText("D", 110, 185);

    //requestAnimationFrame(draw);
}