/*
Author: Collin Leonard
Date: 11/18/20

IMPORTANT: Original HTML code used for this is derived from and uses the example code from the book:
Building Cross-Platform Mobile and Web Apps for Engineers and Scientists
By: Pawan Lingras with Matt Triff and Rucha Lingras
Published in 2017
*/


/*
Name: advicePage
Purpose: Gathers blood pressure records, organizes them by date, picks the latest records, sets up canvas, and calls the
next function, passing those values it's gathered.
Parameters: None.
Called by: pageLoader.js, in an event listener that fires on pageShow.
Calls: drawAdviceCanvas().
*/
function advicePage() {
  if (localStorage.getItem("bpRecords") ===
    null) {
    alert("No records exist.");

    $(location).attr("href", "#pageMenu");
  } else {


    var bpRecords = JSON.parse(localStorage.getItem(
      "bpRecords"));
    bpRecords.sort(compareDates);
    var i = bpRecords.length - 1;
    var Systolic = bpRecords[i].systolic;
    var Diastolic = bpRecords[i].diastolic;

    var c = document.getElementById(
      "AdviceCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, 550, 1000);
    ctx.font = "22px Arial";
    drawAdviceCanvas(ctx, Systolic, Diastolic);

  }
}

/*
Name: drawAdviceCanvas
Purpose: Writes information to the canvas about your current levels, then calls 2 other functions that will interact with the canvas as well.
Parameters: ctx, Systolic (newest systolic blood pressure value), Diastolic (newest diastolic blood pressure value)
Called By: advicePage
Calls: BPwrite, BPmeter, BPmeterTwo
*/
function drawAdviceCanvas(ctx, Systolic, Diastolic) {
  ctx.font = "22px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Your current blood pressure is " + Systolic +
   "/" + Diastolic + ".", 25, 320);

    ctx.fillText(
      "Your target blood pressure is: 120/80",
      25, 350);
    BPwrite(ctx, Systolic, Diastolic);
    BPmeter(ctx, Systolic);
    BPmeterTwo(ctx, Diastolic);
}

/*
Name: BPwrite
Purpose: To calculate what is the apporpriate message to write according to your levels, then pass that informaiton into the next function along
with a color code that relates to your levels.
Parameters: ctx, Systolic, Diastolic
Called By: drawAdvicePage
Calls: writeAdvice
*/
function BPwrite(ctx, Systolic, Diastolic) {
  if (((Systolic >= 90) && (Systolic <= 120)) && ((Diastolic >= 60) && (Diastolic <= 80))) {
    writeAdvice(ctx, "Green");
  } else if (((Systolic >= 90) && (Systolic <= 140)) && ((Diastolic >= 60) && (Diastolic <= 90))) {
    writeAdvice(ctx, "Yellow");
  } else if (((Systolic < 90) && (Diastolic <= 90)) || ((Diastolic < 60) && (Systolic <= 140))) {
    writeAdvice(ctx, "Blue");
  }
  else {
    writeAdvice(ctx, "Red");
  }
}

/*
Name: writeAdvice
Purpose: To write the appropriate medical advice according to your color code safety level passed into this from BPwrite.
Parameters: ctx, level
Called By: BPWrite
Calls: none.
*/
function writeAdvice(ctx, level) {
  var adviceLine1 = "";
  var adviceLine2 = "";

  if (level == "Red") {
    adviceLine1 =
      "Please consult with your family";
    adviceLine2 = "physician urgently.";
  }else if (level == "Blue") {
    adviceLine1 =
      "You have low blood pressure.";
      adviceLine2 =
      "Contact family physician.";
  } else if (level == "Yellow") {
    adviceLine1 =
      "Contact family physician and recheck ";
    adviceLine2 = "blood pressure frequently.";
  } else if (level == "Green") {
    adviceLine1 =
      "Your levels are healthy.";
      adviceLine2 =
      "Measure blood pressure frequently.";
  } 
  ctx.fillText("Your blood pressure safety level is: " + level +
    ".", 25, 380);
  ctx.fillText(adviceLine1, 25, 410);
  ctx.fillText(adviceLine2, 25, 440);
}

/*
Name: BPmeter
Purpose: To set the values for the RGraph.CornerGauge that will be drawn for our Systolic values.
Parameters: ctx, Systolic
Called By: drawAdviceCanvas
Calls: drawMeter
*/
function BPmeter(ctx, Systolic) {
    var cg = new RGraph.CornerGauge(
        "AdviceCanvas", 70, 190, Systolic)
      .Set("chart.colors.ranges", [
        [140, 190, "red"],
        [120, 140, "yellow"],
        [90, 120, "#0f0"],
        [70, 90, "blue"]
      ]);
  drawMeter(cg);
}

/*
Name: BPmeterTwo
Purpose: To set the values for the RGraph.CornerGauge that will be drawn for our Diastolic values.
Parameters: ctx, Diastolic
Called By: drawAdviceCanvas
Calls: drawMeterTwo
*/
function BPmeterTwo(ctx, Diastolic) {
     var cg = new RGraph.CornerGauge(
         "AdviceCanvas", 40, 100, Diastolic)
       .Set("chart.colors.ranges", [
         [90, 100, "red"],
         [80, 90, "yellow"],
         [60, 80, "#0f0"],
         [40, 60, "blue"]
       ]);
   drawMeterTwo(cg);
 }

/*
Name: DrawMeter
Purpose: To draw our RGraph.CornerGauge at the specified coordinates for Systolic values.
Parameters: g
Called By: BPmeter
Calls: none.
*/
function drawMeter(g) {
  g.Set("chart.value.text.units.post", " Systolic")
    .Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 2)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 0)
    .Set("chart.title", "Systolic Blood Pressure")
    .Set("chart.radius", 250)
    .Set("chart.centerx", 35)
    .Set("chart.centery", 250)
    .Draw();
}

/*
Name: drawMeterTwo
Purpose: To draw our RGraph.CornerGauge at the specified coordinates for Diastolic values.
Parameters: g
Called By: BPmeterTwo
Calls: none.
*/
function drawMeterTwo(g) {
  g.Set("chart.value.text.units.post", " Diastolic")
    .Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 2)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 0)
    .Set("chart.title", "Diastolic Blood Pressure")
    .Set("chart.radius", 250)
    .Set("chart.centerx", 315)
    .Set("chart.centery", 250)
    .Draw();
}