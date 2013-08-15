angular.module('html6', []).
    directive('remember', function(){
        return {
            require: '^ngModel',
            link: function(scope,elm,attrs,ngModelCtrl){
                //Could namespace it by parameterizing the remember directive, or by creating a namespace directive which it uses
                //In both cases append the namespace to the model name or whatever

                elm.on('blur keyup change', function(){
                    localStorage[attrs.ngModel] = ngModelCtrl.$viewValue;
                });
                ngModelCtrl.$setViewValue(localStorage[attrs.ngModel])

                ngModelCtrl.$render = function() {
                    //Seems to play nice with strings
                    elm.val(ngModelCtrl.$viewValue);
                };
                ngModelCtrl.$render();
            }
        };
    }).
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
                "   <div class=navbar-inner>" +
                "       <div class=container>" +
                "           <button ng-click=\"toggleCollapse\" type=\"button\" class=\"btn btn-navbar\" data-toggle=collapse data-target=\".nav-collapse\">" +
                "               <span class=icon-bar></span>" +
                "               <span class=icon-bar></span>" +
                "               <span class=icon-bar></span>" +
                "           </button>" +
                "           <span class=\"brand\" ng-bind=\"brand\"></span>" +
                "           <div class=\"nav-collapse collapse\">" +
                "               <ul class=\"nav\" ng-transclude>" +
                "               </ul>" +
                "           </div>" +
                "       </div>" +
                "   </div>" +
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
                '   <ul class="nav nav-tabs">' +
                '       <li ng-repeat="pane in panes" ng-init="pane.index=$index;" ng-class="{active: tab==$index+1}">' +
                '           <a href="#{{root}}/{{$index + 1}}">{{pane.title}}</a>' +
                '       </li>' +
                '   </ul>' +
                '   <div class="tab-content" ng-transclude>' +
                '   </div>' +
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
    }).
    directive('chat', function() {
        /* Useful styles
        .media-heading {
            display: inline;
            color: #483D8B;
         }
        .media-heading + span {
            margin-left: 10px;
            font-size: 80%;
         }
        */
        return {
            restrict: 'E',
            controller: function ($scope, $filter, Chat) {
                $scope.chats = Chat.query();


                $scope.save = function() {
                    if ($scope.chat.email == null) {$scope.chat.email = (new Date).toString()};
                    $scope.chat.gravhash = CryptoJS.MD5($filter('lowercase')($scope.chat.email)).toString();
                    $scope.chat.date = new Date();
                    delete $scope.chat.email;

                    Chat.save($scope.chat, function(chat) {

                        $scope.chats.push(chat);
                    });
                }
            },

            template:
                '<div class=chat-module>' +
                '   <h3 class=page-header>Comments</h3>' +
                '   <div class="chat-box">' +
                '       <div ng-repeat="chat in chats | orderBy:\'_id.$oid\':true"" class=media>' +
                '           <img class="pull-left media-object" src="http://www.gravatar.com/avatar/{{chat.gravhash}}?s=50&d=identicon">' +
                '           <div class="media-body">' +
                '               <h5 class="media-heading">{{chat.poster}}</h5><span>{{chat.date | date:"MM/dd/yy \'at\' h:mm a"}}</span>' +
                '               <p>{{chat.content}}</p>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +

                '   <h4 class=page-header>Your comment</h4>' +

                '   <form name="chatForm">' +
                '       <div class="control-group" ng-class="{error: chatForm.poster.$invalid}">' +
                '           <label>Your name</label>' +
                '           <input type="text" name="poster" ng-model="chat.poster" required>' +
                '           <span ng-show="chatForm.poster.$error.required" class=help-inline>Required</span>' +
                '       </div>' +

                '       <div class="control-group" ng-class="{error: chatForm.email.$invalid}">' +
                '           <label>Gravatar</label>' +
                '           <input type="email" name="email" ng-model="chat.email">' +
                '           <span ng-show="chatForm.email.$error.email" class=help-inline>Not valid email</span>' +
                '       </div>' +

                '   <div class="control-group" ng-class="{error: chatForm.content.$invalid}">' +
                '       <label>Comment</label>' +
                '       <textarea name="content" ng-model="chat.content" required></textarea>' +
                '      <span ng-show="chatForm.content.$error.required" class="help-inline">Required</span>' +
                '   </div>' +
                '   <br>' +
                '   <button ng-click="save()" ng-disabled="chatForm.$invalid" class="btn">Comment</button>' +

                '   </form>' +
                '</div>',
            replace: true

        }
    });


/*
 <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
 <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
 <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
 <!--jquery is needed before bootstrap.js for responsive navbar -->
 <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
 <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular-resource.min.js"></script>
 <script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js"></script>


*/