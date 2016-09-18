//--NEEDED METHODS--
//Created needed methods for the assignment

//Do error stuf
var doError = function(error) {
	console.log(error);
	alert("Error occured. :" + error);
};

//Prepare data table
var setDataTable = function($scope, data) {
	
	var dataForTable = [];
	
	for (var i = 0; i < data.length; i++) {
		dataForTable.push([data[i].id, data[i].method, data[i].amount, data[i].currency, data[i].created, data[i].status, data[i].merchant]);
	}
	
	//Check if table object is gone but table still there (when table removed for form)
	if (!$scope.paymentsDataTable && $.fn.dataTable.isDataTable( '#payments_table' )) {
		$scope.paymentsDataTable = $('#payments_table').DataTable();
	}
	
	if ($scope.paymentsDataTable) {
		$scope.paymentsDataTable.clear();
		$scope.paymentsDataTable.rows.add(dataForTable);
		$scope.paymentsDataTable.draw();
	} else {
		$scope.paymentsDataTable = $('#payments_table').DataTable( {
			deferRender: true,
			data: dataForTable,
			columnDefs: [
				{ className: "merchant_value_cell", "targets": [ 6 ] },
				{ className: "method_value_cell", "targets": [ 1 ] }
			 ],
			 lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
		} );
	}
	
};

//Remove table to show form
var removeTable = function($scope) {
	if ($scope.paymentsDataTable) {
		$scope.paymentsDataTable.clear();
		delete $scope.paymentsDataTable;
	}
};

//Get list from db method
var getListFromDB = function(callback, $http) {
	$http.get("http://localhost:3000/payments").success(function(response){
		callback(response);
	}).error(function(error) {
		doError(error);
	});
}
//Compare function to sort response array according to the amount field
var compareByAmount = function(a,b) {
	
    if (a.amount < b.amount)
        return 1;
    if (a.amount > b.amount)
        return -1;
    return 0;
	
};
//Compare function to sort response array according to the id field
var compareById = function(a,b) {
	
    if (a.id < b.id)
        return 1;
    if (a.id > b.id)
        return -1;
    return 0;
	
};
//Lock function to access db while adding new record. Because it must be locked
//to fix errors for two insert operations at the same time.
var functionLock = false;
var functionCallbacks = [];
var lockingFunction = function (callback) {
    if (functionLock) {
        functionCallbacks.push(callback);
    } else {
        $.longRunning(function(response) {
             while(functionCallbacks.length){
                 var thisCallback = functionCallbacks.pop();
                 thisCallback(response);
             }
        });
    }
}

//--ANGULAR JS APP INIT--
var angular_app = angular.module('json_server_app', []);

//--ANGULAR JS CONTROLLER IMPLEMENTATION--
angular_app.controller('json_server_app_controller', function($scope, $http) {
    
	//Callback click function
	$scope.callbackClick = function() {
		
		//Set false to remove form if exists
		$scope.adPaymentForm = false;
		getListFromDB(function (response) {
			
			//Sort by amount (DESC)
			response.sort(compareByAmount);
			//Get biggest 20
			response = response.slice(0, 20);
			//Set to table
			$scope.safeApply(setDataTable($scope, response));
			
		}, $http);
		
	};
	
	//Promise
	$scope.promiseClick = function() {
		
		//Set false to remove form if exists
		$scope.adPaymentForm = false;
		
		//Do ajax
		var promise = $.ajax({
			url: "http://localhost:3000/payments",
			method: "GET"
		});
		
		//On promise.done, do work
		promise.done(function(response) {
			//Filter merhant = Ginger
			response = $.grep(response, function (element, index) {
				return element.merchant == "Ginger";
			});
			//Set to data table
			$scope.safeApply(setDataTable($scope, response));
		});
		
		promise.fail(doError);
		
	};
	
	
	//Filters to select on main screen
	$scope.filterOptions = [{ name: "Credit Card", id: 0, key: "creditcard" }, { name: "Bank Transfer", id: 1, key: "bank-transfer" }, { name: "Ideal", id: 2, key: "ideal" }];
	$scope.selectedFilterOption = $scope.filterOptions[0];
	
	//On any filter clicked
	$scope.filterClick = function() {
		
		//Set false to remove form if exists
		$scope.adPaymentForm = false;
		
		getListFromDB(function (response) {
			
			//Filter elements according to the selected filter key
			response = $.grep(response, function (element, index) {
				return element.method == $scope.selectedFilterOption.key;
			});
			
			//Set to table
			$scope.safeApply(setDataTable($scope, response));
			
		}, $http);
		
	};
	
	//Add Payment
	$scope.addPaymentClick = function() {
		
		removeTable($scope);
		
		//Set true to show the form
		$scope.adPaymentForm = true;
		
		getListFromDB(function(response) {
			
			//Set addResult to empty to hide if a result currently
			$scope.addResult = '';
			
			//Get data from db to prepare lists for the fields method, currency, status and merchant
			$scope.methods = {};
			$scope.methodsArray = [];
			$scope.selectedMethod;
			$scope.currencies = {};
			$scope.currenciesArray = [];
			$scope.selectedCurrency;
			$scope.statuses = {};
			$scope.statusesArray = [];
			$scope.selectedStatus;
			$scope.merchants = {};
			$scope.merchantsArray = [];
			$scope.selectedMerchant;
			
			var counter = 1;
			for (var i = 0; i < response.length; i++) {
				
				if ($scope.methods[response[i].method] == undefined) {
					$scope.methods[response[i].method] = {id: counter, value: response[i].method};
				}
				counter++;
			}
			Object.keys($scope.methods).forEach(function (key) {
			   $scope.methodsArray.push($scope.methods[key]);
			});
			
			counter = 1;
			for (var i = 0; i < response.length; i++) {
				
				if ($scope.currencies[response[i].currency] == undefined) {
					$scope.currencies[response[i].currency] = {id: counter, value: response[i].currency};
				}
				counter++;
			}
			Object.keys($scope.currencies).forEach(function (key) {
			   $scope.currenciesArray.push($scope.currencies[key]);
			});
			
			counter = 1;
			for (var i = 0; i < response.length; i++) {
				
				if ($scope.statuses[response[i].status] == undefined) {
					$scope.statuses[response[i].status] = {id: counter, value: response[i].status};
				}
				counter++;
			}
			Object.keys($scope.statuses).forEach(function (key) {
			   $scope.statusesArray.push($scope.statuses[key]);
			});
			
			counter = 1;
			for (var i = 0; i < response.length; i++) {
				
				if ($scope.merchants[response[i].merchant] == undefined) {
					$scope.merchants[response[i].merchant] = {id: counter, value: response[i].merchant};
				}
				counter++;
			}
			Object.keys($scope.merchants).forEach(function (key) {
			   $scope.merchantsArray.push($scope.merchants[key]);
			});
			
		}, $http);
		
		
	};
	
	$scope.addPaymentMethodClick = function() {
		
			$scope.formInfo = !$scope.formInfo ? {} : $scope.formInfo;
		
			$scope.methodRequired = '';
			$scope.amountRequired = '';
			$scope.currencyRequired = '';
			$scope.statusRequired = '';
			$scope.merchantRequired = '';
			$scope.addResult = '';
			
			//Check if needed fields are empty
			if (!$scope.selectedMethod
					|| !$scope.formInfo.amount
					|| !$scope.selectedCurrency
					|| !$scope.selectedStatus
					|| !$scope.selectedMerchant) {
						if (!$scope.selectedMethod) {
							$scope.methodRequired = 'Method Required';
						}

						if (!$scope.formInfo.amount) {
							$scope.amountRequired = 'Amount Required';
						}

						if (!$scope.selectedCurrency) {
							$scope.currencyRequired = 'Currency Required';
						}
						
						if (!$scope.selectedStatus) {
							$scope.statusRequired = 'Status Required';
						}
						
						if (!$scope.selectedMerchant) {
							$scope.merchantRequired = 'Merchant Required';
						}
				return;
			} else {
				
				functionLock = true;
				//Locking function to fix error when two add operation is happening
				//at the same time
				lockingFunction(getListFromDB(function(response) {
					//Sort by id DESC to find the biggest id to use the next one
					response.sort(compareById);
					//Set selected data from form
					var postData = {
						id: response[0].id + 1,
						method: $scope.selectedMethod.value,
						amount: $scope.formInfo.amount,
						currency: $scope.selectedCurrency.value,
						created: new Date().toString(),
						status: $scope.selectedStatus.value,
						merchant: $scope.selectedMerchant.value
					};
					$http.post("http://localhost:3000/payments", postData).success(function(response) {
						$scope.addResult = "Success";
						$("#addResult").css("color", "green");
					}).error(function(error) {
						$scope.addResult = "Error";
						$("#addResult").css("color", "red");
						doError(error);
					});
				}, $http));
				functionLock = false;
				
			}
		
	};
	
	//Needed functions and components for angular $scope
	
	//Safe apply to use method $scope.apply to inform
	//current scope about the changes. It is needed to make
	//table seen when the Promise button clicked. It was not showing at
	//the fisrt click.
	$scope.safeApply = function(fn) {
	    var phase = this.$root.$$phase;
	    if(phase == '$apply' || phase == '$digest') {
		    if(fn && (typeof(fn) === 'function')) {
		        fn();
		    }
	    } else {
		    this.$apply(fn);
	    }
	};
	
});
