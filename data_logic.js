const fs = require('fs').promises;

function on_update()
{
    const content = fs.readFile("dev/dio-1", 'utf-8');
    console.log("test debug");
    publish("output", content)
}

function on_time_trigger() {
  // Time-based trigger logic 
  publish("output", "test");
}