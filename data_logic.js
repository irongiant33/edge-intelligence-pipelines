function readDigitalIO(devicePath)
{
    try
    {
        var file = open(devicePath, "r");
        if(!file)
        {
            logger.error("Failed to open digital IO device: " + devicePath);
            return null;
        }

        var value = file.read(1);
        file.close();

        if(value === '0' || value === '1')
        {
            return parseInt(value, 10);
        }
        else
        {
            logger.error("Unexpected digital IO value read: " + value);
            return null;
        }
    }
    catch(e)
    {
        logger.error("Error reading digital IO port: " + e.message);
        return null;
    }
}

function on_update()
{
    var dioValue = readDigitalIO("/dev/dio-1");
    output.value = Math.random();
    output.label = "data logic";
    output.from_input = input.test_mqtt_name;
    if(dioValue != null)
    {
        output.digitalIOPort1 = dioValue;
    }

    output.publish();
}

function on_time_trigger() {
  // Time-based trigger logic 
}