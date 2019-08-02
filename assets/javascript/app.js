

var firebaseConfig = {

	apiKey: "AIzaSyBHEWYRarjZIeKRw7Dy43VLIdpAeWMMm4k",
	authDomain: "train-scheduler-d1814.firebaseapp.com",
	databaseURL: "https://train-scheduler-d1814.firebaseio.com",
	projectId: "train-scheduler-d1814",
	storageBucket: "",
	messagingSenderId: "502649785978",
	appId: "1:502649785978:web:30261feeef7a0f87"
	
};

// Initiates Firebase
firebase.initializeApp(firebaseConfig);


//Creates database variable to create a reference to firebase.database().
var database = firebase.database();

var tMinutesTillTrain = 0;

//Shows and updates current time. Uses setInterval method to update time.
function displayRealTime() {
	setInterval(function () {
		$("#current-time").html(moment().format("h:mm:ss A"))
	}, 1000);
}


displayRealTime();


var tRow = "";
var getKey = "";

//On click event for the submit button. 
$("#submit-button").on("click", function () {

	// Prevents form from submitting (refreshing).
	event.preventDefault();

	//Grabs the values that the user enters and stores the values in variables.
	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrainTime = $("#first-train-time").val().trim();
	var trainFrequency = $("#frequency").val().trim();

	// Prints the users inputs into console to verify functionality.
	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(trainFrequency);

	//Form validation for user input values. 
	if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === "") {
		$("#military-time").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;
	}

	//There are no null values in the form.
	else if (trainName === null || destination === null || firstTrainTime === null || trainFrequency === null) {
		$("#military-time").empty();
		$("#not-a-number").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;
	}

	//User enters the first train time as military time.
	else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2, 3) !== ":") {
		$("#missing-field").empty();
		$("#not-a-number").empty();
		$("#military-time").html("Time must be in military format: HH:mm. For example, 15:00.");
		return false;
	}

	//User enters a number for the Frequency value.
	else if (isNaN(trainFrequency)) {
		$("#missing-field").empty();
		$("#military-time").empty();
		$("#not-a-number").html("Not a number. Enter a number (in minutes).");
		return false;
	}

	//If form is valid, perform time calculations and add train to the current schedule.
	else {
		$("#military-time").empty();
		$("#missing-field").empty();
		$("#not-a-number").empty();

		//Moment JS to determine next arrival time and the number of minutes away from destination.
		var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
		console.log(firstTimeConverted);

		// The Current Time.
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

		// The difference between the times.
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);

		// The time apart (remainder).
		var tRemainder = diffTime % trainFrequency;
		console.log(tRemainder);

		// The minutes until the train.
		var tMinutesTillTrain = trainFrequency - tRemainder;
		console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

		// The next train.
		var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
		console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

		//Creates local temporary object for holding train data.
		var newTrain = {
			trainName: trainName,
			destination: destination,
			firstTrainTime: firstTrainTime,
			trainFrequency: trainFrequency,
			nextTrain: nextTrain,
			tMinutesTillTrain: tMinutesTillTrain,
			currentTime: currentTime.format("hh:mm A")
		};

		//Saves/uploads train data to the database.
		database.ref().push(newTrain);

		//Logs all actions to console for review.
		console.log("train name in database: " + newTrain.trainName);
		console.log("destination in database: " + newTrain.destination);
		console.log("first train time in database: " + newTrain.firstTrainTime);
		console.log("train frequency in database: " + newTrain.trainFrequency);
		console.log("next train in database: " + newTrain.nextTrain);
		console.log("minutes away in database: " + newTrain.tMinutesTillTrain);
		console.log("current time in database: " + newTrain.currentTime);

		//Confirmation modal that appears when user submits form.
		$(".add-train-modal").html("<p>" + newTrain.trainName + " was successfully added to the current schedule.");
		$("#addTrain").modal();

		//Remove the text from the form boxes after user presses the, "add to schedule" button.
		$("#train-name").val("");
		$("#destination").val("");
		$("#first-train-time").val("");
		$("#frequency").val("");
	}
});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {
	console.log(childSnapshot.val());
	console.log(prevChildKey);

	//Set variables for form input field values equal to the stored values in firebase.
	var trainName = childSnapshot.val().trainName;
	var destination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().firstTrainTime;
	var trainFrequency = childSnapshot.val().trainFrequency;
	var nextTrain = childSnapshot.val().nextTrain;
	var tMinutesTillTrain = childSnapshot.val().tMinutesTillTrain;
	var currentTime = childSnapshot.val().currentTime;

	//The train info logged.
	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(nextTrain);
	console.log(tMinutesTillTrain);
	console.log(trainFrequency);
	console.log(currentTime);

	//Moment JS to determine train next arrival time and the number of minutes away from destination.
	var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	console.log(firstTimeConverted);

	// The current time.
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	// The difference between the times.
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// The time apart (remainder).
	var tRemainder = diffTime % trainFrequency;
	console.log(tRemainder);

	// Minutes until the train.
	var tMinutesTillTrain = trainFrequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	// The next train.
	var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
	console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


	//Updates the HTML (schedule table) to reflect the latest stored values in the firebase database.
	var tRow = $("<tr>");
	var trainTd = $("<td>").text(trainName);
	var destTd = $("<td>").text(destination);
	var nextTrainTd = $("<td>").text(nextTrain);
	var trainFrequencyTd = $("<td>").text(trainFrequency);
	var tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain);

	// Append the newly created table data to the table row.
	//Append trash can icon to each row so that user can delete a row.
	tRow.append("<img src='assets/images/trash.svg' alt='trash can' class='trash-can mr-3'>", trainTd, destTd, trainFrequencyTd, nextTrainTd, tMinutesTillTrainTd);
	// Appends the table row to the table body.
	$("#schedule-body").append(tRow);
});


//On click event for trash can icon/button. When user clicks trash can to remove a train from the schedule...
$("body").on("click", ".trash-can", function () {
	// Prevent form from submitting (refreshing).
	event.preventDefault();

	//This creates a prompt to confirm with the user before he or she decides to actually delete the train data.
	var confirmDelete = confirm("Deleting a train permanently removes the train from the system. Are you sure you want to delete this train?");

	if (confirmDelete) {
		//Remove the closest table row.
		$(this).closest("tr").remove();
	}
	else {
		return;
	}
});

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})