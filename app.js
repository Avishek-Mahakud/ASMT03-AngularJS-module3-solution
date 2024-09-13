// Define the AngularJS module
var app = angular.module('MenuApp', []);

// Service to fetch menu items from the server
app.service('MenuSearchService', function($http) {
  this.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: 'GET',
      url: 'path/to/your/data.json'
    });
  };
});

// Controller to handle user input and filtering
app.controller('NarrowItDownController', function($scope, MenuSearchService) {
  $scope.searchTerm = '';
  $scope.foundItems = [];
  $scope.message = '';

  $scope.narrowItDown = function() {
    if ($scope.searchTerm.trim() === '') {
      $scope.foundItems = [];
      $scope.message = "Nothing found";
      return;
    }

    MenuSearchService.getMatchedMenuItems($scope.searchTerm)
      .then(function(response) {
        var allItems = [];
        angular.forEach(response.data, function(category) {
          allItems = allItems.concat(category.menu_items);
        });

        $scope.foundItems = allItems.filter(item =>
          item.description.toLowerCase().includes($scope.searchTerm.toLowerCase())
        );

        if ($scope.foundItems.length === 0) {
          $scope.message = "Nothing found";
        } else {
          $scope.message = "";
        }
      })
      .catch(function(error) {
        console.log("Error fetching data:", error);
      });
  };

  $scope.removeItem = function(index) {
    $scope.foundItems.splice(index, 1);
  };
});
