/*
Author: Collin Leonard
Date: 10/10/20

IMPORTANT: Original HTML code used for this is derived from and uses the example code from the book:
Building Cross-Platform Mobile and Web Apps for Engineers and Scientists
By: Pawan Lingras with Matt Triff and Rucha Lingras
Published in 2017
*/

/* Adds given text value to the password text 
 * field
 * This function is called every time a numeric keypad buttton is clicked on the entry page.
 * It takes an argument (button) which is a integer value from the index.html page that will be added to the password value to be checked
 * or delete the last integer value in the password if the backspace button is clicked and "bksp" value is passed into the method parameter.
 */
function addValueToPassword(button) {
  var currVal = $("#passcode").val();
  if (button == "bksp") {
    $("#passcode").val(currVal.substring(0,
      currVal.length - 1));
  } else {
    $("#passcode").val(currVal.concat(button));
  }
}

/* 
 * Retrieves password from local storage if it
 * exists, otherwise returns the default password
 * 
 * no parameters are passed to this function. This function is called from the event listener checking for the enter button being
 * clicked on the entrance page. The event listener $("#btnEnter").click is below.
 * 
 * It does not call any other functions.
 */
function getPassword() {
  if (typeof (Storage) == "undefined") {
    alert(
      "Your browser does not support HTML5 localStorage. Try upgrading."
    );
  } else if (localStorage.getItem("user") !=
    null) {
    return JSON.parse(localStorage.getItem(
      "user")).NewPassword;
  } else {
    /*Default password*/
    return "";
  }
}

/* On the main page, after password entry, directs
 * user to main page, or user entry page
 * if they have not yet completed their user info.
 */
$("#btnEnter").click(function () {
  var password = getPassword();

  if (document.getElementById("passcode").value ==
    password) {
      if (localStorage.getItem("user") ==
        null) {
        /* User has not been created, direct user 
         * to User Creation page
         */
        $("#btnEnter").attr("href",
          "#pageUserInfo").button();
      } else {
        $("#btnEnter").attr("href",
          "#pageMenu").button();
      }
    } else {
    alert(
      "Incorrect password, please try again."
    );
  }
});

$(document).ready(function() {
  if (localStorage.getItem("user") == null) {
    $("#password-field").text("You do not have a password set. Press enter and set password in application.");
  }
});