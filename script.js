
var places  = [];
var myArray = ['#F44336', '#009688', '#3F51B5','#4CAF50','#2196F3']; 

$(document).ready(function() {

   var options = {
  types: ['(cities)']
  }

   var input = document.getElementById('place');
   new google.maps.places.Autocomplete(input,options);

   });


function insert () {
 
 var inputdata = $('#place').val();
 if(inputdata==""){
  alert("Please provide place first..!")
  return false;
 }else if(inputdata.includes("-")){
  inputdata.replace(" - ", " ,");
  }else if(!inputdata.includes(",")){

  alert("Please select place from list..!")
  return false;
 }


 //alert(inputdata);


 var getplaces = localStorage.getItem("places");
 var parsedget = JSON.parse(getplaces);

 if(parsedget!=null && parsedget.includes(inputdata)){

  alert("Place already saved!")

 }else{

 places.push( inputdata );
 JSON.stringify(places)
 localStorage.setItem("places", JSON.stringify(places));

 $('.container').html("");
 showdata();
 }

}

function deleteplaces () {

  if (confirm("Do you want to delete all places?")) {
    localStorage.setItem("places","[]");
    location.reload();
    } else {
    
  }
 
}

function splashscreenout () {

var places = localStorage.getItem("places");
if(places==null){
  $('#splashscreen').fadeOut("slow");
  $('.info').show();
 }
}

function deletePlace(clr) {
var retrievedData = localStorage.getItem("places");
var places = JSON.parse(retrievedData);

 for (var i = 0;i<=places.length-1;i++) {

  if(places[i].includes(clr))

    var index = places.indexOf(places[i]);
  if (index > -1) {
  places.splice(index, 1);
  localStorage.setItem("places", JSON.stringify(places));
  location.reload();
  $('.info').show();
}
}
  
  //alert(clr);
}

$( document ).ready(function() {
var places = localStorage.getItem("places");
if(places==null||places.length==2){
  $('#splashscreen').fadeOut('fast');
}else{
  showdata();
}
   
});


$( document ).ready(function() {
    $("#Addplace").click(function(){
      $('#myModal').show();
   });

  $(".close").click(function(){
      $('#myModal').hide();
   });
});


function showdata() {
  $('#myModal').hide();
  $('.info').hide();
 var getplaces = localStorage.getItem("places");
 if(!getplaces==""){
 
 var retrievedData = localStorage.getItem("places");
 places = JSON.parse(retrievedData);
 //alert(places.length);
 for (var i = 0;i<=places.length-1;i++) {

 var location = places[i]
var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
var method = 'GET';
var app_id = 'iWJzNd5c';
var consumer_key = 'dj0yJmk9emxBQ1FBbmV3dUtCJmQ9WVdrOWFWZEtlazVrTldNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTE2';
var consumer_secret = '6c83035a3577e52ef57017904b42583e9016991e';
var concat = '&';
var units = 'C';
var query = {'location': location, 'format': 'json','u':units};
var oauth = {
    'oauth_consumer_key': consumer_key,
    'oauth_nonce': Math.random().toString(36).substring(2),
    'oauth_signature_method': 'HMAC-SHA1',
    'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
    'oauth_version': '1.0'
};

var merged = {}; 
$.extend(merged, query, oauth);
// Note the sorting here is required
var merged_arr = Object.keys(merged).sort().map(function(k) {
  return [k + '=' + encodeURIComponent(merged[k])];
});
var signature_base_str = method
  + concat + encodeURIComponent(url)
  + concat + encodeURIComponent(merged_arr.join(concat));

var composite_key = encodeURIComponent(consumer_secret) + concat;
var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
var signature = hash.toString(CryptoJS.enc.Base64);

oauth['oauth_signature'] = signature;
var auth_header = 'OAuth ' + Object.keys(oauth).map(function(k) {
  return [k + '="' + oauth[k] + '"'];
}).join(',');

$.ajax({
  url: url + '?' + $.param(query),
  headers: {
    'Authorization': auth_header,
    'X-Yahoo-App-Id': app_id 
  },
  method: 'GET',
  success: function(data){
    console.log(data);

    var city = data.location.city;
    var region = data.location.region;
    var country = data.location.country;
    var temp = data.current_observation.condition.temperature;
    var description = data.current_observation.condition.text;
    var highlow = data.forecasts[0].high+'\xB0' + units+" / "+data.forecasts[0].low+'\xB0' + units;

    var bgcolor = myArray[Math.floor(Math.random() * myArray.length)];

 //document.getElementById("display").innerHTML += "Places: " +places[i] + "<br/>";

  $('.container').append(

    '<div style="background-color:'+bgcolor+'" class="main"><div class="place">'+city +" | "+region+'</div>'+"<span id="+city+" onclick='deletePlace(this.id)' class='delete_icon material-icons'>delete</span>"+'<div class="icontemp">'+"<i id=mainicon class='wi wi-yahoo-"+ data.current_observation.condition.code +"'></i>"
    +" "+temp+ '\xB0' + units+'</div><div class="description">'+description+'</div><div class="highlow">'+highlow+'</div></div>'


    );

  $('#place').val("");
  $('.mdl-spinner').css("display","none");
  $('.main').fadeIn();
  $('#deletebutton').css("display","block");
  $('#splashscreen').fadeOut('fast');

    }
  
});

    }


  }

}