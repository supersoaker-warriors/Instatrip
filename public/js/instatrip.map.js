angular.module('instatrip.map',[])
  .controller('mapCtrl', mapCtrl);

function mapCtrl ($scope, Getdata, $rootScope){
  $scope.getmap = Getdata.getmap;
  $scope.makeMap = function(){
    Getdata.getmap($rootScope.start, $rootScope.end, $rootScope.travelMethod);
  };
  $scope.makeMap();


  $scope.playlist = Getdata.getPlaylist();

  $scope.$on('photo.moved_0', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
}
