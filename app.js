(function () {
  "use strict";

  angular
    .module("NarrowItDownApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service("MenuSearchService", MenuSearchService)
    .constant("ApiBasePath", "https://coursera-jhu-default-rtdb.firebaseio.com")
    .directive("foundItems", FoundItemsDirective);

  //Directive

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: "foundItems.html",
      scope: {
        items: "<",
        onRemove: "&",
      },
    };
    return ddo;
  }

  // Controller
  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController(MenuSearchService) {
    var narrowCtrl = this;
    narrowCtrl.searchTerm = "";
    narrowCtrl.found = [];

    narrowCtrl.search = function () {
      narrowCtrl.found = [];
      if (narrowCtrl.searchTerm.trim() != "") {
        var promise = MenuSearchService.getMatchedMenuItems(
          narrowCtrl.searchTerm
        );
        promise
          .then(function (result) {
            narrowCtrl.found = result;
          })
          .catch(function (error) {
            console.log("Something went wrong: " + error);
            narrowCtrl.search = "Nothing found 2";
          });
      }
    };


    narrowCtrl.remove = function (index) {
      narrowCtrl.found.splice(index, 1);
    };
  }

  // Service
  MenuSearchService.$inject = ["$http", "ApiBasePath"];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: ApiBasePath + "/menu_items.json",
      }).then(function (result) {
        var foundItems = [];
        for (var category in result.data) {
          if (result.data.hasOwnProperty(category)) {
            var menuItems = result.data[category].menu_items;
          }

          var matchedItems = menuItems.filter(function (item) {
            return (
              item.description
                .toLowerCase()
                .indexOf(searchTerm.toLowerCase()) !== -1
            );
          });
          foundItems = foundItems.concat(matchedItems);
        }
        return foundItems;
      });
    };
  }
})();
