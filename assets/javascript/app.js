$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBB5Q1F86v_2p9v9o7nWNpDLkn43Bp0Wu4",
    authDomain: "train-scheduler-6a978.firebaseapp.com",
    databaseURL: "https://train-scheduler-6a978.firebaseio.com",
    projectId: "train-scheduler-6a978",
    storageBucket: "train-scheduler-6a978.appspot.com",
    messagingSenderId: "957789799797"
  };
  firebase.initializeApp(config);

    // initialize variables
    var database = firebase.database();
    var nextTrain = 0;
    var tMinutesTillTrain = 0;

    // clears form fields
    function clearForm() {
        $("#tName").val("");
        $("#tDest").val("");
        $("#tTime").val("");
        $("#tFreq").val("");
    }

   
    $("#tButton").on("click", function(event) {
        event.preventDefault();

        var tName = $("#tName").val().trim();
        var tDestination = $("#tDest").val().trim();
        var tStartTime = $("#tTime").val().trim();
        var tFrequency = $("#tFreq").val().trim();

        database.ref().push({
            name: tName,
            destination: tDestination,
            starttime: tStartTime,
            frequency: tFrequency
        });

        clearForm();

    });

        // given frequency and start time, this will return the time the next train will arrive as well as the minutes from arrival
       function calcNextTrain(p1, p2) {

        var tFrequency = p1;
        var firstTime = p2;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

        var currentTime = moment();

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        var tRemainder = diffTime % tFrequency;

        tMinutesTillTrain = tFrequency - tRemainder;

        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm A");

        return [nextTrain, tMinutesTillTrain];
    };

    // called when data is added to firebase. populates the table body with all the train data.
    database.ref().on("child_added", function(snapshot) {
        $("#trainInfo").append(`
            <tr>
                <td>${snapshot.val().name}</td>
                <td>${snapshot.val().destination}</td>
                <td>${snapshot.val().frequency}</td>
                <td>${calcNextTrain(snapshot.val().frequency,snapshot.val().starttime)[0]}</td>
                <td>${calcNextTrain(snapshot.val().frequency,snapshot.val().starttime)[1]}</td>
               
            </tr>
            `);
    });

  

    
   

  
   
});
