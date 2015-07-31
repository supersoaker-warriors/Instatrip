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
}
