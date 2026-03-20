/** This is the mandatory function that each EI data logic must implement
   *  Start of EI Data Logic*/
  /////////////////////////////////////////////////////////////
  
  function on_update() {
    /**Process the input data. 
    In this case, output is some random number
    */
    output.value = Math.random();
    
    /**
     * Data processing logic
     */
  
    //This is a mandatory function for the data logic and must be the last to be called */
    output.publish();
  }

function on_time_trigger() {
  // Time-based trigger logic 
}