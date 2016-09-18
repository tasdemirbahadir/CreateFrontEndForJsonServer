exports.config = {

  capabilities: {
    browserName: 'chrome'
  },
  
  specs: [
    '*.js'
  ],
  
  onPrepare: function() {
	browser.ignoreSynchronization = true;
	browser.waitForAngular();
	browser.sleep(500); 
	// By default, Protractor use data:text/html,<html></html> as resetUrl, but 
	// location.replace from the data: to the file: protocol is not allowed
	// (we'll get ‘not allowed local resource’ error), so we replace resetUrl with one
	// with the file: protocol (this particular one will open system's root folder)
	browser.resetUrl = 'file:///';
  }

};