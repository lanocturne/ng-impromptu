/**
 * @ngdoc directive
 * @name ngImpromptu
 * @restrict E
 *
 * @description
 * A directive for jquery-impromptu: http://trentrichardson.com/Impromptu.
 *
 * Impromptu would promote a dialog with states transfer to provide a decent way for product tour.
 * @param {array} config States configuration for impromptu
 * @param {boolean} auto Should impromptu start on document ready?
 *
 * @example
 <example module="impromptuExample">
 <file name="index.html">
 <script>
 angular.module('impromptuExample', [])
 .controller('ExampleController', ['$scope', function($scope) {
                           $scope.impromptu = {
                        isStarted: true,
                        config: [
                            {
                                focus: 1,
                                html: '<div class="hbox"><div id="title-text" class="col-md-12">' +
                                '<span class="main-text">Welcome to <strong>use impromptu</strong></span>' +
                                '<br><span>( This tutorial is about to show you how to use impromptu. )</span><br/><br/><span class="small"><em>desc goes here.</em></span></div></div>'
                            },
                            {
                                focus: 0
                                html: ['<div class="hbox"><span class="main-text">tour 2 title goes here</span></div>',
                                    '<div class="hbox"><img width="60px" height="60px" src="', USELESS_THUMB.value, '"/></div>'].join('')
                            },
                            {
                                html: '<div class="hbox"><div id="title-text" class="col-md-12">' +
                                '<span class="main-text">Thanks to <strong>use impromptu</strong></span>' +
                                '<br><span>( This tutorial is done. )</span><br/><br/><span class="small"><em>desc goes here.</em></span></div></div>'
                            }
                        ]
                    };
                         }]);
 </script>
 <div ng-controller="ExampleController">
 <impromptu config="impromptu.config" auto="impromptu.isStarted"></impromptu>
 </div>
 </file>
 </example>
 * Created by stan on 3/9/15.
 * Captora.com
 */
'use strict';

angular.module('ngImpromptu', [])
    .directive('impromptu', function () {
        return {
            restrict: 'E',
            scope: {
                config: '=',
                auto: '='
            },
            controller: function ($scope) {
                $scope.states = [];
                $scope.config.forEach(function (c, i) {
                    var state = angular.copy(c);
                    angular.extend(state, {
                        focus: 1,
                        buttons: {Prev: -1, Next: 1},
                        submit: function (e, v) {
                            if (v) {
                                e.preventDefault();
                                $.prompt.nextState();
                                return false;
                            }
                            $.prompt.close();
                        }
                    });
                    if (i === 0) {
                        state.buttons = c.buttons || {Cancel: false, Next: true};
                    }
                    if (i === $scope.config.length - 1) {
                        state.buttons = c.buttons || {Back: -1, Exit: 0};
                        state.submit = function (e, v) {
                            e.preventDefault();
                            if (v === 0) {
                                $.prompt.close();
                            }
                            else if (v == -1) {
                                $.prompt.prevState();
                            }
                        };
                    }
                    $scope.states.push(state);
                });

                if ($scope.auto) {
                    $.prompt($scope.states);
                }
            }
        };
    });
