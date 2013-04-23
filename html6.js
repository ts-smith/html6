angular.module('html6', []).
    directive('navbar', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                brand: "@brand"
            },
            link: function(scope, element, attrs){
                scope.brand = attrs.brand;
            },
            template:
                "<div class=\"navbar navbar-static-top\">" +
                    "<div class=navbar-inner>" +
                        "<div class=container>" +
                            "<button type=\"button\" class=\"btn btn-navbar\" data-toggle=collapse data-target=\".nav-collapse\">" +
                                "<span class=icon-bar></span>" +
                                "<span class=icon-bar></span>" +
                                "<span class=icon-bar></span>" +
                            "</button>" +
                            "<span class=\"brand\" ng-bind=\"brand\"></span>" +
                            "<div class=\"nav-collapse collapse\">" +
                                "<ul class=\"nav\" ng-transclude>" +
                                "</ul>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>",
            replace: true
        };
    }).
    directive('routetabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            controller: function ($scope, $element, $routeParams){
                var tab = $routeParams.tab;
                this.tab = tab;
                var panes = $scope.panes = [];

                this.addPane = function(pane){
                    panes.push(pane);
                }
            },
            link: function(scope, element, attrs){
                scope.root = attrs.root;
            },
            template:
                '<div class="tabbable">' +
                    '<ul class="nav nav-tabs">' +
                        '<li ng-repeat="pane in panes" ng-init="pane.index=$index;" ng-class="{active: tab==$index+1}">' +
                            '<a href="#{{root}}/{{$index + 1}}">{{pane.title}}</a>' +
                        '</li>' +
                    '</ul>' +
                    '<div class="tab-content" ng-transclude>' +
                    '</div>' +
                '</div>',
            replace: true
        };
    }).
    directive('routepane', function() {
        return {
            require: '^routetabs',
            restrict: 'E',
            transclude: true,
            scope: { title: '@' },

            link: function(scope, element, attrs, tabsCtrl){
                scope.tab = tabsCtrl.tab;
                tabsCtrl.addPane(scope);
            },
            template:
                '<div ng-class="{active: tab==index+1}" class="tab-pane"  ng-transclude></div>',
            replace: true
        };
    })
