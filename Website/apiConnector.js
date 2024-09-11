//let apiUri = `${window.location.protocol}//${window.location.host}/api`

let apiUri = `http://192.168.1.79:6531`;

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

async function PostData(uri, body){
    let request = await fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: body
    });
    //console.log(request);
}

function DeleteData(uri){
    fetch(uri, {
        method: 'DELETE'
    });
}

async function Ping(){
  let ret = await GetData(`${apiUri}/v2/Ping`);
  return ret;
}

async function GetAvailableControllers(){
    var uri = `${apiUri}/v2/Connector/Types`;
    let json = await GetData(uri);
    return json;
}

async function GetPublicationFromConnector(connector, title){
  var uri = `${apiUri}/v2/Connector/${connector}/GetManga`;
  if(title.startsWith("http")){
    uri += `?url=${title}`
  }else{
    uri += `?title=${title}`
  }
  let json = await GetData(uri);
  return json;
}

async function GetCoverUrl(internalId){
    return `${apiUri}/v2/Manga/${internalId}/Cover`;
}

async function GetAllJobs(){
	var uri = `${apiUri}/v2/Jobs`;
	let json = await GetData(uri);
	return json;
}

async function GetRunningJobs(){
    var uri = `${apiUri}/v2/Jobs/Running`;
    let json = await GetData(uri);
    return json;
}

async function GetWaitingJobs(){
    var uri = `${apiUri}/v2/Jobs/Waiting`;
    let json = await GetData(uri);
    return json;
}

async function GetMonitorJobs(){
  var uri = `${apiUri}/v2/Jobs/Monitoring`;
  let json = await GetData(uri);
  return json;
}

async function GetJob(jobId){
    var uri = `${apiUri}/v2/Job/${jobId}`;
    let json = await GetData(uri);
    return json;
}

async function GetSettings(){
    var uri = `${apiUri}/v2/Settings`;
    let json = await GetData(uri);
    return json;
}

async function GetAvailableNotificationConnectors(){
	var uri = `${apiUri}/v2/NotificationConnector/Types`;
	let json = await GetData(uri);
	return json;
}

async function GetNotificationConnectors(){
	var uri = `${apiUri}/v2/NotificationConnector`;
	let json = await GetData(uri);
	return json;
}

async function GetAvailableLibraryConnectors(){
	var uri = `${apiUri}/v2/LibraryConnector/Types`;
	let json = await GetData(uri);
	return json;
}

async function GetLibraryConnectors(){
	var uri = `${apiUri}/v2/LibraryConnector`;
	let json = await GetData(uri);
	return json;
}

async function GetRateLimits() {
    var uri = `${apiUri}/v2/Settings/RateLimit`
    let json = await GetData(uri);
    return json;
}

async function GetMangaChapters(connector, internalId) {
    var uri = `${apiUri}/v2/Manga/${internalId}`
    let json = await GetData(uri);
    return json;
}

function CreateMonitorJob(internalId, language, interval, folder = null, chapterNo){
    var uri = `${apiUri}/v2/Job/Create/MonitorManga`;
    let data = `{ "internalId": ${internalId}, "language": ${language}, "interval": ${interval}, "startChapter": ${chapterNo}, "customFolder": ${folder} }`
    PostData(uri, data);
}

function CreateDownloadNewChaptersJob(internalId, language){
    var uri = `${apiUri}/v2/Job/Create/DownloadNewChaptersJob`;
    let data = `{ "internalId": ${internalId}, "language": ${language} }`
    PostData(uri, data);
}

function StartJob(jobId){
    var uri = `${apiUri}/v2/Job/${jobId}/StartNow`;
    PostData(uri);
}

function UpdateDownloadLocation(downloadLocation){
    var uri = `${apiUri}/v2/Settings/DownloadLocation`;
    PostData(uri, `{ "location": ${location} }`);	
}

function RefreshMangaMetadata(internalId) {
    var uri = `${apiUri}/v2/Job/Create/UpdateMetaDataJob`;
    PostData(uri, `{ "internalId": ${internalId} }`);
}

async function DownloadLogs() {
    var uri = `${apiUri}/v2/LogFile`;

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
	var uri = `${apiUri}/v2/Settings/AprilFoolsMode`;
	PostData(uri, `{ "value": ${checkBox.checked} }` );
}

function ResetRateLimits() {
	var uri = `${apiUri}/v2/Settings/RateLimit`;
	PostData(uri);
	OpenSettings();
}

function ResetUserAgent() {
	var uri = `${apiUri}/v2/Settings/UserAgent`;
	PostData(uri);
	OpenSettings();
}

//Komga
function UpdateKomga(komgaUrl, komgaAuth){
    var uri = `${apiUri}/v2/LibraryConnector/Komga`;
    PostData(uri, `{ "url": ${komgaUrl}, "auth": ${komgaAuth} }`);
}

function ResetKomga(){
    var uri = `${apiUri}/v2/LibraryConnector/Komga`;
    DeleteData(uri);
}

function TestKomga(komgaUrl, komgaAuth){
    var uri = `${apiUri}/v2/LibraryConnector/Komga/Test`;
    PostData(uri, `{ "url": ${komgaUrl}, "auth": ${komgaAuth} }`);
}


//Kavita
function UpdateKavita(kavitaUrl, kavitaUsername, kavitaPassword){
    var uri = `${apiUri}/v2/LibraryConnector/Kavita`;
    PostData(uri, `{ "url": ${kavitaUrl}, "uasername": ${kavitaUsername}, "password": ${kavitaPassword} }`);
}

function ResetKavita(){
    var uri = `${apiUri}/v2/LibraryConnector/Kavita`;
    DeleteData(uri);
}

function TestKavita(kavitaUrl, kavitaUsername, kavitaPassword){
    var uri = `${apiUri}/v2/LibraryConnector/Kavita/Test`;
    PostData(uri, `{ "url": ${kavitaUrl}, "uasername": ${kavitaUsername}, "password": ${kavitaPassword} }`);
}

//Gotify
function UpdateGotify(gotifyUrl, gotifyAppToken){
    var uri = `${apiUri}/v2/NotificationConnector/Gotify`;
    PostData(uri, `{ "url": ${gotifyUrl}, "appToken": ${gotifyAppToken} }`);
}

function ResetGotify(){
    var uri = `${apiUri}/v2/NotificationConnector/Gotify`;
    DeleteData(uri);
}

function TestGotify(gotifyUrl, gotifyAppToken){
    var uri = `${apiUri}/v2/NotificationConnector/Gotify/Test`;
    PostData(uri, `{ "url": ${gotifyUrl}, "appToken": ${gotifyAppToken} }`);
}

//LunaSea
function UpdateLunaSea(lunaseaWebhook){
    var uri = `${apiUri}/v2/NotificationConnector/LunaSea`;
    PostData(uri, `{ "webhook": ${lunaseaWebhook} }`);
}

function ResetLunaSea(){
    var uri = `${apiUri}/v2/NotificationConnector/LunaSea`;
    DeleteData(uri);
}

function TestLunaSea(lunaseaWebhook){
    var uri = `${apiUri}/v2/NotificationConnector/LunaSea/Test`;
    PostData(uri, `{ "webhook": ${lunaseaWebhook} }`);
}

//Ntfy
function UpdateNtfy(ntfyEndpoint, ntfyUser, ntfyPass){
    var uri = `${apiUri}/v2/NotificationConnector/Ntfy`;
    PostData(uri, `{ "url": ${ntfyEndpoint}, "username": ${ntfyUser}, "password": ${ntfyPass} }`);
}

function ResetNtfy(){
    var uri = `${apiUri}/v2/NotificationConnector/Ntfy`;
    DeleteData(uri);
}

function TestNtfy(ntfyEndpoint, ntfyUser, ntfyPass){
    var uri = `${apiUri}/v2/NotificationConnector/Ntfy/Test`;
    PostData(uri, `{ "url": ${ntfyEndpoint}, "username": ${ntfyUser}, "password": ${ntfyPass} }`);
}

function UpdateUserAgent(userAgent){
    var uri = `${apiUri}/v2/Settings/UserAgent`;
    PostData(uri, `{ "value": ${userAgent} }`);
}

function UpdateRateLimit(rateLimitType, rateLimitValue) {
    var uri = `${apiUri}/v2/Settings/RateLimit/${rateLimitType}`;
    PostData(uri, `{ "value": ${rateLimitValue} }`);
}

function RemoveJob(jobId){
    var uri = `${apiUri}/v2/Job/${jobId}`;
    DeleteData(uri);
}

function CancelJob(jobId){
    var uri = `${apiUri}/v2/Job/${jobId}/Cancel`;
    PostData(uri);
}
