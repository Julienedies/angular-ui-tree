(function () {
  'use strict';

  angular.module('ui.tree')

    .controller('TreeNodeController', ['$scope', '$element', '$attrs', 'treeConfig',
      function ($scope, $element, $attrs, treeConfig) {
        this.scope = $scope;

        $scope.$element = $element;
        $scope.$modelValue = null; // Model value for node;
        $scope.$parentNodeScope = null; // uiTreeNode Scope of parent node;
        $scope.$childNodesScope = null; // uiTreeNodes Scope of child nodes.
        $scope.$parentNodesScope = null; // uiTreeNodes Scope of parent nodes.
        $scope.$treeScope = null; // uiTree scope
        $scope.$handleScope = null; // it's handle scope
        $scope.$type = 'uiTreeNode';
        $scope.$$apply = false; // 

        $scope.collapsed = false;

        $scope.init = function(controllersArr) {
          var treeNodesCtrl = controllersArr[0];
          $scope.$treeScope = controllersArr[1] ? controllersArr[1].scope : null;

          // find the scope of it's parent node
          $scope.$parentNodeScope = treeNodesCtrl.scope.$nodeScope;
          // modelValue for current node
          $scope.$modelValue = treeNodesCtrl.scope.$modelValue[$scope.$index];
          $scope.$parentNodesScope = treeNodesCtrl.scope;
          treeNodesCtrl.scope.initSubNode($scope); // init sub nodes

          $element.on('$destroy', function() {
          });
        };

        $scope.index = function() {
          return $scope.$parentNodesScope.$modelValue.indexOf($scope.$modelValue);
        };

        $scope.dragEnabled = function() {
          return !($scope.$treeScope && !$scope.$treeScope.dragEnabled);
        };

        $scope.isSibling = function(targetNode) {
          return $scope.$parentNodesScope == targetNode.$parentNodesScope;
        };

        $scope.isChild = function(targetNode) {
          var nodes = $scope.childNodes();
          return nodes && nodes.indexOf(targetNode) > -1;
        };

        $scope.prev = function() {
          var index = $scope.index();
          if (index > 0) {
            return $scope.siblings()[index - 1];
          }
          return null;
        };

        $scope.siblings = function() {
          return $scope.$parentNodesScope.$nodes;
        };

        $scope.childNodesCount = function() {
          return $scope.childNodes() ? $scope.childNodes().length : 0;
        };

        $scope.hasChild = function() {
          return $scope.childNodesCount() > 0;
        };

        $scope.childNodes = function() {
          return $scope.$childNodesScope ? $scope.$childNodesScope.$nodes : null;
        };

        $scope.accept = function(sourceNode, destIndex) {
          return $scope.$childNodesScope && $scope.$childNodesScope.accept(sourceNode, destIndex);
        };

        $scope.remove = function() {
          return $scope.$parentNodesScope.removeNode($scope);
        };

        $scope.insertNode = function(index, node) {
          $scope.$childNodesScope && $scope.$childNodesScope.insertNode(index, node);
        };

        $scope.toggle = function() {
          $scope.collapsed = !$scope.collapsed;
        };

        $scope.collapse = function() {
          $scope.collapsed = true;
        };

        $scope.expand = function() {
          $scope.collapsed = false;
        };

        $scope.depth = function() {
          var parentNode = $scope.$parentNodeScope;
          if (parentNode) {
            return parentNode.depth() + 1;
          }
          return 1;
        };

        var subDepth = 0;
        var countSubDepth = function(scope) {
          var count = 0;
          for (var i = 0; i < scope.$nodes.length; i++) {
            var childNodes = scope.$nodes[i].$childNodesScope;
            if (childNodes) {
              count = 1;
              countSubDepth(childNodes);
            }
          }
          subDepth += count;
        };

        $scope.maxSubDepth = function() {
          subDepth = 0;
          if ($scope.$childNodesScope) {
            countSubDepth($scope.$childNodesScope);
          }
          return subDepth;
        };

      }
    ]);
})();
