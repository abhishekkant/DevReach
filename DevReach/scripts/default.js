// JavaScript Document
'use strict';

var everliveKey = 'DJOOCpPmPJe2fJ8s';
var GoogleProjectID = '541570376695';
var app;
var dateData = [{"dateTitle":"Day 1", "dateValue":"8/24/2013"}, 
    {"dateTitle":"Day 2", "dateValue":"8/25/2013"}, 
    {"dateTitle":"Day 3", "dateValue":"8/26/2013"}
];


var dateDS = new kendo.data.DataSource({
    data: dateData 
});

function dayshow()
{
    console.log("dayshow");
    dateDS.fetch();
    console.log(dateDS);
    
}

// PhoneGap is ready
function onDeviceReady() {
     $('#ratingSession').ratings(5).bind('ratingchanged', function (event, data) {
        $('#ratingSession-rating').text(data.rating);
    });
       $('#ratingSpeaker').ratings(5).bind('ratingchanged', function (event, data) {
        $('#ratingSpeaker-rating').text(data.rating);
    });
    app = new kendo.mobile.Application(document.body, 
            { transition: "slide", layout: "mobile-tabstrip",initial:"home" });

     initializeNotification();
    
}

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

var speakerDetailsData;
var baseURL = "http://pugdevconservice.telerikindia.com/EventNetworkingService.svc";
var c;
var dataReadFromLocalStorage;    



var tweets = new kendo.data.DataSource(
    {

    transport: {
            read: {
            url: "https://api.twitter.com/1.1/search/tweets.json",
            contentType: "application/json; charset=utf-8",
            type: "GET",
            dataType: "jsonp",
            data: {
                    q: "PUGDevCon"
                }
        }
        },
    schema: {
            data: "results",
            total: "results_per_page"
        }

});

function showTweets(e) {    
    //tweets.fetch();
    //var template1 = kendo.template($("#tweetTemplate").text());
    //$("#tweetList").kendoMobileListView({
    //	dataSource: tweets,
    //	template:template1
    //});
}

var PUGEverliveDS = new kendo.data.DataSource({
     type: 'everlive',
    transport: {
        typeName: 'SessionRatingsbyUser'
    },
    schema: {
        model: { id: Everlive.idField }
    },
});





function getSpeakers(e)
{
    
    var speakerData;
    if (localStorage.speakers) {
        console.log("In LS");
        speakerData = new kendo.data.DataSource({
            data: JSON.parse(localStorage.speakers)
        });
        
    }
    else {
        console.log("In LIve section");
        speakerData = new kendo.data.DataSource(
            {
            type: "odata",
                change: function(e) {
                        // to retrieve the data from the datasource and save it to the local storage
                      
                        saveDataLocally1('speakers', this.data());
                    },
            transport: {
                    cache: "inmemory",
                    
                    read: {
                    // the remote service url

                    url: baseURL + "/SessionAttendees?$expand=UserProfile,UserProfile/UserURLs&$filter=AttendeeType eq 11&$select=AttendeeType,UserProfile/UserId,UserProfile/FirstName,UserProfile/LastName,UserProfile/Comments,UserProfile/UserURLs/URL",
                    dataType: "jsonp",

                    data: {
                            Accept: "application/json"
                        }
                }
                },
            sort: { field: "UserProfile.FirstName", dir: "asc" },  
            serverSorting: true,
            serverfiltering: true,  
            batch: false
        });
    }
    
    
    speakerData.fetch();
   
    
    var speakersListTemplate = kendo.template($("#speakersTemplate").html());
    
        var listviewTD = $("#speakersView").data("kendoMobileListView");
    if(listviewTD)
    {
    listviewTD.destroy();
        }
    $("#speakersView").kendoMobileListView({
        dataSource: speakerData,
        template:speakersListTemplate,
        style:"inset"
               
    }); 
   
}




function getSessionsBySpeakers(e)
{
    
    var speakerData;
    if (localStorage.speakers) {
        console.log("In LS");
        speakerData = new kendo.data.DataSource({
            data: JSON.parse(localStorage.speakers)
        });
        
    }
    else {
        console.log("In Live section");
        speakerData = new kendo.data.DataSource(
            {
            type: "odata",
                change: function(e) {
                        // to retrieve the data from the datasource and save it to the local storage
                      
                        saveDataLocally1('speakers', this.data());
                    },
            transport: {
                    cache: "inmemory",
                    
                    read: {
                    // the remote service url

                    url: baseURL + "/SessionAttendees?$expand=UserProfile,UserProfile/UserURLs&$filter=AttendeeType eq 11&$select=AttendeeType,UserProfile/UserId,UserProfile/FirstName,UserProfile/LastName,UserProfile/Comments,UserProfile/UserURLs/URL",
                    dataType: "jsonp",

                    data: {
                            Accept: "application/json"
                        }
                }
                },
            sort: { field: "UserProfile.FirstName", dir: "asc" },  
            serverSorting: true,
            serverfiltering: true,  
            batch: false
        });
    }
    
    
    speakerData.fetch();
   
    
    var speakersListTemplate4Session = kendo.template($("#speakersbySessionTemplate").html());
    var listviewTD = $("#speakersViewforSession").data("kendoMobileListView");
    if (listviewTD)
    {
        listviewTD.destroy();
    }
    $("#speakersViewforSession").kendoMobileListView({
        dataSource: speakerData,
        template:speakersListTemplate4Session,
        style:"inset",
        click: "displaysessionsbyspeaker"
               
    }); 
    
    
}






function showMe(e) {
    if (localStorage.myagenda) {
        dataReadFromLocalStorage = JSON.parse(localStorage["myagenda"]);
    }
    var myAgendaData = new kendo.data.DataSource(
        {
                   
        data : dataReadFromLocalStorage
                            
    });
    
    if (myAgendaData != null) {
        myAgendaData.fetch(); 
    }
   
    var template1 = kendo.template($("#filteredSessionsTemplate").text());
    $("#myAgendaSessionView").kendoMobileListView({
        dataSource: myAgendaData,
        template:template1,
        style:"inset"
    });
}

//=======================Speaker Detail function=======================//
function speakerDetailsShow(e) {

    var item;
    var view = e.view;
    var uid = e.view.params.uid;
    var template = kendo.template($("#speakerDetailsTemplate").text());
    speakerDetailsData = new kendo.data.DataSource(
        {
        type: "odata",
        transport: {
                cache: "inmemory",
                read: {
                // the remote service url

                url: baseURL + "/UserProfiles?$expand=City,Country,Company,Designation,UserURLs&$filter=Active eq true and UserId eq " + uid,
                dataType: "jsonp",

                data: {
                        Accept: "application/json"
                    }
            }
            },
        serverfiltering: true,
        serverPaging: true,
        pageSize: 10,
        batch: false,
        error: function() {
            console.log(arguments);
        }
    });

    
    speakerDetailsData.fetch(function() {
        item = speakerDetailsData.at(0);
        view.scrollerContent.html(template(item));
        kendo.mobile.init(view.content);
    });
}

function tracksListViewClick(e) {

    var sessionsByTracksData = new kendo.data.DataSource(
        {
        type: "odata",
        transport: {
                cache: "inmemory",
                read: {
                // the remote service url

                url: baseURL + "/SessionInTracks?$expand=Session,Session/SessionTimeSlot&$filter=TrackID eq " + e.dataItem.SessionTrackID + "&$orderby=Session/SessionTimeSlot/FromTime",
                dataType: "jsonp",

                data: {
                        Accept: "application/json"
                    }
            }
            },
        serverfiltering: true,
        serverPaging: true,
        pageSize: 30,
        batch: false,
        error: function() {
            console.log(arguments);
        }
    });
    //sessionsByTracksData.fetch();
    var template1 = kendo.template($("#filteredSessionsTemplate").html());
     var listview = $("#sessioninTrackList").data("kendoMobileListView");
    if(listview)listview.destroy();
    $("#sessioninTrackList").kendoMobileListView({
        dataSource: sessionsByTracksData,
        template:template1,
        style:"inset"
        
    });
}

function displaysessionsbyspeaker(e) {
    var speakerId = e.dataItem.UserProfile.UserId;
    
    var sessionsOfSpeakers = new kendo.data.DataSource(
        {
        type: "odata",
        transport: {
                cache: "inmemory",
                read: {
                // the remote service url

                url: baseURL + "/SessionAttendees?$expand=UserProfile,Session,Session/SessionTimeSlot,UserProfile/UserURLs&$filter=UserProfile/UserId eq " + speakerId + " &$select=Session/SessionID,UserProfile/UserId,UserProfile/FirstName,UserProfile/UserURLs/URL,Session,Session/SessionTimeSlot/FromTime&$orderby=Session/SessionTimeSlot/FromTime",
                dataType: "jsonp",

                data: {
                        Accept: "application/json"
                    }
            }
            },
        serverfiltering: true,
        serverPaging: true,
        pageSize: 10,
            page: 1,
        endlessScroll: true,
        batch: false,
        error: function() {
            console.log(arguments);
        }
    });
   // sessionsOfSpeakers.fetch();
    var template1 = kendo.template($("#filteredSessionsTemplate").html());
    $("#sessionsOfSpeakerList").kendoMobileListView({
        dataSource: sessionsOfSpeakers,
        template:template1,
        style:"inset",   
    });
}

function venueListViewClick(e) {
    
    console.log("venue clicked");
    var sessionsByVenueData = new kendo.data.DataSource(
        {
        type: "odata",
           
        transport: {
                cache: "inmemory",
                read: {
                // the remote service url

                url: baseURL + "/SessionVenues?$expand=Session,Session/SessionTimeSlot&$filter=VenueID eq " + e.dataItem.VenueID,
                dataType: "jsonp",

                data: {
                        Accept: "application/json"
                    }
            }
            },
        serverfiltering: true,
        serverPaging: true,
        pageSize: 20,
            page: 1,
        batch: false,
        error: function() {
            console.log(arguments)
        }
    });
 //sessionsByVenueData.fetch();
    var template1 = kendo.template($("#filteredSessionsTemplate").text());
    var vlistview = $("#sessioninVenueList").data("kendoMobileListView");
    if(vlistview) vlistview.destroy();
    $("#sessioninVenueList").kendoMobileListView({
        dataSource: sessionsByVenueData,
        template:template1,
        style:"inset",
   loadMore:true
    });
}




/*function getTimingData()
{
    var timingTemplate = new kendo.template($("#timingListtemplate").text());
    $("#timingListView").kendoMobileListView({
        dataSource: timingData,
        style:"inset",
        template: timingTemplate,
        headerTemplate: "<h2>${value}</h2>"
    });
}*/

// function to retrieve sessions for a specific date 

function sessionTimeClick(e) {
    
    var selectedDate = new Date(e.view.params.selDate);
    var selDay = selectedDate.getDate();
    var selMonth = selectedDate.getMonth() + 1;
    var selYear = selectedDate.getFullYear();
    
   var sessionTimeDS = new kendo.data.DataSource({
    type:"odata",
    transport: {
        read: {
            url: baseURL + "/Sessions?$expand=SessionTimeSlot&$filter=day(SessionTimeSlot/FromTime) eq " + selDay + " and month(SessionTimeSlot/FromTime) eq " + selMonth + " and year(SessionTimeSlot/FromTime) eq " + selYear,
            dataType: "jsonp"
        },
         data: {
                    Accept: "application/json"
                }
    }
});
    
    console.log("hi");
    sessionTimeDS.fetch();
    console.log(sessionTimeDS);
    console.log("hello");
   
    var sessionTimeListtemplate = kendo.template($("#sessionTimeListtemplate").html());
    $("#sessionListView").kendoMobileListView({
        dataSource: sessionTimeDS,
        template: sessionTimeListtemplate,
        style:"inset"
    });
    
    
    
}

               
                





var timingData =  new kendo.data.DataSource(
{
   type: "odata",
    transport: {
        read: {
            url: baseURL + "/SessionTimeSlots?$orderby=FromTime",
            dataType: "jsonp"
            },
         data: {
                    Accept: "application/json"
                }
        },
    schema: {
        
        data: function(data) {
                            return data;
                        },
                        total: function(data) {
                            return data['odata.count'];

                        },
        
        parse: function(response) {
      var products = [];
      for (var i = 0; i < response.d.results.length; i++) {
        var product = {
          FromTime: response.d.results[i].FromTime,
          Durationinmins:   response.d.results[i]. Durationinmins,
          starttime: kendo.toString(new Date(new Date(parseInt(response.d.results[i].FromTime.replace("/Date(", "").replace(")/",""),10))),"d") 
        };
        products.push(product);
      }
      return products;
    },
        model: {
            fields: {
                starttime:{type: "datetime"},
                FromTime: {type: "datetime"},
                Durationinmins: {type: "number"}
            }
        }
    },

    group: {field:"starttime"}
});



function tracksShow(){
    var trackData;
      if (localStorage.tracks) {
        trackData = new kendo.data.DataSource({
            data: JSON.parse(localStorage.tracks)
        });
        trackData.fetch();
    }
    else {
        
        trackData = new kendo.data.DataSource(
    {
    type: "odata",
        change: function(e) {
                                    // to retrieve the data from the datasource and save it to the local storage
                                     console.log('change');
                                     saveDataLocally1('tracks',this.data());
                                },
    transport: {
            cache: "inmemory",
            read: {
            // the remote service url

            url: baseURL + "/SessionTracks",
            dataType: "jsonp",

            data: {
                    Accept: "application/json"
                }
        }
                        
                    
        },
        sort: { field: "SessionTrackName", dir: "asc" },
        serverSorting: true,
    serverfiltering: true,
    serverPaging: true,
    pageSize: 10,
    batch: false
});
    }
    
    var trackTemplate = kendo.template($("#trackTemplate").html());
    
    var listviewTD = $("#trackList").data("kendoMobileListView");
    if (listviewTD)
    {
        listviewTD.destroy();
    }
        
    $("#trackList").kendoMobileListView({
            dataSource: trackData,
            template:trackTemplate,
            style:"inset",
            click : tracksListViewClick
            
               
        });   
    
}

function venueListClick() {
    var venueData;
    
    if (localStorage.venues) {
        venueData = new kendo.data.DataSource({
            data: JSON.parse(localStorage.venues)
        });
        venueData.fetch();
    }
    else {
        venueData = new kendo.data.DataSource(
            {
            type: "odata",
       change: function(e) {
                                    // to retrieve the data from the datasource and save it to the local storage
                                     console.log('change');
                                     saveDataLocally1('venues',this.data());
                                },
            transport: {
                    cache: "inmemory",
                    read: {
                    // the remote service url

                    url: baseURL + "/Venues",
                    dataType: "jsonp",

                    data: {
                            Accept: "application/json"
                        }
                }
                        
                    
                },
            sort: { field: "VenueName", dir: "asc" },
            serverSorting: true,
            serverfiltering: true,
            serverPaging: true,
            pageSize: 10,
            batch: false
        });
    }
    
    
    var listviewTD = $("#venueList").data("kendoMobileListView");
    if (listviewTD)
    {
        listviewTD.destroy();
    }
     var venueTemplate = kendo.template($("#venueTemplate").html());
        
    $("#venueList").kendoMobileListView({
            dataSource: venueData,
            template:venueTemplate,
            style:"inset",
            click : venueListViewClick
            
               
        }); 
    
    
    
}





function getAllSessions() {
    var allSessionData;
    if (localStorage.allSessionData)
    {
        console.log('reading from LS');
  
    //  var savedSessionData = readDataFromLocalStorage('allSessionData');
        allSessionData = new kendo.data.DataSource(
          {   
              data:JSON.parse(localStorage.allSessionData)           
          });
        
        allSessionData.fetch();
              
             
      //  var template113 = kendo.template($("#sessionsTemplate").html());
        
      /*  $("#sessionsView").kendoMobileListView({
            dataSource: allSessionData1,
            template:template113,
            style:"inset",
            endlessScroll:true
   
        }); */ 
        
    }
    else
    {
        console.log('reading from Live');

                        allSessionData = new kendo.data.DataSource(
                        {
                        type: "odata",
                        change: function(e) {
                                    // to retrieve the data from the datasource and save it to the local storage
                                     console.log('change');
                                     saveDataLocally1('allSessionData',this.data());
                                },
                        transport: {
                                cache: "inmemory",
                                read: {
                    
                                url: baseURL + "/SessionAttendees?$expand=UserProfile,Session,Session/SessionTimeSlot,UserProfile/UserURLs&$filter=AttendeeType eq 11&$select=Session/SessionID,UserProfile/UserId,UserProfile/FirstName,UserProfile/UserURLs/URL,Session&$orderby=Session/SessionTimeSlot/FromTime",
                                dataType: "jsonp",
                    
                                data: {
                                        Accept: "application/json"
                                       }
                                
                                   }
                                 },
                            
                        serverfiltering: false,
                        serverPaging: true,
                        batch: false,
                        pageSize: 40,
                                   
                                              
                            
                    });

                       /* allSessionData.fetch(function(){
                            var data = allSessionData.view().length;
                            console.log(data);
                            var datas =  allSessionData.data();
                            console.log(datas);
                            saveDataLocally1('allSessionData',datas);
                        }) */
        
     /*   var template2 = kendo.template($("#sessionsTemplate").html());
        $("#sessionsView").kendoMobileListView({
            dataSource: allSessionData,
            template:template2,
            style:"inset",
            endlessScroll:true
               
        });  */
        
       }

    
var listviewTD = $("#sessionsView").data("kendoMobileListView");
    if (listviewTD)
    {
        listviewTD.destroy();
    }
       var allsessiontemplate = kendo.template($("#sessionsTemplate").html());
        $("#sessionsView").kendoMobileListView({
            dataSource: allSessionData,
            template:allsessiontemplate,
            style:"inset"
               
        });  
};

function getMyAgendaData(e) {
    if (myAgendaData != null) {
        myAgendaData.read(); 
    }
}

var fsaveDataLocally = function saveDataLocally(e) {   
    var item;
    console.log("this is saving data in local storage"); 
    sessionDetailsData.fetch(function() {
        item = sessionDetailsData.at(0);  
          
        if (!localStorage.myagenda) 
            localStorage.myagenda = JSON.stringify([]);
          
        var myagenda = JSON.parse(localStorage["myagenda"]);
        if (contains(myagenda, item)) {
            console.log("I am IF");
        }
        else {

            myagenda.push(item);    
            localStorage["myagenda"] = JSON.stringify(myagenda);
            $("#saveButton").find(".km-icon").removeClass("km-add").addClass("km-trash");
            $('#saveButton').unbind('click', fsaveDataLocally);   
            $('#saveButton').bind('click', fremoveDataLocally);     

        }       
    });     
}

var fremoveDataLocally = function removeDataLocally(e) {
    console.log("this is removing data from local storage");
    sessionDetailsData.fetch(function() {
        var myagenda = JSON.parse(localStorage["myagenda"]);
        var index = 0;
        var i = 0;
        i = myagenda.length;
        
        for (var _obj in myagenda) {
            i++;
        }

        var item = sessionDetailsData.at(0);  
        
        for (var iq = 0;iq < i ; iq ++) {
            if (myagenda[iq].Session.SessionID===item.Session.SessionID) {
                break;
            }
            index ++;
        }      
                  
        myagenda.splice(index, 1);
        localStorage["myagenda"] = JSON.stringify(myagenda); 
        $("#saveButton").find(".km-icon").removeClass("km-trash").addClass("km-add");
        $('#saveButton').unbind('click', fremoveDataLocally);  
        $('#saveButton').bind('click', fsaveDataLocally); 

    });
    
}



//=======================Speaker Detail function=======================//
var sessionDetailsData;
function sessionDetailsShow(e) {
    console.log("In Session Details");
    var view = e.view;
    var item;
           
    var urlToFetchSessionDetail = baseURL + "/SessionAttendees?$expand=UserProfile,Session,Session/SessionTimeSlot,UserProfile/UserURLs&$filter=AttendeeType eq 11 and SessionID eq " + e.view.params.sid + " &$select=Session/SessionID,UserProfile/UserId,UserProfile/FirstName,UserProfile/LastName,UserProfile/UserURLs/URL,UserProfile/UserURLs/SNTypeID,Session";

    var template = kendo.template($("#sessionDetailsTemplate").text());
           
    sessionDetailsData = new kendo.data.DataSource(
        {
        type: "odata",
        transport: {
                cache: "inmemory",
                read: {

                url:  urlToFetchSessionDetail,
                dataType: "jsonp",
                data: {
                        Accept: "application/json"
                    }
            }
            },
        serverfiltering: true,
        serverPaging: true,
        pageSize: 1,
        batch: false,
        error: function(e) {
            console.log(e);
        }
    });

    sessionDetailsData.fetch(function() {
        item = sessionDetailsData.at(0);
         
        view.scrollerContent.html(template(item));
        kendo.mobile.init(view.content);
            
        if (localStorage.myagenda) { 
            var myagenda = JSON.parse(localStorage["myagenda"]);
            //var i = myagenda.length;                           
                        
            if (contains(myagenda, item)) {
                $("#saveButton").find(".km-icon").removeClass("km-add").addClass("km-trash");
                $('#saveButton').unbind('click', fsaveDataLocally);   
                $('#saveButton').bind('click', fremoveDataLocally);    
            }
            else {
                $("#saveButton").find(".km-icon").removeClass("km-trash").addClass("km-add");
                $('#saveButton').unbind('click', fremoveDataLocally); 
                $('#saveButton').bind('click', fsaveDataLocally); 
            }
        }
        else {
            $("#saveButton").find(".km-icon").removeClass("km-trash").addClass("km-add");
            $('#saveButton').unbind('click', fremoveDataLocally); 
            $('#saveButton').bind('click', fsaveDataLocally); 
        }
    });
}

function functionToShareOnFacebook(e) {
    var item;
    var sName;
    speakerDetailsData.fetch(function() {
        item = speakerDetailsData.at(0);
           
        var sFName = item.FirstName; 
        var sLName = item.LastName;
        sName = "I am going to attend session of" + sFName + sLName + "in Delhi Technology Forum event" ;
        // view.scrollerContent.html(template(item));
        // kendo.mobile.init(view.content);
    });

    FB.ui(
        {
        method: 'feed',
        name: 'DebugmodeEventPlans',
        link: 'http://localhost:1461/DevReach.html',
        // source: 'http://www.youtube.com/watch?v=eFjjO_lhf9c',
        //picture: 'http://debugmode.net/dj.jpg',
        caption: sName,
        description: sName,
        message: ''
    });
}

function functionToShareOnTwitter(e) {
    console.log("share on Twitter");
}

function functionToShareOnLinkedin(e) {
    console.log("share on Linkedin");
}


function readDataFromLocalStorage(e) {
    var datasaved = JSON.parse(localStorage["myagenda"]);
}

function contains(a, obj) {
    var i = a.length;
    
    while (i--) {
        if (a[i].Session.SessionID === obj.Session.SessionID) {
            return true;
        }
    }
    return false;
}


function savePersonalDetailsfn() {
    var personalDetails = new Array();
    var obj = {'name': $('#name').val()};
    personalDetails.push(obj);
    var obj1 = {'email':$('#email').val() };
    personalDetails.push(obj1);
    var obj2 = {'isAnonymous': $('#isAnonymous').data("kendoMobileSwitch").check()}
    personalDetails.push(obj2);
    localStorage['myDetails'] = JSON.stringify(personalDetails);
}

function checkPersonalSettings() {
    if (localStorage['myDetails']) {
        var personalDetails = JSON.parse(localStorage['myDetails']);
         
        $('#name').val(personalDetails[0].name);
        $('#email').val(personalDetails[1].email);
        $('#isAnonymous').data("kendoMobileSwitch").check(personalDetails[2].isAnonymous);
        $('#savePersonalDetails').text('Update');
    }
}


//Show the review view
function setUpReviewView(e)
{
    $("#sessionID").html(e.view.params.sid);
}

// Save review to local storage
function submitReview(e) {
   
    var item = {'Comment': $("#txtReview").val(),'SessionRating':$("#ratingSession-rating").text(), 'SpeakerRating':$("#ratingSpeaker-rating").text(),'SessionID': $('#sessionID').text()};
    
    if (!localStorage.myReview) {
        localStorage.myReview = JSON.stringify([]);
    }
    
    // Add personal details to the ratings
    if (localStorage['myDetails']) {
        var personalDetails = JSON.parse(localStorage['myDetails']);
        item.name = personalDetails[0].name;
        item.email = personalDetails[1].email;
        
    }
    
    var myreview = JSON.parse(localStorage.myReview);          
    myreview.push(item);    
    localStorage["myReview"] = JSON.stringify(myreview); 
    $("#modalview-reviewsaved").data("kendoMobileModalView").open();
}


function submitRatingsEverlive(e) {
    if (localStorage.myReview)
    {
        
        var data = Everlive.$.data('SessionRatingsbyUser');
        
        //PUGEverliveDS.fetch();
        console.log('Filled PUG DS');
        var myreviewLS = JSON.parse(localStorage["myReview"]);
        data.create(myreviewLS);
        console.log('Now Deleting');
        localStorage.removeItem("myReview");
        console.log('Deleted');
       /*$.each(myreviewLS, function(i,objval) {
            console.log(objval);
            var newReview = objval;
            PUGEverliveDS.add(newReview);
        });
         console.log('Sending Data');
        PUGEverliveDS.sync();
         console.log('Data Sent');*/
    }
    else
    {
        console.log('No LS data found');
    }
}

// ================================================================================================//
// =======================================Geolocation Operations===================================//
// ================================================================================================//

// ================================================================================================//

var map, sourcePoint, destionationPoint, directionsDisplay, locId,
directionsService = new google.maps.DirectionsService(); 

function showMap() {
    locId = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, { enableHighAccuracy: true });
}

function hideMap() {
    navigator.geolocation.clearWatch(locId);
}

var destinationPoint;

function initMap() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    
    var mapOptions = {
        sensor: true,
        center: new google.maps.LatLng(28.547222200000000000, 77.250833300000070000),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
    };

    map = new google.maps.Map($("#map_canvas")[0], mapOptions);

    destinationPoint = new google.maps.Marker({
        position: new google.maps.LatLng(18.533979,73.829921),
        color: "green",
        map: map, 
        title: "that Conference"
    });
    
    sourcePoint = new google.maps.Marker({
        color: "red", 
        map: map,
        title:"You"
    });

    directionsDisplay.setMap(map);
}

function onGeolocationSuccess(position) {
    sourcePoint.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var request = {
        origin: sourcePoint.position, 
        destination: destinationPoint.position,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });
}

// onGeolocationError Callback receives a PositionError object
function onGeolocationError(error) {
    //$("#myLocation").html("<span class='err'>" + error.message + "</span>");
}

// Code for implementing Notification 
function initializeNotification() {
    var el = new Everlive(everliveKey);
    
    //el.push.currentDevice().getRegistration(successCallback, function() {alert("Registering the device.");currentDevice = el.push.currentDevice();});
    var onAndroidPushReceived = function(args) {
        alert('Event Notification: ' + JSON.stringify(args.message)); 
    };

    var pushSettings = {
        iOS:{
            badge: true,
            sound: true,
            alert: true
        },
        android:{
            senderID: GoogleProjectID
        },
        
        notificationCallbackAndroid: onAndroidPushReceived
    };
       var emulatorMode = false;
    var currentDevice = el.push.currentDevice(emulatorMode);
    
    
    currentDevice.enableNotifications(pushSettings)
    .then(
        function(initResult) {
            // $("#tokenLink").attr('href', 'mailto:dhananjay.25july@gmail.com?subject=Push Token&body=' + initResult.token);
            // $("#messageParagraph").html(successText + "Checking registration status...");
            
              
                               
                
                currentDevice.pushToken = initResult.token;
          
            return currentDevice.getRegistration();
        },
        function(err) {
            alert("ERROR!<br /><br />An error occured while initializing the device for push notifications.<br/><br/>" + err.message);
        }
        ).then(
                    function(registration) {
                        if (registration.result) {
                            //
                        } else {
                            alert("Press Notifications to receive event messages");
                        }
                    },
                    function(err) {
                        alert("An error occured while checking device registration status");
                    }
                );
              
    /*, function() {
        alert('Initialized successfully');
    }, function() {
        alert('Initialization error');
    });
  
    if (!currentDevice.pushToken) {
        alert('Device token not generated');
       // return false;
        }*/
   
}


function subscribeForNotifications() {
    event.preventDefault();
    Everlive.$.push.currentDevice().register({ role: 'user' })
    .then(
        function() {

            alert('Device Registered for notifications');
        },
    function(err) {

        alert('Device already registered or Registration NOT successful: ' +err.code);
    }
    );

    /* , function() {
    alert('Device Registered successfully');
    }, function() {
    alert('Device already registered or Registration NOT successfull');
    });*/
}


// function to remove device from notification
function removeFromNotification() {
    var el = Everlive.$;
    el.push.currentDevice().disableNotifications()
    .then(
        function() {

            alert('UnRegistered for notifications');
        },
    function(err) {
        alert('REGISTER ERROR: ' + JSON.stringify(err));
    }
    );
    
    /*unregister(function() {
        alert('Device successfully unregistered');
    }, function() {
        alert('Device unable to unregister');
    });*/
}

// functions to save data to localStorage

function saveDataLocally1(lKey, dObj) { 
    console.log('data saved');
    if (localStorage.lKey)
    {
        var existingValue = JSON.parse(localStorage[lKey]);
        existingValue.push(dObj);
        localStorage[lKey] = JSON.stringify(existingValue); 
    }
    else
    {
    localStorage[lKey] = JSON.stringify(dObj);  
    }
}

// function to retrieve data from localStorage

 function readDataFromLocalStorage1(lKey) {
    if (localStorage[lKey])
    {
    var datasaved = JSON.parse(localStorage["myagenda"]);
    return datasaved;
        }
}


function closeModalViewReviewSaved()
{
    $("#modalview-reviewsaved").kendoMobileModalView("close");
}


function refreshAllSessionsData()
{
    if (localStorage.allSessionData)
    localStorage.removeItem("allSessionData");
    if (localStorage.tracks)
    localStorage.removeItem("tracks");
    if (localStorage.speakers)
    localStorage.removeItem("speakers");
    if (localStorage.venues)
    localStorage.removeItem("venues");
    
}


function showSponsors()
{
    var sponsors = [  ]
}
