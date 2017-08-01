// Initialize Firebase
// ---------------------------------------------------------
var config = {
    apiKey: "AIzaSyCZl8ezQz7oVDitqveBetMplXhuPSi-Pbk",
    authDomain: "train-scheduler-93da3.firebaseapp.com",
    databaseURL: "https://train-scheduler-93da3.firebaseio.com",
    projectId: "train-scheduler-93da3",
    storageBucket: "train-scheduler-93da3.appspot.com",
    messagingSenderId: "223600142263"
};
firebase.initializeApp(config);

// Create global variables
// -------------------------------------------------------
var database = firebase.database();
var name = "", destination="", firstTime="", frequency=0, nextArrival="", 
	minutesAway = 0;

// Create functions to calculate Next Arrival and 
// Minutes Away
// ------------------------------------------------------

// The function below calculates next arrival time 
// and minutes away
function arrival(initial, freq) {
	// clear out variables
	minutesAway = 0;
	nextArrival = "";

	// Calculate time difference between now and initial
	// train time in minutes
	var timedifference = moment().diff(moment(initial,"HH:mm"),'minutes');
	// If the time difference is negative then assume that
	// current time is one day after the initial train time
	if (timedifference<0) {
		timedifference = moment().add(1,'day').diff(moment(initial,"HH:mm"),'minutes');
	};
	// Use the frequency to determine time left for
	// next train arrival
	var remainder = timedifference % freq;
	minutesAway = freq - remainder;
	nextArrival = moment().add(minutesAway,'minutes').format("HH:mm");
	return [minutesAway,nextArrival];
};

// Create on click events
// -----------------------------------------------------

$("#addTrain").on("click", function() {
	// Don't refresh the page!
	event.preventDefault();

	// Store the train information that was submitted by
	// the user in variables
	name = $("#trainName").val().trim();
	destination = $("#trainDestination").val().trim();
	firstTime = $("#trainFirstTime").val().trim();
	frequency = $("#trainFrequency").val().trim();

	// Transfer the data to firebase
	database.ref().push({
		name: name,
		destination: destination,
		firstTime: firstTime,
		frequency: frequency
	});

});

// Create firebase listener to update train data table 
// in html every time a train is added
// -----------------------------------------------------
database.ref().on("child_added",function(snapshot){
	// Add train name
	$("#name-display").append("<p>"+snapshot.val().name+"</p>");
	// Add destination
	$("#destination-display").append("<p>"+snapshot.val().destination+"</p>");
	// Add frequency
	$("#frequency-display").append("<p>"+snapshot.val().frequency+"</p>");
	// Calculate next arrival and minutes away
	arrival(snapshot.val().firstTime,snapshot.val().frequency);
	$("#nextArrival-display").append("<p>"+nextArrival+"</p>");
	$("#minutesAway-display").append("<p>"+minutesAway+"</p>");
});












