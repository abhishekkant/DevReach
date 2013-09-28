// JavaScript Document
'use strict';

var everliveKey = 'DJOOCpPmPJe2fJ8s';

var GoogleProjectID = '541570376695';
 var el = new Everlive({
        apiKey: everliveKey
    });
var fbClientID="1378904992343802";
var app;
var dateData = [{"dateTitle":"Day 1", "dateValue":"10/01/2013"}, 
    {"dateTitle":"Day 2", "dateValue":"10/02/2013"},
{"dateTitle":"Pre-Event", "dateValue":"09/30/2013"}
];

var speakerDetailsData;
var baseURL = "http://devreachservice.telerikindia.com/EventNetworkingService.svc";
var c;
var dataReadFromLocalStorage;  
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
        var speakersListTemplate = kendo.template($("#speakersTemplate").html());
    
        var listviewTD = $("#speakersView").data("kendoMobileListView");
    if(listviewTD)
    {
    listviewTD.destroy();
        }
    var speakerData,spDatafromLS;
    if (localStorage.speakers) {
        console.log("In LS");
        spDatafromLS = JSON.parse(localStorage.speakers);
        speakerData = new kendo.data.DataSource({
            data: spDatafromLS
        });
          speakerData.fetch(); 
        
        $("#speakersView").kendoMobileListView({
        dataSource: speakerData,
        template:speakersListTemplate,
        style:"inset"
    }); 
    }
    else {
        console.log("In Live section");

        var speakerDataLive = new kendo.data.DataSource(
            {
            type: "odata",
                change: function(e) {
                        // to retrieve the data from the datasource and save it to the local storage
                    var speakersNotUnique = e.items;
                    
                    
                var uniqSpeakers = [];
                    
                $.each(speakersNotUnique, function(i, el) {
                    for (var i = 0;i < uniqSpeakers.length;i++) { 
                        if (el.UserProfile.UserId === uniqSpeakers[i].UserProfile.UserId)
                            break;
                    }
                    if (i == uniqSpeakers.length)
                    {
                    uniqSpeakers.push(el);
                        }
                });
                    
                    $("#speakersView").kendoMobileListView({
        dataSource: new kendo.data.DataSource({data: uniqSpeakers}),
        template:speakersListTemplate,
        style:"inset"         
    }); 
                    localStorage.speakers = JSON.stringify(uniqSpeakers);
                    
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
        speakerDataLive.read();
    }

   
}




function getSessionsBySpeakers()
{
    var speakersListTemplate4Session = kendo.template($("#speakersbySessionTemplate").html());
    var listviewTD = $("#speakersViewforSession").data("kendoMobileListView");
    if (listviewTD)
    {
        listviewTD.destroy();
    }
    var speakerData;
    if (localStorage.speakers) {
        console.log("In LS");
        speakerData = new kendo.data.DataSource({
            data: JSON.parse(localStorage.speakers)
        });
        
        
    speakerData.fetch();
      $("#speakersViewforSession").kendoMobileListView({
        dataSource: speakerData,
        template:speakersListTemplate4Session,
        style:"inset",
        click: displaysessionsbyspeaker
               
    }); 
    
        
    }
    else {
        console.log("In Live section");
        
         
        speakerData = new kendo.data.DataSource(
            {
            type: "odata",
                change: function(e) {
                        // to retrieve the data from the datasource and save it to the local storage
                         var speakersNotUnique = e.items;
                    
                    
                var uniqSpeakers = [];
                    
                $.each(speakersNotUnique, function(i, el) {
                    for (var i = 0;i < uniqSpeakers.length;i++) { 
                        if (el.UserProfile.UserId === uniqSpeakers[i].UserProfile.UserId)
                            break;
                    }
                    if (i == uniqSpeakers.length)
                    {
                    uniqSpeakers.push(el);
                        }
                });
                    
                    $("#speakersView").kendoMobileListView({
        dataSource: new kendo.data.DataSource({data: uniqSpeakers}),
        template:speakersListTemplate,
        style:"inset"         
    }); 
                    localStorage.speakers = JSON.stringify(uniqSpeakers);
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
    
    console.log(speakerData);
   
    
   
  
    
}


function showMe(e) {
    if (localStorage.myagenda) {
        dataReadFromLocalStorage = JSON.parse(localStorage["myagenda"]);
    }
    var myAgendaData;
    if (dataReadFromLocalStorage == null)
    {
      $("#emptyAgenda").show(); 
    }
    else 
    {
         $("#emptyAgenda").hide(); 
        myAgendaData = new kendo.data.DataSource(
        {          
        data : dataReadFromLocalStorage                     
    });
    
    if (myAgendaData != null) {
        myAgendaData.fetch(); 
    }
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
 sessionsByVenueData.fetch();
    console.log(sessionsByVenueData);
    var template1 = kendo.template($("#filteredSessionsTemplate").text());
    
    var vlistview = $("#sessioninVenueList").data("kendoMobileListView");
    if(vlistview) vlistview.destroy();
    
    $("#sessioninVenueList").kendoMobileListView({
        dataSource: sessionsByVenueData,
        template:template1,
        style:"inset",   
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
    console.log("in time");
    
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
    

    sessionTimeDS.fetch();

   
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
                                     saveDataLocally1('tracks',e.items);
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
                                     saveDataLocally1('venues',e.items);
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
                                     saveDataLocally1('allSessionData',e.items);
                                },
                        transport: {
                                cache: "inmemory",
                                read: {
                    
                                url: baseURL + "/SessionAttendees?$expand=UserProfile,Session,Session/SessionTimeSlot,UserProfile/UserURLs&$filter=AttendeeType eq 11&$select=Session/SessionID,UserProfile/UserId,UserProfile/FirstName,UserProfile/LastName,UserProfile/UserURLs/URL,Session&$orderby=Session/SessionTimeSlot/FromTime",
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
  if ((!$('#isAnonymous').data("kendoMobileSwitch").check() && $('#name').val()==='') || (!$('#isAnonymous').data("kendoMobileSwitch").check() && $('#email').val()===''))
        {
             navigator.notification.alert("Please enter your details");
            return;
        }
    

                var personalDetails = new Array();
                var obj = {'name': $('#name').val()};
                personalDetails.push(obj);
                var obj1 = {'email':$('#email').val() };
                personalDetails.push(obj1);
                var obj2 = {'isAnonymous': $('#isAnonymous').data("kendoMobileSwitch").check()}
                personalDetails.push(obj2);
                localStorage['myDetails'] = JSON.stringify(personalDetails);
                 navigator.notification.alert("Personal Details Saved",function(){},"DevReach Companion","Done");
}

function checkPersonalSettings() {
    if (localStorage['myDetails']) {
        var personalDetails = JSON.parse(localStorage['myDetails']);
         
        $('#name').val(personalDetails[0].name);
        $('#email').val(personalDetails[1].email);
        $('#isAnonymous').data("kendoMobileSwitch").check(personalDetails[2].isAnonymous);
        $('#savePersonalDetails').text('Update');
    }
        else
    {
        if (!$('#isAnonymous').data("kendoMobileSwitch").check())
        {
         navigator.notification.alert("Please provide your Details to proceed",function(){},"DevReach Companion","OK");
            }
    }
    
    if(localStorage.myReview)
    {
    var myreviewLS = JSON.parse(localStorage["myReview"]);
    console.log(myreviewLS.length);
    var submitratingbuttonmessage= "Sync ("+ myreviewLS.length + ")";
    $('#submitRatings').html(submitratingbuttonmessage);
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
        var isAnony = personalDetails[2].isAnonymous;
        if (!isAnony) {
        item.name = personalDetails[0].name;
        item.email = personalDetails[1].email;
            }
        
    }
    
    var myreview = JSON.parse(localStorage.myReview);          
    myreview.push(item);    
    localStorage["myReview"] = JSON.stringify(myreview); 
    app.navigate("#settingsView");
   // $("#modalview-reviewsaved").data("kendoMobileModalView").open();
}


function submitRatingsEverlive(e) {
    app.showLoading();
    if (localStorage.myReview)
    {
        var data = Everlive.$.data('SessionRatingsbyUser');
        var myreviewLS = JSON.parse(localStorage["myReview"]);
        data.create(myreviewLS,
        function(data){
            localStorage.removeItem("myReview");
            app.hideLoading();
       navigator.notification.alert("Ratings successfully submitted",function(){},"DevReach Companion","Done");
    },
        function(error){
             app.hideLoading();
        navigator.notification.alert("Ratings were not successfully sent",function(){},"Error","Done");
    });
        
    }
    else
    {
        app.hideLoading();
        
navigator.notification.alert("No Ratings available to submit",function(){},"DevReach Companion","Done");
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
        center: new google.maps.LatLng(42.6579137,23.3158414),
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
        position: new google.maps.LatLng(42.6579137,23.3158414),
        color: "green",
        map: map, 
        title: "DevReach"
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
    
    //el.push.currentDevice().getRegistration(successCallback, function() {alert("Registering the device.");currentDevice = el.push.currentDevice();});
    var onAndroidPushReceived = function(args) {
        navigator.notification.alert('Event Notification: ' + JSON.stringify(args.message),function(){},"DevReach Companion","Done"); 
    };

    var pushSettings = {
        iOS:{
            badge: "true",
            sound: "true",
            alert: "true"
        },
        android:{
            senderID: GoogleProjectID
        },
        
        notificationCallbackAndroid: onAndroidPushReceived,
        notificationCallbackIOS: function(e){
            navigator.notification.alert('Event Notification: ' + JSON.stringify(e.alert),function(){},"DevReach Companion","Done");
        },
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
            navigator.notification.alert("ERROR!<br /><br />An error occured while initializing the device for push notifications.<br/><br/>" + err.message, function(){},"Error","Done");
        }
        ).then(
                    function(registration) {
                        if (registration.result) {
                            //
                        } else {
                            app.navigate("#settingsView");
                            navigator.notification.alert("Please toggle Notifications to On", function(){},"DevReach Companion","Show Settings");
                        }
                    },
                    function(err) {
                        navigator.notification.alert("An error occured while checking device registration status",function(){},"Error","Done");
                    }
                );
              
    /*  
    if (!currentDevice.pushToken) {
        alert('Device token not generated');
       // return false;
        }*/
   
}


function subscribeForNotifications() {
      app.showLoading();
    event.preventDefault();
    Everlive.$.push.currentDevice().register({ role: 'user' })
    .then(
        function() {

  app.hideLoading();
 navigator.notification.alert("Device Registered for notifications",function(){},"DevReach Companion","Done");
        },
    function(err) {

        app.hideLoading();
navigator.notification.alert("Device already registered or Registration NOT successful:" +err.code,function(){},"Error","Done");
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

            navigator.notification.alert('UnRegistered for notifications');
        },
    function(err) {
        navigator.notification.alert('Unregister Error: ' + JSON.stringify(err));
    }
    );
    
}

// functions to save data to localStorage

function saveDataLocally1(lKey, dObj) { 
    console.log('data saved');
    if (localStorage[lKey])
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


function getAllSessionsFromLiveData()
{
    app.showLoading();  
    tracksShow();
    venueListClick();
getAllSessions();
getSessionsBySpeakers();
    
     app.hideLoading();  

}


function getParameterByName(name, url) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = name + "=([^&#]*)";
 			
	console.log("Parameter name: " + name);
	console.log("Url: " + url);
            
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
            
	console.log("Result: " + results);
            
	if (results == null) {
		return false;
	}
	else 
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}


// https://developers.facebook.com/docs/facebook-login/login-flow-for-web-no-jssdk/

var IdentityProvider = function (config) {
	var that = this;
    var ref;
	
    
    this.getAccessToken = function(callback) {
        
        // Begin Authorization
        var authorize_url = config.endpoint
                            + "?response_type=" + config.response_type
                            + "&client_id=" + config.client_id
                            + "&redirect_uri=" + config.redirect_uri
                            + "&display=" + config.display
                            + "&access_type=" + config.access_type
                            + "&scope=" + config.scope
   
        //CALL IN APP BROWSER WITH THE LINK
        ref = window.open(authorize_url, '_blank', 'location=no');
        
        ref.addEventListener('loadstart', function(event) {
            that.locationChanged(event.url, callback);
        });
        
        ref.addEventListener('loadstop', function(event) {
            that.locationChanged(event.url, callback);
        });
        
       
    }
    
    this.locationChanged = function(loc, callback) {
        if (loc.indexOf("access_token=") != -1) {
            ref.close();  
            var token = getParameterByName("access_token", loc);
            callback(token);
        }
    }
}


 var facebook = new IdentityProvider({
        name: "DevReach Companion",
        loginMethodName: "loginWithFacebook",
        endpoint: "https://www.facebook.com/dialog/oauth",
        response_type:"token",
        client_id: fbClientID,
        redirect_uri:"https://www.facebook.com/connect/login_success.html",
        access_type:"online",
        scope:"email,publish_actions",
        display: "touch"
    });

function fbLogin()
{
     app.showLoading();  
       
    var fbT;
    facebook.getAccessToken(function(token) {

        el.Users.loginWithFacebook(token)
				.then(function() {
                     localStorage["fbToken"] = JSON.stringify(token);
					var message = "Saved to Everlive!";
                    fbT = token;
					//navigator.notification.alert(message, function() {})
				
			})
        .then(function () {
            app.hideLoading();
            //var fbT = localStorage.fbToken;
            if (fbT != null) {
                $.get("https://graph.facebook.com/me?fields=name,email&access_token=" + fbT)
                .done(function(data) {
                    $("#name").val(data.name);
                    $("#email").val(data.email);  
                    savePersonalDetailsfn();
                });
                navigator.notification.alert("Details Updated");
            }
            else
            {
                navigator.notification.alert("Token not available.");
            }
            //app.navigate('#home');
        })
         .then(null, function (err) {
                    app.hideLoading();
                   // if (err.code = 214) {
                     
                        navigator.notification.alert(err.message);
                    
                });
        })
		
}


function fbPost() {
   
         console.log("Getting token from live");
        facebook.getAccessToken(function(token) {
            makefbPost("Post from DevReach Companion App", "http://www.devreach.com", "DevReach", token);      
        }); 
}

function makefbPost(FBmessage, FBLink, FBLinkName, fbToken)
{
        var postURL = "https://graph.facebook.com/me/feed";
    var data = {};
            data.message = FBmessage;
        data.name = FBLinkName;
    data.link = FBLink;

   data.access_token = fbToken;
 console.log("Token:" + fbToken);   
        
 $.post(postURL,data)
    .done(function(results) {
        navigator.notification.alert("Status Posted");
    })
        .error(function(err)
        {
            console.log(err);
            navigator.notification.alert(err);
        }); 
}


function changeNotificationSetting(e)
{
    if (e.checked)
    {
     // Notifications has been enabled  
        subscribeForNotifications();
    }
    else
    {
        // Notification has been disabled
        removeFromNotification();
    }
}