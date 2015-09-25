ctrlApp
.factory('Camera', ['$q', function ($q) {
        
        return {
            getPicture: function (options) {
                var q = $q.defer();
                
                try {
                    navigator.camera.getPicture(function (result) {
                        // Do any magic you need
                        q.resolve(result);
                    }, function (err) {
                        
                        q.reject(err);
                    }, options);

                } catch (e) {
                    console.log("Camera Not Supported!");
                }
                
                return q.promise;
            }
        }
    }])





ctrlApp.service('DataLayer', ['$http', '$location', function ($http, $location) {
  var data = {};
  var baseUrl = "http://imsandbox.cloudapp.net/api";
  var schemaPosts = "feed";

  data.getItems = function () {
      return $http.get(baseUrl + '/' + schemaPosts);
  }

  data.addComment = function(item, userId, userFullName, commentText){
    var comment = {
      "userId": userId,
      "userFullName": userFullName,
      "title": commentText
    };

    var data = item;
    data.comments.push(comment);

    return $http.post(baseUrl + '/update/' + schemaPosts + '/' + item._id + '/', {
      data: data
    });
  }

  data.addLike = function(item, userId, userFullName){
    var data = item;
    
    var like = {
      "userId": userId,
      "userFullName": userFullName,
    };
    data.likes.push(like);

    return $http.post(baseUrl + '/update/' + schemaPosts + '/' + item._id + '/', {
      data: data
    });
  }

  data.removeLike = function(item, userId){
    
    var newLikes = _.reject(item.likes, function(item,i){
      return item.userId == userId;
    });

    var data = item;
    data.likes = newLikes;

    return $http.post(baseUrl + '/update/' + schemaPosts + '/' + item._id + '/', {
      data: data
    });
  }









        data.updateRowData = function (schema, id, data) {
            return $http.post(baseUrl + '/update/' + schema + '/' + id, {
                data: data
            });
        }
        
        data.deleteRowData = function (schema, id) {
            return $http.post(baseUrl + '/delete/' + schema + '/' + id);
        }
        
        data.addRowData = function (schema, data) {
            //return $http.post(baseUrl + '/add/' + schema + '/', { data });
        }



        return data;
    }]);