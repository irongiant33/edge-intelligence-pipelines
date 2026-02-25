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


test_mqtt_data-logic_template.json
- A pipeline that can be imported into EI. my attempt to use data logic to access digital IO port values from Edge intelligence

test_mqtt_template.json
- A pipeline that can be imported into EI. Successfully takes a MQTT subscription message and then publishes it to a MQTT server.