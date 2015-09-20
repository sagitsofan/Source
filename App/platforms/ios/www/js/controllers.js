ctrlApp
.directive('post', function() {
  return {
    templateUrl: 'templates/post.html'
  };
})
.controller('AppCtrl', function ($scope, $window, $timeout, $interval, $ionicTabsDelegate, $ionicModal, Camera, DataLayer, ngFB, $localstorage) {
    $scope.items = [];

    function logger() {
      //console.log(new Date().getTime(),$scope.user)
      console.log(arguments);
    }

    $scope.calcDistanceFromUser = function(lat,lon,shouldAddFormat){
      if (typeof shouldAddFormat === "undefined"){
        shouldAddFormat = true;
      }

      if ($scope.user.location == null){
        return null;
      }

      var meters = calcDistance($scope.user.location.lat, $scope.user.location.lng, lat, lon);

      if (!shouldAddFormat){
        return Math.round(meters);
      }

      if (meters < 1000){
          return Math.round(meters) + " " + "מטר";
      } else {
          return Math.round(meters/1000) + " " + "ק׳׳מ";
      }
    };

    $scope.getFacebookImage = function(userId,qs){
      var queryString = qs || "";
      return "http://graph.facebook.com/"+userId+"/picture" + queryString;
    }

    var rad = function(x) {
      return x * Math.PI / 180;
    };

    function calcDistance(lat1, lon1, lat2, lon2){
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(lat2 - lat1);
        var dLong = rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    }

     $scope.navigateTo = function navigate(lat, lng) {
      // If it's an iPhone..
      if ((navigator.platform.indexOf("iPhone") !== -1) || (navigator.platform.indexOf("iPod") !== -1)) {
        function iOSversion() {
          if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
          }
        }
        var ver = iOSversion() || [0];

        if (ver[0] >= 6) {
          protocol = 'maps://';
        } else {
          protocol = 'http://';

        }
        window.location = protocol + 'maps.apple.com/maps?daddr=' + lat + ',' + lng + '&amp;ll=';
      }
      else if (ionic.Platform.isAndroid()) {
        window.location = "http://www.israeltraveler.co.il";
      } else {
        window.open('http://maps.google.com?daddr=' + lat + ',' + lng + '&amp;ll=');
      }
    }


    
    $scope.uploadedPhoto = "http://images.delcampe.com/img_large/auction/000/236/913/811_001.jpg";
    $scope.getPhoto = function () {
        Camera.getPicture().then(function (imageURI) {
            logger(imageURI);
            $scope.uploadedPhoto = imageURI;
        }, function (err) {

        });
    };
    
    // $scope.updateItemsDistances = function () {
    //     _.each($scope.feed, function(f,i){
    //         f.distance = $scope.calcDistanceFromUser(f.location.lat,f.location.lon);
    //     });
    // }

    $scope.updateUserPosition = function () {
        logger("looking for location...");
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            logger("found lat-lng: " + pos);
            var geocoder = new google.maps.Geocoder;
            var geoLatLng = {
                location: {
                    lat: parseFloat(position.coords.latitude),
                    lng: parseFloat(position.coords.longitude)
                }
            };
            
            // set user location
            $scope.user.location = geoLatLng.location;
            
            geocoder.geocode(geoLatLng, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        logger("translte lat-lng to address", results[1].formatted_address);
                        //set user address
                        $scope.user.location.name = results[1].formatted_address;
                        $scope.aroundMe = $scope.getAroundMe();
                        $scope.$apply();
                    } else {
                        logger('No results found');
                    }
                } else {
                    logger('Geocoder failed due to: ' + status);
                }
            });
        });
    };
    
    
    $scope.selectTabWithIndex = function (index) {
        //$ionicTabsDelegate.$getByHandle('myTabs').select(index);
        $ionicTabsDelegate.select(index);
    };
    
    $scope.getCurrentTabIndex = function () {
        return $ionicTabsDelegate.selectedIndex();
    };
    

  


    $ionicModal.fromTemplateUrl('templates/login-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalLogin = modal;
    });

    $scope.openLoginModal = function (itemId) {
        $scope.modalLogin.show();
    };
    $scope.closeLoginModal = function () {
        $scope.modalLogin.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modalLogin.remove();
    });

    $scope.fbLogin = function () {
      ngFB.login({scope: 'email,publish_actions'}).then(
        function (response) {
            if (response.status === 'connected') {
                logger('Facebook login succeeded',response);
                $scope.user.isLoggedIn = true;
                $scope.user.fbAccessToken = response.authResponse.accessToken;
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id,name,age_range,birthday,email,first_name,last_name,gender,link,location,locale,timezone,cover,about,address,bio,context,currency,devices,education,favorite_athletes,favorite_teams,hometown,inspirational_people,install_type,installed,interested_in,is_shared_login,is_verified,languages,meeting_for,name_format,payment_pricepoints,test_group,political,relationship_status,religion,security_settings,significant_other,sports,quotes,third_party_id,updated_time,shared_login_upgrade_required_by,verified,video_upload_limits,viewer_can_send_gift,website,work,public_key'}
                }).then(
                    function (user) {
                      logger(JSON.stringify(user));

                      $localstorage.setObject('facebookUser', user);
                      $scope.user.name = user.name;
                      $scope.user.facebook = user;
                      $scope.signUpUser();
                      $scope.closeLoginModal();
                    },
                    function (error) {
                        alert('Facebook error: ' + error.error_description);
                    });
            } else {
                alert('Facebook login failed');
            }
        });
    };

    $scope.signUpUser = function(){
      logger("should check if user exist, if not add it to db",$scope.user.facebook);
    };

    $scope.share = function (postId) {
      //TODO: add post title, image etc. to share
      ngFB.api({
          method: 'POST',
          path: '/me/feed',
          params: {
              message: "I will be attending: by me"
          }
      }).then(
          function () {
              alert('The session was shared on Facebook');
          },
          function () {
              alert('An error occurred while sharing this session on Facebook');
          });
    };



    
    $ionicModal.fromTemplateUrl('templates/post-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.postItem = null;
    $scope.openModal = function (itemId) {
        $scope.postItem = $scope.getItem(itemId);
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
        $scope.postItem = null;
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });





    $scope.sendComment = function(postId, commentText,item){
      DataLayer.addComment(item, $scope.user.facebook.id, $scope.user.name, commentText).then(function (results) {
        console.log(results);
      },function(){
        //onerror
        console.log("kaki");
      });
      logger(postId, commentText);
    }

    $scope.userLike = function (id) {
        for (i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].id == id) {
                $scope.items[i].likes = $scope.items[i].likes + 1;
            }
        }
    }
    
    $scope.removeLike = function (id) {
        for (i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].id == id) {
                $scope.items[i].likes = $scope.items[i].likes - 1;
            }
        }
    }

    $scope.getItem = function (id) {
        for (i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].id == id) {
                console.log(id);
                return $scope.items[i];
            }
        }
    }
    $scope.getWindowHeight = function(){
      return $window.innerHeight;
    }


    $scope.getImagesFormat = function(){
      var ret = [];
      if (typeof arr == "undefined"){
        return ret;
      }
      for (i = 0; i < $scope.postItem.images.length; i++) {
        ret.push({
          "src":$scope.postItem.images[i]
        });
      }

      return ret;
    }

    //dev data
    //----------------------
    //----------------------
    //----------------------
    $scope.destinations = [
        {
            id:1,
            name:"חיפה"
        },
        {
            id:2,
            name:"ירושלים"
        },
        {
            id:3,
            name:"תל אביב"
        },
        {
            id:4,
            name:"טבריה"
        },
        {
            id:5,
            name:"גליל"
        }
    ];
    $scope.searchTypes = [
        {
            id:1,
            name:"מסעדות"
        },
        {
            id:2,
            name:"מלונות"
        },
        {
            id:3,
            name:"ספא"
        },
        {
            id:4,
            name:"צימרים"
        },
        {
            id:5,
            name:"פעילות לילדים"
        }
    ];

    $scope.hasValue = function(str){
      if (str && typeof str != "undefined" && str != undefined && str != null && str != ""){
        return true
      } else {
        return false;
      }

    }

    $scope.search = function(q){
      if (!$scope.hasValue(q)){
        return;
      }
      if (q.length < 3){
        return;
      }

      logger("searching..." , q);
      var ret = [];
      _.each($scope.feed, function(item,i){
        if (item.title.indexOf(q) > -1){
          ret.push(item);
          return true;
        }

        if (item.subtitle.indexOf(q) > -1){
          ret.push(item);
          return true;
        }

      });
      return ret;
    }


    $scope.getFeed = function(){
      return $scope.items;
    }


    $scope.getAroundMe = function(){
      var searchRadius = 10000;
      var ret = [];

      _.each($scope.items, function(item, i){
        var itemDistance = $scope.calcDistanceFromUser(item.location.lat,item.location.lon,false);
        if (itemDistance != null && itemDistance < searchRadius){
          ret.push(item);
        }
      });
      logger("find around me:",ret)
      return ret;
    }

    $scope.updateItems = function(){
      DataLayer.getItems().then(function (results) {
          $scope.items = results.data;

          $scope.feed = $scope.getFeed();
          $scope.aroundMe = $scope.getAroundMe();

          //do something with the data
        },function(){
          //onerror
        });
    }

    $scope.init = function(){
      logger("init");

      $scope.user = {
          isLoggedIn:false,
          id: null,
          name: null,
          location: null,
      }
      $scope.updateUserPosition();
      logger("updateUserPosition",$scope.user);
      $scope.updateItems();


      $timeout(function () {
        if ($localstorage.getObject('facebookUser').id != undefined){
          $scope.user.facebook = $localstorage.getObject('facebookUser')
          $scope.user.name = $scope.user.facebook.name;
          $scope.user.isLoggedIn = true;
        } else {
          $scope.openLoginModal();
        }
        $scope.selectTabWithIndex(2);



      //add data      
      // var addData = {
      //   "x":"y"
      // }

      // DataLayer.addRowData("feed", addData).then(function (results) {
      //   //console.log(results);
      //   console.log("yes!");
      // },function(){
      // //onerror
      //   console.log("kaki");
      // });



      }, 100);

      $interval(function () {
        $scope.updateUserPosition();
        logger("updateUserPosition",$scope.user);

        //$scope.updateItems();

      }, 15000);

    };
    $scope.init();

})