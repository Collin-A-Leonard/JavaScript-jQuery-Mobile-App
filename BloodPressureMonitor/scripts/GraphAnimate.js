/*
Author: Collin Leonard
Date: 11/3/20

IMPORTANT: Original HTML code used for this is derived from and uses the example code from the book:
Building Cross-Platform Mobile and Web Apps for Engineers and Scientists
By: Pawan Lingras with Matt Triff and Rucha Lingras
Published in 2017
*/

// Called by event listener on pageLoader.js on "pageshow"
// Gathers all required information to make the graph and then calls the appropriate functions to 
// do it.
// Passed no parameters. Calls setUpCanvas(), getBPhistory(), getBPbounds(), drawLines(), and labelAxes() functions.
function drawGraph() {
  if (localStorage.getItem("bpRecords") ===
    null) {
    alert("No records exist.");

    $(location).attr("href", "#pageMenu");
  } else {
    setupCanvas();

    var SystolicArr = new Array();
    var DiastolicArr = new Array();
    var Datearr = new Array();
    getBPhistory(SystolicArr, DiastolicArr, Datearr);

    var SystolicUpper = new Array(2);
    var DiastolicUpper = new Array(2);
    getBPbounds(SystolicUpper, DiastolicUpper);

    drawLines(SystolicArr, DiastolicArr, SystolicUpper, DiastolicUpper, Datearr);
    labelAxes();
  }
}

// Function setupCanvas() called by drawGraph. Takes no arguments. Sets up the canvas HTML element for drawing our graph.
function setupCanvas() {

  var c = document.getElementById("GraphCanvas");
  var ctx = c.getContext("2d");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 500, 500);

}

// getBPhistory() function. Called by drawGraph function. Gathers the history of your Systolic and Diastolic BP measurements and
// assigns the value of each measurement a place in an arrray that we will pass to the drawLines function to map out our graph.
// This function takes 3 arguments, 2 of which are arrays that it will modify inside the function, and the third is array of dates
// associated with when each measurement was taken used to label our graph.
function getBPhistory(SystolicArr, DiastolicArr, Datearr) {
  var bpRecords = JSON.parse(localStorage.getItem(
    "bpRecords"));

  bpRecords.sort(compareDates);

  for (var i = 0; i < bpRecords.length; i++) {
    var date = new Date(bpRecords[i].Date);

    /*These methods start at 0, must increment
     * by one to compensate
     */
    var m = date.getMonth() + 1;
    var d = date.getDate() + 1;

    //The x-axis label
    Datearr[i] = (m + "/" + d);

    //The point to plot
    SystolicArr[i] = parseFloat(bpRecords[i].systolic);
    DiastolicArr[i] = parseFloat(bpRecords[i].diastolic);
  }
}

// getBPbounds function, called by drawGraph function. Takes 2 arguments that are arrays that will be passed values from this
// function. The function assigns two identical values to each array to allow us to graph 2 flat lines on our graph to represent
// the healthy bounds of our blood pressure values. This is so oversimplified now after edit that it is really unnecessary but I've kept it
// because I like the flow. I could easily assing these values above inside the drawGraph function though.
function getBPbounds(SYSTOLICUpper, DIASTOLICUpper) {

  SYSTOLICUpper[0] = SYSTOLICUpper[1] = 120
  DIASTOLICUpper[0] = DIASTOLICUpper[1] = 80;

}

// Function drawLines() called by drawGraph() function. Takes 5 arguments, all of which are arrays used to display information in the graph.
// The first 2 arguments are the arrays containing our blood pressure values that will be mapped. The next two arrays are our 
// identical double values arrays that represent the healhty limits of each measurement. The final argument is an array of dates used
// for organizing and displaying our information labled chronologically (it was sorted above though in getBPhistory).
// Uses object and methods from the RGraph library. 
function drawLines(BParr, BP2arr, BPUpper, BP2Upper, Datearr) {
  var BPline = new RGraph.Line("GraphCanvas",
      BParr, BP2arr, BPUpper, BP2Upper)
    .Set("labels", Datearr)
    .Set("colors", ["Blue", "red", "green", "green"])
    .Set("shadow", true)
    .Set("shadow.offsetx", 1)
    .Set("shadow.offsety", 1)
    .Set("linewidth", 1)
    .Set("numxticks", 6)
    .Set("scale.decimals", 0)
    .Set("xaxispos", "bottom")
    .Set("gutter.left", 40)
    .Set("tickmarks", "filledcircle")
    .Set("ticksize", 5)
    .Set("chart.title", "Blood Pressure")
    .Draw();
}

// Function labelAxes called from drawGraph function above. Labels the axes of our graph and stylizes them. This function takes no
// arguments.
function labelAxes() {
  var c = document.getElementById("GraphCanvas");
  var ctx = c.getContext("2d");
  ctx.font = "11px Georgia";
  ctx.fillStyle = "green";
  ctx.fillText("Date(MM/DD)", 400, 470);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("Pressure Value", -250, 12);
}