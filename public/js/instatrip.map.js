angular.module('instatrip.map',[])
  .controller('mapCtrl', mapCtrl);

function mapCtrl ($scope, Getdata, $rootScope){
  $scope.getmap = Getdata.getmap;

  $scope.makeMap = function(){
    Getdata.getmap($rootScope.start, $rootScope.end, $rootScope.travelMethod);
  };


  $scope.makeMap();
  $scope.$on('photo.moved_0', function(){
 	console.log("This is in maps controller");
  });
}
