angular.module('instatrip.map',[])
  .controller('mapCtrl', mapCtrl);

function mapCtrl ($scope, Getdata, $rootScope){
  $scope.getmap = Getdata.getmap;
  $scope.makeMap = function(){
    Getdata.getmap($rootScope.start, $rootScope.end, $rootScope.travelMethod);
  };
<<<<<<< HEAD
  $scope.makeMap();

  $scope.$on('photo.moved_0', function(){
  	 // Getdata.getSongs();

  $scope.playlist = Getdata.getPlaylist();
  $scope.makeMap();

  $scope.$on('photo.moved_0', function(){
=======
  $scope.playlist = Getdata.getPlaylist();
  $scope.makeMap();

  $scope.$on('photo.moved_0', function(){
>>>>>>> [FIX] Got playlist to work
  	 // Getdata.getPlaylist();
  });
}
