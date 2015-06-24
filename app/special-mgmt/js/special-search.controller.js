// Visual Studio Code Typings and autocompletion
/// <reference path="../../../typings/angularjs/angular.d.ts"/>
angular.module('app.special-mgmt')
    .controller('SpecialSearchCntl', function ($scope, $modal, globalSpinner, specials, paginatedSpecialList, offers, appContext, oaspSecurityService) {
	'use strict';


	$scope.isChief = function () {
		// TODO fix 
		// var result = appContext.getCurrentUser().then(function (currentUser) {
		// 	console.log("currentUser: " + JSON.stringify(currentUser));
		// 	return currentUser.getUserId() === "chief";
		// });
		// 
		// return result;
		
		return true;
	};

	var selectedSpecial = function () {
		return $scope.selectedItems && $scope.selectedItems.length ? $scope.selectedItems[0] : undefined;
	};

	$scope.openEditDialog = function (specialRow) {
		$modal.open({
			templateUrl: 'special-mgmt/html/special-details.html',
			controller: 'SpecialDetailsCntl',
			resolve: {
				specialDetails: function () {
					if (specialRow) {
						return specials.loadSpecial(specialRow.id);
					} else {
						// create
						return {
							"id": null,
							"modificationCounter": null,
							"revision": null,
							"number": null,
							"specialName": null,
							"offerId": null,
							"specialPrice": null,
							"activeFrom": null,
							"activeTo": null,
						}
					}
				},
				allOffers: function () {
					return offers
						.loadAllOffers()
						.then(
						function (response) {
							//console.log("All Offers: " + JSON.stringify(response));
							return response;
						}
						);
				},
			}
		});
	};

	$scope.selectedItems = [];
	$scope.maxSize = 5;
	$scope.totalItems = paginatedSpecialList.pagination.total;
	$scope.numPerPage = paginatedSpecialList.pagination.size;
	$scope.currentPage = paginatedSpecialList.pagination.page;


	$scope.gridOptions = {
		data: paginatedSpecialList.result
	};


	$scope.reloadSpecials = function () {
		specials.getPaginatedSpecials($scope.currentPage, $scope.numPerPage).then(function (paginatedSpecials) {
			return paginatedSpecials;
		}).then(function (res) {
			paginatedSpecialList = res;
			$scope.gridOptions.data = paginatedSpecialList.result;
		});
	};

	$scope.$watch('currentPage', function () {
		$scope.reloadSpecials();
	});

	$scope.buttonDefs = [
		{
			label: 'Edit Special',
			onClick: function () {
				$scope.openEditDialog(selectedSpecial());
			},
			isActive: function () {
				return selectedSpecial();
			}
		},
		{
			label: 'Create New Special',
			onClick: function () {
				$scope.openEditDialog();
			},
			isActive: function () {
				return true;
			}
		},
		{
			label: 'Delete Special',
			onClick: function () {
				specials.deleteSpecial(selectedSpecial().id);
				$scope.reloadSpecials();
			},
			isActive: function () {
				return selectedSpecial();
			}
		},
	];


});