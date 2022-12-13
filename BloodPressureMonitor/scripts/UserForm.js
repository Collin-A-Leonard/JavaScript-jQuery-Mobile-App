/*
Author: Collin Leonard
Date: 10/10/20

IMPORTANT: Original HTML code used for this is derived from and uses the example code from the book:
Building Cross-Platform Mobile and Web Apps for Engineers and Scientists
By: Pawan Lingras with Matt Triff and Rucha Lingras
Published in 2017
*/

// calls clearUserForm when clicked, deleting user object data from localStorage
$("#btnUserClear").click(function () {
  clearUserForm();
});

// calls saveUserForm when clicked, saving infromation to the user object in localStroage.
// No parameters are passed to this event listner.
// Calls the saveUserForm function.
$("#frmUserForm").submit(function () { //Event : submitting the form
  saveUserForm();
  return true;
});

/*
 * checks user form for empty fields and fidnds current date
 * This function does not take any arguments as parameters. Returns a boolean value.
 * Called from the saveUserForm to validate values before saving the user data.
 * Does not call any other functions.
 */
function checkUserForm() { //Check for empty fields in the form
  //for finding current date 
  var d = new Date();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var year = d.getFullYear();
  var currentDate = year + '/' +
    (('' + month).length < 2 ? '0' : '') +
    month + '/' +
    (('' + date).length < 2 ? '0' : '') + date;

  if (($("#txtFirstName").val() != "") &&
    ($("#txtLastName").val() != "") &&
    ($("#txtHealthCardNumber").val() != "") &&
    ($("#datBirthdate").val() != "") && ($(
      "#datBirthdate").val() <= currentDate)) {
      return true;
  } else {
    return false;
  }
}

/*
 * saves user object data to localStorage.
 * Called by the event listener listening for a submission of the #frmUserForm form.
 * This function takes no arguments as paramters.
 * If the user information returns true (valid) from checkUserForm the function attempts to save it to the user jSon object
 * and returns mulitple different error messages if it is unable to. 
 */
function saveUserForm() {
  if (checkUserForm()) {
    var user = {
      "FirstName": $("#txtFirstName").val(),
      "LastName": $("#txtLastName").val(),
      "HealthCardNumber": $(
        "#txtHealthCardNumber").val(),
      "NewPassword": $("#changePassword").val(),
      "DOB": $("#datBirthdate").val()
    };

    try {
      localStorage.setItem("user", JSON.stringify(
        user));
      alert("Saving Information");

      $.mobile.changePage("#pageMenu");
      window.location.reload();
    } catch (e) {
      /* Google browsers use different error 
       * constant
       */
      if (window.navigator.vendor ===
        "Google Inc.") {
        if (e == DOMException.QUOTA_EXCEEDED_ERR) {
          alert(
            "Error: Local Storage limit exceeds."
          );
        }
      } else if (e == QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }

      console.log(e);
    }
  } else {
    alert("Please complete the form properly.");
  }

}

/*
 * clears user object data from localStorage.
 * Is not passed any parameters.
 * Is called by the event listener above listening for the #btnUserClear button to be pressed.
 */
function clearUserForm() {
  localStorage.removeItem("user");
  alert("The stored data have been removed");
}

/*
 * Loads to show data about the user object in a try catch block.
 * Is called from the event listener on div show from pageLoader.js
 * This function takes no arguments as parameters.
 * This function calls no other functions.
 */
function showUserForm() { //Load the stored values in the form
  try {
    var user = JSON.parse(localStorage.getItem(
      "user"));
  } catch (e) {
    /* Google browsers use different error 
     * constant
     */
    if (window.navigator.vendor ===
      "Google Inc.") {
      if (e == DOMException.QUOTA_EXCEEDED_ERR) {
        alert(
          "Error: Local Storage limit exceeds."
        );
      }
    } else if (e == QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }

  if (user != null) {
    $("#txtFirstName").val(user.FirstName);
    $("#txtLastName").val(user.LastName);
    $("#txtHealthCardNumber").val(user.HealthCardNumber);
    $("#changePassword").val(user.NewPassword);
    $("#datBirthdate").val(user.DOB);
  }
}