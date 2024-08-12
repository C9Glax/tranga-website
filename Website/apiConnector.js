//let apiUri = `${window.location.protocol}//${window.location.host}/api`

let apiUri = `http://localhost:6531/v2`;

// if(getCookie("apiUri") != ""){
//     apiUri = getCookie("apiUri");
// }
// setCookie("apiUri", apiUri);

function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + (365*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;samesite=strict";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function GetData(uri){
    let request = await fetch(uri, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    let json = await request.json();
    return json;
}

async function PostData(uri, data = null){
    let request = await fetch(uri, {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log(request);
}

function DeleteData(uri, data = null){
    fetch(uri, {
        method: 'DELETE',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    });
}

async function Ping(){
  let ret = await GetData(`${apiUri}/Ping`);
  return ret;
}

async function GetAvailableControllers(){
    var uri = apiUri + "/Connector/Types";
    let json = await GetData(uri);
    return json;
}

async function GetPublicationFromConnector(connector, searchTerm){
  var uri;
  if(searchTerm.includes("http")){
    uri = `${apiUri}/Connector/${connector}/GetManga?url=${searchTerm}`;
  }else{
    uri = `${apiUri}/Connector/${connector}/GetManga?title=${searchTerm}`;
  }
  let json = await GetData(uri);
  return json;
}

async function GetManga(internalId){
    uri = `${apiUri}/Manga/${internalId}`;
    let json = await GetData(uri);
    return json;
}

async function GetChapters(connector, internalId, lang){
    var uri = `${apiUri}/Manga/${internalId}/Chapters`;
    body = {
        'language':lang
    };
    let json = await GetData(uri);
    return json;
}

function GetCoverUrl(internalId){
  return `${apiUri}/Manga/${internalId}/Cover`;
}

async function GetAllJobs(){
	var uri = `${apiUri}/Jobs`;
	let json = await GetData(uri);
	return json;
}

async function GetRunningJobs(){
    var uri = `${apiUri}/Jobs/Running`;
    let json = await GetData(uri);
    return json;
}

async function GetWaitingJobs(){
    var uri = `${apiUri}/Jobs/Waiting`;
    let json = await GetData(uri);
    return json;
}

async function GetMonitorJobs(){
  var uri = `${apiUri}/Jobs/Monitoring`;
  let json = await GetData(uri);
  return json;
}

async function GetJobDetails(jobId){ 
    var uri = `${apiUri}/Job/${jobId}`;
    let json = await GetData(uri);
    return json;
}

async function GetProgress(jobId){
    var uri = `${apiUri}/Job/${jobId}/Progress`;
    let json = await GetData(uri);
    return json;
}

async function GetSettings(){
    var uri = `${apiUri}/Settings`;
    let json = await GetData(uri);
    return json;
}

async function GetAvailableNotificationConnectors(){
	var uri = `${apiUri}/NotificationConnector/Types`;
	let json = await GetData(uri);
	return json;
}

async function GetNotificationConnectors(){
	var uri = `${apiUri}/NotificationConnector`;
	let json = await GetData(uri);
	return json;
}

async function GetAvailableLibraryConnectors(){
	var uri = `${apiUri}/LibraryConnector/Types`;
	let json = await GetData(uri);
	return json;
}

async function GetLibraryConnectors(){
	var uri = `${apiUri}/LibraryConnector`;
	let json = await GetData(uri);
	return json;
}

async function GetRateLimits() {
    var uri = `${apiUri}/Settings/RateLimit`
    let json = await GetData(uri);
    //console.log(json);
    return json;
}

function CreateMonitorJob(connector, internalId, language, interval, folder = null, chapterNo){
    var uri = `${apiUri}/Job/Create/MonitorManga`;
	body = {
        'internalId':internalId,
        'customFolder':folder,
        'startChapter':chapterNo,
        'interval':interval,
        'language':language
    };
	PostData(uri, body);
}

function CreateDownloadNewChaptersJob(connector, internalId, language){
    var uri = `${apiUri}/Job/Create/DownloadNewChapters`;
    body = {
        'internalId':internalId,
        'language':language
    };
    PostData(uri, body);
}

function StartJob(jobId){
    var uri = `${apiUri}/Job/${jobId}/StartNow`;
    PostData(uri);
}

function UpdateDownloadLocation(downloadLocation, moveFiles = true){
    var uri = `${apiUri}/Settings/DownloadLocation`;
    body = {
        'location':downloadLocation,
        'moveFiles':moveFiles
    }
    PostData(uri, body);	
}

function RefreshLibraryMetadata() {
    var uri = `${apiUri}/Jobs/UpdateMetadata`;
    PostData(uri);
}

function RefreshMangaMetadata(id) {
    var uri = `${apiUri}/Jobs/UpdateMetadata?internalId=${id}`;
    PostData(uri);
}

async function DownloadLogs() {
    var uri = `${apiUri}/LogFile`;

    //Below taken from https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
    fetch(uri)
    .then((response) => response.body)
    .then((rb) => {
      const reader = rb.getReader();
  
      return new ReadableStream({
        start(controller) {
          // The following function handles each data chunk
          function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then(({ done, value }) => {
              // If there is no more data to read
              if (done) {
                console.log("done", done);
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              // Check chunks by logging to the console
              console.log(done, value);
              push();
            });
          }
  
          push();
        },
      });
    })
    .then((stream) =>
      // Respond with our stream
      new Response(stream, { headers: { "Content-Type": "text/html" } }).text(),
    )
    .then((result) => {
      // Do things with result
      //console.log(result);

      //Below download taken from https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset-utf-8,' + encodeURIComponent(result));
      var newDate = new Date();
      var filename = "Tranga_Logs_" + newDate.today() + "_" + newDate.timeNow() + ".log";
      element.setAttribute('download', filename);
      element.click();
    });
}

//Following date-time code taken from: https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +"_"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +"_"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function UpdateAprilFoolsMode() { 
	checkBox = document.getElementById("aprilFoolsMode");
	var uri = `${apiUri}/Settings/AprilFoolsMode`;
    body = {
        'value':checkBox.checked
    }
	PostData(uri, body);
}

function ResetRateLimits() {
	var uri = `${apiUri}/Settings/RateLimit`;
	PostData(uri);
	OpenSettings();
}

function ResetUserAgent() {
	var uri = `${apiUri}/Settings/UserAgent`;
	PostData(uri);
	OpenSettings();
}

//Komga
function UpdateKomga(komgaUrl, komgaAuth){
    var uri = `${apiUri}/LibraryConnector/Komga`;
    body = {
        'URL':komgaUrl,
        'auth':komgaAuth
    }
    PostData(uri, body);
}

function ResetKomga(){
    var uri = `${apiUri}/LibraryConnector/Komga`;
    DeleteData(uri);
}

function TestKomga(komgaUrl, komgaAuth){
    var uri = `${apiUri}/LibraryConnector/Komga/Test`;
    body = {
        'URL':komgaUrl,
        'auth':komgaAuth
    }
    PostData(uri, body);
}

//Kavita
function UpdateKavita(kavitaUrl, kavitaUsername, kavitaPassword){
    var uri = `${apiUri}/LibraryConnector/Kavita`;
    body = {
        'URL':kavitaUrl,
        'username':kavitaUsername, 
        'password':kavitaPassword
    }
    PostData(uri, body);
}

function ResetKavita(){
    var uri = `${apiUri}/LibraryConnector/Kavita`;
    DeleteData(uri);
}

function TestKavita(kavitaUrl, kavitaUsername, kavitaPassword){
    var uri = `${apiUri}/LibraryConnector/Kavita/Test`;
    body = {
        'URL':kavitaUrl,
        'username':kavitaUsername, 
        'password':kavitaPassword
    }
    PostData(uri, body);
}

//Gotify
function UpdateGotify(gotifyUrl, gotifyAppToken){
    var uri = `${apiUri}/NotificationConnector/Gotify`;
    body = {
        'url':gotifyUrl,
        'appToken':gotifyAppToken
    };
    PostData(uri, body);
}

function ResetGotify(){
    var uri = `${apiUri}/NotificationConnector/Gotify`;
    DeleteData(uri);
}

function TestGotify(gotifyUrl, gotifyAppToken){
    var uri = `${apiUri}/NotificationConnector/Gotify/Test`;
    body = {
        'url':gotifyUrl,
        'appToken':gotifyAppToken
    };
    PostData(uri, body);
}

//LunaSea
function UpdateLunaSea(lunaseaWebhook){
    var uri = `${apiUri}/NotificationConnector/LunaSea`;
    body = {
        'webhook':lunaseaWebhook
    }
    PostData(uri, body);
}

function ResetLunaSea(){
    var uri = `${apiUri}/NotificationConnector/LunaSea`;
    DeleteData(uri);
}

function TestLunaSea(lunaseaWebhook){
    var uri = `${apiUri}/NotificationConnector/LunaSea/Test`;
    body = {
        'webhook':lunaseaWebhook
    }
    PostData(uri, body);
}

//Ntfy
function UpdateNtfy(ntfyEndpoint, ntfyUser, ntfyPass){
    var uri = `${apiUri}/NotificationConnector/Ntfy`;
    body = {
        'url':ntfyEndpoint,
        'username':ntfyUser,
        'password':ntfyPass
    }
    PostData(uri, body);
}

function ResetNtfy(){
    var uri = `${apiUri}/NotificationConnector/Ntfy`;
    DeleteData(uri);
}

function TestNtfy(ntfyEndpoint, ntfyUser, ntfyPass){
    var uri = `${apiUri}/NotificationConnector/Ntfy/Test`;
    body = {
        'url':ntfyEndpoint,
        'username':ntfyUser,
        'password':ntfyPass
    }
    PostData(uri, body);
}

function UpdateUserAgent(userAgent){
    var uri = `${apiUri}/Settings/UserAgent`;
    body = {
        'value':userAgent
    }
    PostData(uri, body);
}

function UpdateRateLimit(type, rateLimit) {
    var uri = `${apiUri}/Settings/customRequestLimit?requestType=${type}&requestsPerMinute=${rateLimit}`;
    PostData(uri);
}

function RemoveJob(jobId){
    var uri = `${apiUri}/Job/${jobId}`;
    DeleteData(uri);
}

function CancelJob(jobId){
    var uri = `${apiUri}/Job/${jobId}/Cancel`;
    PostData(uri);
}
