ctrlApp
.controller('AppCtrl', function ($scope, $timeout, $interval, $ionicTabsDelegate, $ionicModal, Camera, DataLayer) {
    
    function logger() {
        console.log(arguments);
    }

    $scope.calcDistanceFromUser = function(lat,lon){
        var meters = calcDistance($scope.user.location.lat, $scope.user.location.lng, lat, lon);
        if (meters < 1000){
            return Math.round(meters) + " " + "מטר";
        } else {
            return Math.round(meters/1000) + " " + "ק׳׳מ";
        }
    };


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


    
    $scope.uploadedPhoto = "http://images.delcampe.com/img_large/auction/000/236/913/811_001.jpg";
    $scope.getPhoto = function () {
        Camera.getPicture().then(function (imageURI) {
            console.log(imageURI);
            $scope.uploadedPhoto = imageURI;
        }, function (err) {

        });
    };
    
    $scope.updateItemsDistances = function () {
        _.each($scope.feed, function(f,i){
            f.distance = $scope.calcDistanceFromUser(f.location.lat,f.location.lon);
        });
    }

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
                        logger("address object", results[1]);
                        //set user address
                        $scope.user.location.name = results[1].formatted_address;
                        $scope.$apply();
                        
                        logger($scope.user);
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
        $ionicTabsDelegate.select(index);
    };
    
    $scope.getCurrentTabIndex = function () {
        return $ionicTabsDelegate.selectedIndex();
    };
    

    $scope.init = function(){
        
        $timeout(function () {
        //$scope.selectTabWithIndex(2);
        }, 100);

        $scope.updateUserPosition();

        $interval(function () {
            $scope.updateUserPosition();
            $scope.updateItemsDistances();

        }, 3000);
    };
    $scope.init();
    


    
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
    
    $scope.user = {
        id: "123342",
        name: "Stav Mizrahi",
        location: {},
    }
    
    DataLayer.getFeed().then(function (results) {
        $scope.feed = results.data;
    },function(){
        //onerror
        $scope.feed = feedArray;
    });


    
    
    DataLayer.getAroundMe().then(function (results) {
        $scope.aroundMe = results.data;
    },function(){
        //onerror
        $scope.aroundMe = aroundMeArray;
    });

    $scope.userLike = function (id, collection) {
        for (i = 0; i < collection.length; i++) {
            if (collection[i].id == id) {
                collection[i].likes = collection[i].likes + 1;
            }
        }
    }
    
    $scope.removeLike = function (id, collection) {
        for (i = 0; i < collection.length; i++) {
            if (collection[i].id == id) {
                collection[i].likes = collection[i].likes - 1;
            }
        }
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

    var aroundMeArray = [
       {
           id: "100",
           area: "ירושלים",
           title: "החבצלת ירושלים",
           subtitle: "מרבדים אדומים של כלניות מחכים לכם",
           image: "http://israeltraveler.co.il/static.israeltraveler.co.il/Images/Resource/Sites/%d7%98%d7%99%d7%99%d7%9c%d7%aa-%d7%aa%d7%9c-%d7%90%d7%91%d7%99%d7%91/%d7%98%d7%99%d7%99%d7%9c%d7%aa-%d7%aa%d7%9c-%d7%90%d7%91%d7%99%d7%91_01.jpg",
           phone: "03-5408755",
           address: "קהילת וילנה 43, רמת השרון",
           longText: "קצת טקסט על המקום",
           location: { lat: 31.794049, lon: 35.221242 },
           likes: 45,
           comments: [{
                   user: {
                       id: "39483",
                       name: "Sagi Tsofan",
                       image: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/c2.215.716.716/s320x320/1424536_10153368425090652_1758509919_n.jpg?oh=34ede36eb6f3893473cb2e4b40d94a6b&oe=566B5CF8&__gda__=1453721970_295bc7a13dcabf43cbd835d26b5b4f4c"
                   },
                   title: "sagi comments"
               },
       {
                   user: {
                       id: "123342",
                       name: "Stav Mizrahi",
                       image: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpt1/v/t1.0-1/p80x80/11870683_10156002630375370_8380245281997212676_n.jpg?oh=3ee0204f47867aaa919516fc5904e27b&oe=56755BB7&__gda__=1450548938_51fed40f15ab118f08f9a6d538eacddf"
                   },
                   title: "stav comments"
               }]
       },
       {
           id: "200",
           area: "",
           title: "לונה פארק תל אביב",
           subtitle: "מרבדים אדומים של כלניות מחכים לכם",
           image: "http://israeltraveler.co.il/static.israeltraveler.co.il/Images/Resource/Sites/luna-park/luna-park_01.jpg",
           phone: "03-5408755",
           address: "קהילת וילנה 43, רמת השרון",
           longText: "סלוניקי בישראל רק היום מלא בילויים",
           location: { lat: 31.6677251, lon: 34.5646541 },
           likes: 34,
           comments: []
       },
    ]
    
    
    var feedArray = [
        {
            id: "100",
            area: "ביער שוקדה",
            title: "החבצלת",
            subtitle: "מרבדים אדומים של כלניות מחכים לכם",
            image: "http://blog.tohen-media.com/webfiles/fck/image/maya/darom%20adom/%D7%A6%D7%99%D7%9C%D7%95%D7%9D%20%D7%91%D7%91%D7%99%D7%90%D7%9F%20%D7%A8%D7%A4%D7%99%20(16).jpg",
            phone: "03-5408755",
            address: "קהילת וילנה 43, רמת השרון",
            longText: "קצת טקסט על המקום",
            location: { lat: 32.147214, lon: 34.834704 },
            likes: 120,
            comments: [{
                    user: {
                        id: "39483",
                        name: "Sagi Tsofan",
                        image: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/c2.215.716.716/s320x320/1424536_10153368425090652_1758509919_n.jpg?oh=34ede36eb6f3893473cb2e4b40d94a6b&oe=566B5CF8&__gda__=1453721970_295bc7a13dcabf43cbd835d26b5b4f4c"
                    },
                    title: "sagi comments"
                },
        {
                    user: {
                        id: "123342",
                        name: "Stav Mizrahi",
                        image: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpt1/v/t1.0-1/p80x80/11870683_10156002630375370_8380245281997212676_n.jpg?oh=3ee0204f47867aaa919516fc5904e27b&oe=56755BB7&__gda__=1450548938_51fed40f15ab118f08f9a6d538eacddf"
                    },
                    title: "stav comments"
                }]
        },
        {
            id: "200",
            area: "",
            title: "חגיגה יוונית ביפו",
            subtitle: "מרבדים אדומים של כלניות מחכים לכם",
            image: "http://shezaf.net/images/stories/guide/yafo-_namal_zahov.jpg",
            phone: "03-5408755",
            address: "קהילת וילנה 43, רמת השרון",
            longText: "סלוניקי בישראל רק היום מלא בילויים",
            location: { lat: 31.6677251, lon: 34.5646541 },
            likes: 120,
            comments: []
        },
    ]
    
    

})