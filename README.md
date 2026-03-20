# Digital IO Use on IR1101

### Working Scripts

- `dio_data_logic.js`: this script, when ran with the https://github.com/etychon/iox-ir1101-dio-write-web container on the IR1101, can trigger digital IO outputs from Edge Intelligence. 
- `http_test_template.json`: this is the full edge intelligence pipeline that can run the dio_data_logic script

### Extra Notes

Output logic data model

comma separated value containing "key", "type", and "category"

"key"
- String containing the variable name

"type"
- "STRING"
- "INT"
- "DOUBLE"
- "BOOLEAN"
- "BINARY"

"category"
- "ATTRIBUTE"
- "TELEMETRY"
- "PROPERTY"

`dio_timing_logic.js`
- an example of how to control DIO timing logic given an input that changes with high frequency. 

`test_mqtt_data-logic_template.json`
- A pipeline that can be imported into EI. my attempt to use data logic to access digital IO port values from Edge intelligence

`test_mqtt_template.json`
- A pipeline that can be imported into EI. Successfully takes a MQTT subscription message and then publishes it to a MQTT server.