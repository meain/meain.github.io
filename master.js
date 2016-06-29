// For right star color change
var timer
function randomColor() {
var color = '#' + Math.random().toString(16).substr(2, 6);
document.getElementById("right-star").style.color = color;
clearTimeout(timer);
timer=setTimeout(clearColor,50);
}
function clearColor() {
document.getElementById("right-star").style.color = "grey";
}
document.addEventListener('mousemove', randomColor);

document.addEventListener('touchmove', randomColor);
