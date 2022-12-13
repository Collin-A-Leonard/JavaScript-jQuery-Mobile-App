/*
Author: Collin Leonard
Date: 10/10/20

IMPORTANT: Original HTML code used for this is derived from and uses the example code from the book:
Building Cross-Platform Mobile and Web Apps for Engineers and Scientists
By: Pawan Lingras with Matt Triff and Rucha Lingras
Published in 2017
*/

// Function resizeGraph, resizes the graph every time the 
// browser window is resized. Takes no arguments.
// Called by the "resize" event handler below.
function resizeGraph() {
  if ($(window).width() < 700) {
    $("#GraphCanvas").css({
      "width": $(window).width() - 50
    });
    $("#AdviceCanvas").css({
      "width": $(window).width() - 50
    });
  }
}

// Attach event handler for window resizing event
// Event handler runs resizeGraph function every time
// the browser window is resized.
$(window).resize(function () {
  resizeGraph();
});



/*Runs the function to display the user information, history,
 * graph or suggestions, every time their div is shown
 * 
 * No parameters are passed to this event listenr function.
 * It is called every time their div is shown.
 * 
 * Calls the loadUserInformation function and the listRecords function.
 */
$(document).on("pageshow", function () {
  if ($('.ui-page-active').attr('id') ==
    "pageUserInfo") {
    showUserForm();
  } else if ($('.ui-page-active').attr('id') ==
    "pageRecords") {
    loadUserInformation();
    listRecords();
  } else if ($('.ui-page-active').attr('id') ==
    "pageAdvice") {
    advicePage();
    resizeGraph();
  } else if ($('.ui-page-active').attr('id') ==
    "pageGraph") {
    drawGraph();
    resizeGraph();
  }
});