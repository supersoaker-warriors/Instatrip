angular.module('instatrip.map',[])
  .controller('mapCtrl', mapCtrl);

function mapCtrl ($scope, Getdata, $rootScope){
  $scope.getmap = Getdata.getmap;
  $scope.makeMap = function(){
    Getdata.getmap($rootScope.start, $rootScope.end, $rootScope.travelMethod);
  };

  // this will call the Getdata factory method to login
  $scope.logIn = function() {
    console.log("logging in redirect");
    Getdata.getLogin();
  };


  $scope.makeMap();


  $scope.playlist = Getdata.getPlaylist();

  $scope.$on('photo.moved_0', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_1', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_2', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_3', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_4', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_5', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_6', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_7', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_8', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_9', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_10', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_11', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_12', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_13', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_14', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
  $scope.$on('photo.moved_15', function(){
    $scope.playlist = Getdata.getPlaylist();
  });
}
