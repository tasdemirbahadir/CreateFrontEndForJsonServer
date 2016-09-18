'use strict';

describe("Buttons' tests are started", function() {
	
	it('Should retrieve 20 records into table', function() {
		
		browser.get('file:///C:/Users/Bahadir%20Tasdemir/Desktop/Documents/JobInterviews/GingerPayments/ginger-frontend-assignment/ginger-frontend-assignment/task_project/frontend/index.html');
		
		var button = element(by.buttonText('Callback'));

		button.click();
		
		browser.driver.sleep(1000);
		browser.waitForAngular();
		
		element(by.cssContainingText('option', 'All')).click();
		
		var responseDataInfo = element(by.id('payments_table_info'));
		
		expect(responseDataInfo.getText()).toEqual("Showing 1 to 20 of 20 entries");
		
	});
	
	it('Should retrieve records into table with merchant = "Ginger"', function() {
		
		var button = element(by.buttonText('Promise'));

		button.click();
		
		browser.driver.sleep(1000);
		browser.waitForAngular();
		
		var names = element.all(by.className('pmerchant_value_cell')).map(function(elem) {
			expect(elem.getText()).toMatch('/Ginger/');
		});
		
	});
	
	it('Filters: Should retrieve records into table with method = "credit-card"', function() {
		
		element(by.cssContainingText('option', 'Credit Card')).click();
		var button = element(by.buttonText('Filter'));

		button.click();
		
		browser.driver.sleep(2000);
		browser.waitForAngular();
		
		var names = element.all(by.className('pmethod_value_cell')).map(function(elem) {
			expect(elem.getText()).toBe('/creditcard/', 'Actual Value = ' + elem.getText());
		});
		
	});
	
	it('Filters: Should retrieve records into table with method = "bank-transfer"', function() {
		
		element(by.cssContainingText('option', 'Bank Transfer')).click();
		var button = element(by.buttonText('Filter'));

		button.click();
		
		browser.driver.sleep(2000);
		browser.waitForAngular();
		
		var names = element.all(by.className('pmethod_value_cell')).map(function(elem) {
			expect(elem.getText()).toBe('/bank-transfer/', 'Actual Value = ' + elem.getText());
		});
		
	});
	
	it('Filters: Should retrieve records into table with method = "ideal"', function() {
		
		element(by.cssContainingText('option', 'Ideal')).click();
		var button = element(by.buttonText('Filter'));

		button.click();
		
		browser.driver.sleep(2000);
		browser.waitForAngular();
		
		var names = element.all(by.className('pmethod_value_cell')).map(function(elem) {
			expect(elem.getText()).toBe('/ideal/', 'Actual Value = ' + elem.getText());
		});
		
	});
	
	it('Add payment method must return success', function() {
		
		/* element(by.cssContainingText('option', 'Ideal')).click(); */
		var button = element(by.buttonText('Add payment'));
		var amountInput = element(by.id("inputAmount"));

		button.click();
		
		element(by.cssContainingText('option', 'creditcard')).click();
		amountInput.sendKeys('555555');
		element(by.cssContainingText('option', 'USD')).click();
		element(by.cssContainingText('option', 'accepted')).click();
		element(by.cssContainingText('option', 'Ginger')).click();
		
		var buttonSubmit = element(by.buttonText('Save New Payment'));
		buttonSubmit.click();
		browser.driver.sleep(2000);
		browser.waitForAngular();
		
		var responseDataInfo = element(by.id('addResult'));
		
		expect(responseDataInfo.getText()).toEqual("Success");
		
	});
	
});
