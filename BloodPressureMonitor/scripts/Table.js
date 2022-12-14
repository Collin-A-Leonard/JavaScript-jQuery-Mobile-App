/*
Author: Collin Leonard
Date: 10/10/20

IMPORTANT: Original HTML code used for this is derived from and uses the example code from the book:
Building Cross-Platform Mobile and Web Apps for Engineers and Scientists
By: Pawan Lingras with Matt Triff and Rucha Lingras
Published in 2017
*/


// Removes all record data from localStorage 
// Event listner calls listRecords() function.
$("#btnClearHistory").click(function () {
  localStorage.removeItem("bpRecords");
  listRecords();
  alert("All records have been deleted.");
});


/* The value of the Submit Record button is used
 * to determine which operation should be
 * performed
 */

$("#btnAddRecord").click(function () {
  /*.button("refresh") function forces jQuery
   * Mobile to refresh the text on the button
   */
  $("#btnSubmitRecord").val("Add").button(
    "refresh");
});

// Event listener listens to submit button and takes the apporpriate action according to it's value.
// Either adding or editing the information. Calls addRecord and editRecord functions.
$("#frmNewRecordForm").submit(function () {
  var formOperation = $("#btnSubmitRecord").val();

  if (formOperation == "Add") {
    addRecord();
    $.mobile.changePage("#pageRecords");
  } else if (formOperation == "Edit") {
    editRecord($("#btnSubmitRecord").attr(
      "indexToEdit"));
    $.mobile.changePage("#pageRecords");
    $("#btnSubmitRecord").removeAttr(
      "indexToEdit");
  }

  /*Must return false, or else submitting form
   * results in reloading the page
   */
  return false;
});


// Event listener on page show, if statement checks if submit button is adding or editing form and calls
// clearRecordForm and showRecordForm functions accordingly.
$("#pageNewRecordForm").on("pageshow", function () {
  //We need to know if we are editing or adding a record everytime we show this page
  //If we are adding a record we show the form with blank inputs
  var formOperation = $("#btnSubmitRecord").val();

  if (formOperation == "Add") {
    clearRecordForm();
  } else if (formOperation == "Edit") {
    //If we are editing a record we load the stored data in the form
    showRecordForm($("#btnSubmitRecord").attr(
      "indexToEdit"));
  }
});

// Loads user information onto the page.
// Is called by the event listener on pageLoader.js every time it's div is shown
function loadUserInformation() {
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
    $("#divUserSection").empty();
    var today = new Date();
    var dob = new Date(user.DOB);
    var age = Math.floor((today - dob) / (
      365.25 * 24 * 60 * 60 * 1000));


    $("#divUserSection").append("User's Name: " +
      user.FirstName + " " + user.LastName +
      "<br>Age: " + age +
      "<br>Health Card Number: " + user.HealthCardNumber +
      "<br>New Password : " + user.NewPassword)
    $("#divUserSection").append(
      "<br><a href='#pageUserInfo' data-mini='true' data-role='button' data-icon='edit' data-iconpos='left' data-inline='true' >Edit Profile</a>"
    );
    $('#divUserSection [data-role="button"]').button(); // 'Refresh' the button
  }
}

// Clears record form and returns boolean value.
// Called by the submit button, and addRecord and EditRecord functions. It takes no parameters.
function clearRecordForm() {
  $('#datExamDate').val("");
  $('#systolic').val("");
  $('#diastolic').val("");
  return true;
}

// Function compareDates compares the date of the records in the form and organizes them chronilogically. 
// It takes two paramteres that are date references and compares them against eachother.
// Called by listRecords to help organize and format the records according to date.
function compareDates(a, b) {
  var x = new Date(a.Date);
  var y = new Date(b.Date);

  if (x > y) {
    return 1;
  } else {
    return -1;
  }
}

// Function listRecords, shows all the records saved.
// Called by submit button event listener. As well as the callDelete, addRecord, and editRecord functions.
// This function takes no parameters. This function calls the compareDates function to organize the records.

function listRecords() {
  try {
    var bpRecords = JSON.parse(localStorage.getItem(
      "bpRecords"));
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

  //Load previous records, if they exist
  if (bpRecords != null) {
    //Order the records by date
    bpRecords.sort(compareDates);

    //Initializing the table
    $("#tblRecords").html(
      "<thead>" +
      "   <tr>" +
      "     <th>Date</th>" +
      "      <th>Systolic Pressure</th>" +
      "      <th>Diastolic Pressure</th>" +
      "   <th>Edit / Delete</th>" +
      "   </tr>" +
      "</thead>" +
      "<tbody>" +
      "</tbody>"
    )
    // Added for readability
    $("#tblRecords").css('text-align', 'center');
    $("#tblRecords th").css('padding', '0.5em');


    //Loop to insert the each record in the table
    for (var i = 0; i < bpRecords.length; i++) {
      var rec = bpRecords[i];
      $("#tblRecords tbody").append("<tr>" +
        "  <td>" + rec.Date + "</td>" +
        "  <td>" + rec.systolic + "</td>" +
        "  <td>" + rec.diastolic + "</td>" 
        +
        "  <td><a data-inline='true'  data-mini='true' data-role='button' href='#pageNewRecordForm' onclick='callEdit(" +
        i +
        ")' data-icon='edit' data-iconpos='notext'></a>" +
        "  <a data-inline='true'  data-mini='true' data-role='button' href='#' onclick='callDelete(" +
        i +
        ")' data-icon='delete' data-iconpos='notext'></a></td>" +
        "</tr>");
    }

    $('#tblRecords [data-role="button"]').button(); // 'Refresh' the buttons. Without this the delete/edit buttons wont appear
  } else {
    bpRecords = []; //If there is no data,set an empty array
    $("#tblRecords").html("");
  }
  return true;
}


// Function showRecordForm that takes an index argument. Shows the record form.
// Called on page load by event listener according to the value of the submit button.
function showRecordForm(index) {
  try {
    var bpRecords = JSON.parse(localStorage.getItem(
      "bpRecords"));
    var rec = bpRecords[index];
    $('#datExamDate').val(rec.Date);
    $('#systolic').val(rec.systolic);
    $('#diastolic').val(rec.diastolic);
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
}



/* Checks that users have entered all valid info
 * and that the date they have entered is not in
 * the future
 */
// Returns a boolean value. Takes no parameters and is called by addRecord and editRecord functions to validate the
// user has input the appropriate information into the form.
function checkRecordForm() {
  //for finding current date 
  var d = new Date();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var currentDate = d.getFullYear() + '/' +
    (('' + month).length < 2 ? '0' : '') +
    month + '/' +
    (('' + date).length < 2 ? '0' : '') + date;

  if (($("#systolic").val() != "") &&
    ($("#diastolic").val() != "") &&
    ($("#datExamDate").val() != "") &&
    ($("#datExamDate").val() <= currentDate)) {
    return true;
  } else {
    return false;
  }
}


// callEdit function that takes index argument. 
// called by the listRecords function when creating the html.
function callEdit(index) {
  $("#btnSubmitRecord").attr("indexToEdit",
    index);
  /*.button("refresh") function forces jQuery
   * Mobile to refresh the text on the button
   */
  $("#btnSubmitRecord").val("Edit").button(
    "refresh");
}



// Delete the given index and re-display the table
// Takes an index argument to decide which index to delete.
// called by the created html in listRecords function. 
// Calls the deleteRecord and listRecords functions.
function callDelete(index) {
  deleteRecord(index);
  listRecords();
}


// addRecord function that takes no arguments as parameters. Adds a record to the webpage.
// called by the submission of a form. Calls the checkRecord form to validate input. 
// Also calls the clearRecordForm and listRecords functions.
function addRecord() {
  if (checkRecordForm()) {
    var record = {
      "Date": $('#datExamDate').val(),
      "systolic": $('#systolic').val(),
      "diastolic": $('#diastolic').val()
    };

    try {
      var bpRecords = JSON.parse(localStorage.getItem(
        "bpRecords"));
      if (bpRecords == null) {
        bpRecords = [];
      }
      bpRecords.push(record);
      localStorage.setItem("bpRecords", JSON.stringify(
        bpRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();
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

  return true;
}


// Function deleteRecord that takes an index argument to determine which record to delete and deletes it. 
// Called by the callDelete method.
function deleteRecord(index) {
  try {
    var bpRecords = JSON.parse(localStorage.getItem(
      "bpRecords"));

    bpRecords.splice(index, 1);

    if (bpRecords.length == 0) {
      /* No items left in records, remove entire 
       * array from localStorage
       */
      localStorage.removeItem("bpRecords");
    } else {
      localStorage.setItem("bpRecords", JSON.stringify(
        bpRecords));
    }
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
}


// editRecord function that takes an index argument to determine which record to edit, and then alllows the user to edit it.
// Calls the checkRecordForm function to validate user input. Also calls the clearRecordForm and listRecords function.
function editRecord(index) {
  if (checkRecordForm()) {
    try {
      var bpRecords = JSON.parse(localStorage.getItem(
        "bpRecords"));
      bpRecords[index] = {
        "Date": $('#datExamDate').val(),
        "systolic": $('#systolic').val(),
        "diastolic": $('#diastolic').val()
      }; //Alter the selected item in the array
      localStorage.setItem("bpRecords", JSON.stringify(
        bpRecords)); //Saving array to local storage
      alert("Saving Information");
      clearRecordForm();
      listRecords();
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