(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', ['MenuSearchService', function (MenuSearchService) {
        var ctrl = this;

        ctrl.narrowItDown = function () {
            if (!ctrl.searchTerm) {
                ctrl.found = [];
                return;
            }
            MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
            .then(function (foundItems) {
                ctrl.found = foundItems;
            });
        };

        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
        };
    }])
    .service('MenuSearchService', ['$http', function ($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: 'GET',
                url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
            }).then(function (response) {
                var items = response.data.menu_items;
                var foundItems = [];

                for (var key in items) {
                    if (items.hasOwnProperty(key)) {
                        var item = items[key];
                        if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                            foundItems.push(item);
                        }
                    }
                }
                return foundItems;
            });
        };
    }])
    .directive('foundItems', function () {
        return {
            restrict: 'E',
            template: `
                <ul>
                    <li ng-repeat="item in found track by $index">
                        {{item.name}}, {{item.short_name}}, {{item.description}}
                        <button ng-click="onRemove({index: $index})">Don't want this one!</button>
                    </li>
                </ul>
            `,
            scope: {
                found: '<',
                onRemove: '&'
            }
        };
    });

})();
