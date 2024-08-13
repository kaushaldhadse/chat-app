var app = angular.module('myApp', []);

// Chat Controller
app.controller('mainController', ['$scope', function($scope) {
    var socket = io.connect();
    $scope.send = function() {
        socket.emit('chat message', $scope.message);
        $scope.message = "";
    };
    socket.on('chat message', function(msg) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(msg));
        document.getElementById("messages").appendChild(li);
    });
}]);

// Authentication Controller
app.controller('authController', ['$scope', '$http', function($scope, $http) {
    $scope.signupData = {};
    $scope.loginData = {};

    $scope.signup = function() {
        $http.post('/signup', $scope.signupData)
            .then(function(response) {
                alert('Sign up successful');
                window.location.href = '/login';
            }, function(error) {
                alert('Sign up failed');
            });
    };

    $scope.login = function() {
        $http.post('/login', $scope.loginData)
            .then(function(response) {
                alert('Login successful');
                window.location.href = '/';
            }, function(error) {
                alert('Login failed');
            });
    };
}]);
