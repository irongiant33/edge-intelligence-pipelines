// Global persistent state (survives across on_update calls)
var allDIOsAreOn = false;  // start assuming all off

// Helper: Send POST to toggle one DIO (async with callback)
function toggleSingleDIO(channel, state) {
    var statusValue = state ? "1" : "0";
    var jsonPayload = JSON.stringify({
        status: statusValue,
        num: channel.toString()
    });

    var formBody = "insert=" + encodeURIComponent(jsonPayload);

    // Replace with your actual Docker web UI URL (test connectivity first!)
    var url = "http://192.168.0.3:8080/update.php";  // example: Docker host IP/port; adjust as needed

    var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest"
    };

    function postCallback(err, res) {
        if (err) {
            logger.error("DIO-" + channel + " POST failed: " + err.message);
        } else if (res.statusCode >= 200 && res.statusCode < 300) {
            logger.info("DIO-" + channel + " set to " + statusValue + " → success (HTTP " + res.statusCode + ")");
            // Optional: logger.debug("Response body: " + res.body);
        } else {
            logger.error("DIO-" + channel + " failed: HTTP " + res.statusCode + " - " + (res.body || "no body"));
        }
    }

    http.post(url, formBody, headers, postCallback);
}

function on_update() {
    // Flip state
    allDIOsAreOn = !allDIOsAreOn;
    var newState = allDIOsAreOn;

    logger.info("Toggling all DIOs - " + (newState ? "ON" : "OFF"));

    // Trigger toggle for each channel
    toggleSingleDIO(1, newState);
    toggleSingleDIO(2, newState);
    toggleSingleDIO(3, newState);
    toggleSingleDIO(4, newState);

    // Optional: publish dummy output if your pipeline expects something
    // output.value = newState ? 1 : 0;
    // output.publish();
}

function on_time_trigger() {
    // Reuse same toggle logic for timer events (if enabled)
    on_update();
}