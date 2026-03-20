// Cisco Edge Intelligence Data Logic Script
// Implements stable-state timing for alarm → digital output control

// State variables (persist across calls)
var lastAlarmValue  = null;             // "ON", "OFF" or null
var stableSince     = 0;                // timestamp (ms) when current value became stable
var outputIsOn      = false;            // current known state of the digital output

function init() {
    logger.info("Initialized: stable-state alarm logic (1 min ON delay / 5 min OFF delay)");
}

function on_update() {
    // Only care about changes from the alarm input asset
    if (trigger.device_name !== ALARM_ASSET) {
        return;
    }

    // alarm_status is the attribute name and label from the Edge Intelligence source
    var current = (input.alarm_status || "").toString().toUpperCase().trim();

    // Normalize to "ON" / "OFF" (ignore invalid values)
    if (current !== "ON" && current !== "OFF") {
        logger.warn("Invalid alarm_status value: " + current);
        return;
    }

    var now = trigger.timestamp || Date.now();   // ms since epoch

    if (current === lastAlarmValue) {
        // No change → already stable, do nothing here (timer will check)
        return;
    }

    // Value changed → reset stable timer
    logger.info("Alarm status changed: " + (lastAlarmValue || "unknown") + " → " + current);
    lastAlarmValue = current;
    stableSince    = now;

    // Optional: immediate reaction on first receipt or very noisy signal is possible here,
    // but we skip it to strictly enforce the stable delays
}

function on_time_trigger() {
    if (lastAlarmValue === null || stableSince === 0) {
        return;  // not yet initialized / no data received
    }

    var now          = trigger.timestamp || Date.now();
    var stableMs     = now - stableSince;
    var shouldBeOn   = (lastAlarmValue === "ON"  && stableMs >=  60000) ||   // 1 min
                       (lastAlarmValue === "OFF" && stableMs >= 300000);    // 5 min = 300000 ms

    // Only act if the stable condition is met AND output doesn't already match desired state
    if (shouldBeOn && !outputIsOn) {
        OUTPUT_ASSET.do1 = true;           // adjust field name(s) as needed: do1, relay1, output_bit...
        
        // logic to control DIO would go here

        outputIsOn = true;
        logger.info("Stable ON for " + Math.round(stableMs/1000) + "s → digital output TURNED ON");
        
        // Optional telemetry upstream
        output.alarm_output_state = "ON";
        output.publish();
    }
    else if (!shouldBeOn && outputIsOn) {
        
        // logic to control DIO would go here

        outputIsOn = false;
        logger.info("Stable OFF for " + Math.round(stableMs/1000) + "s → digital output TURNED OFF");

        output.alarm_output_state = "OFF";
        output.publish();
    }
    // else: no change needed yet (still in delay window or already matching)
}