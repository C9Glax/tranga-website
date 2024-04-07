let apiUri = `${window.location.protocol}//${window.location.host}/api`

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
            'Accept': 'application/json',
        },
    });
    let json = await request.json();
    return json;
}

async function PostData(uri, data = null){
    let request = await fetch(uri, {
        method: 'POST',
		headers: { "Content-Type": "application/json" },	
		body: JSON.stringify(data)
    });
    console.log(request);
}

function DeleteData(uri, data = null){
    fetch(uri, {
        method: 'DELETE',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
    });
}

async function Ping(){
  let ret = await GetData(`${apiUri}/Ping`);
  return ret;
}

async function GetAvailableControllers(){
    var uri = apiUri + "/Connectors";
    let json = await GetData(uri);
    return json;
}

async function GetPublicationFromConnector(connector, title){
  var uri;
  if(title.includes("http")){
    uri = `${apiUri}/Manga/FromConnector?connector=${connector}&url=${title}`;
  }else{
    uri = `${apiUri}/Manga/FromConnector?connector=${connector}&title=${title}`;
  }
  let json = await GetData(uri);
  return json;
}

async function GetChapters(connector, internalId, language){
    var uri = `${apiUri}/Manga/Chapters?connector=${connector}&internalId=${internalId}&translatedLanguage=${language}`;
    let json = await GetData(uri);
    return json;
}

function GetCoverUrl(internalId){
  return `${apiUri}/Manga/Cover?internalId=${internalId}`;
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
  var uri = `${apiUri}/Jobs/MonitorJobs`;
  let json = await GetData(uri);
  return json;
}

async function GetProgress(jobId){
    var uri = `${apiUri}/Jobs/Progress?jobId=${jobId}`;
    let json = await GetData(uri);
    return json;
}

async function GetSettings(){
    var uri = `${apiUri}/Settings`;
    let json = await GetData(uri);
    return json;
}

async function GetAvailableNotificationConnectors(){
	var uri = `${apiUri}/NotificationConnectors/Types`;
	let json = await GetData(uri);
	return json;
}

async function GetNotificationConnectors(){
	var uri = `${apiUri}/NotificationConnectors`;
	let json = await GetData(uri);
	return json;
}

async function GetAvailableLibraryConnectors(){
	var uri = `${apiUri}/LibraryConnectors/Types`;
	let json = await GetData(uri);
	return json;
}

async function GetLibraryConnectors(){
	var uri = `${apiUri}/LibraryConnectors`;
	let json = await GetData(uri);
	return json;
}

async function GetRateLimits() {
    var uri = `${apiUri}/Settings/customRequestLimit`
    let json = await GetData(uri);
    return json;
}

function CreateMonitorJob(connector, id, language, interval = `03:00:00`){
    var uri = `${apiUri}/Jobs/MonitorManga?connector=${connector}&internalId=${internalId}&interval=${interval}&translatedLanguage=${language}`;
	var body = {
		"connector":connector,
		"internalId": id,
		"interval":interval,
		"translatedLanguage":language
	};
    PostData(uri, body);
}

function CreateDownloadNewChaptersJob(connector, id, language){
    var uri = `${apiUri}/Jobs/DownloadNewChapters`;
	var body = {
		"connector": connector,
		"internalId":id,
		"translatedLanguage":language
	};
    PostData(uri, body);
}

function StartJob(id){
    var uri = `${apiUri}/Jobs/StartNow`;
	var body = {
		"jobId":id
	};
    PostData(uri, body);
}

function UpdateDownloadLocation(downloadLocation){
    var uri = `${apiUri}/Settings/UpdateDownloadLocation`;
	var body = {
		"downloadLocation": downloadLocation
	};
    PostData(uri, body);	
}

function RefreshLibraryMetadata() {
    var uri = `${apiUri}/Jobs/UpdateMetadata`;
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

//Connectors
function UpdateConnector(connector, url = null, auth1 = null, auth2 = null){
	switch (connector) {
		case 'Komga':
			var uri = `${apiUri}/LibraryConnectors/Update`
			var body = {
				"libraryConnector":"Komga",
				"komgaUrl":url,
				"komgaAuth":auth1
			};
			break;
		case 'Kavita':
			var uri = `${apiUri}/LibraryConnectors/Update`
			var body = {
				"libraryConnector":"Kavita",
				"kavitaUrl":url,
				"kavitaUsername":auth1,
				"kavitaPassword":auth2
			};
			break;
		case 'Gotify':
			var uri = `${apiUri}/NotificationConnectors/Update`
			var body = {
				"notificationConnector":"Gotify",
				"gotifyUrl":url,
				"gotifyAppToken":auth1
			};
		case 'LunaSea':
			var uri = `${apiUri}/NotificationConnectors/Update`
			var body = {
				"notificationConnector":"LunaSea",
				"lunaseaWebhook":lunaseaWebhook
			};
		case 'Ntfy':
			var uri = `${apiUri}/NotificationConnectors/Update`
			var body = {
				"notificationConnector":"Ntfy",
				"ntfyUrl":url,
				"ntfyAuth":auth1
			};
		default:
			console.log("Error, unknown connector: ${connector}");
	};
	PostData(uri, body);
}

function TestConnector(connector, url = null, auth1 = null, auth2 = null){
	switch (connector) {
		case 'Komga':
			var uri = `${apiUri}/LibraryConnectors/Test`
			var body = {
				"libraryConnector":"Komga",
				"komgaUrl":url,
				"komgaAuth":auth1
			};
			break;
		case 'Kavita':
			var uri = `${apiUri}/LibraryConnectors/Test`
			var body = {
				"libraryConnector":"Kavita",
				"kavitaUrl":url,
				"kavitaUsername":auth1,
				"kavitaPassword":auth2
			};
			break;
		case 'Gotify':
			var uri = `${apiUri}/NotificationConnectors/Test`
			var body = {
				"notificationConnector":"Gotify",
				"gotifyUrl":url,
				"gotifyAppToken":auth1
			};
		case 'LunaSea':
			var uri = `${apiUri}/NotificationConnectors/Test`
			var body = {
				"notificationConnector":"LunaSea",
				"lunaseaWebhook":lunaseaWebhook
			};
		case 'Ntfy':
			var uri = `${apiUri}/NotificationConnectors/Test`
			var body = {
				"notificationConnector":"Ntfy",
				"ntfyUrl":url,
				"ntfyAuth":auth1
			};
		default:
			console.log("Error, unknown connector: ${connector}");
	};
	PostData(uri, body);
}

function ResetConnector(connector){
	switch (connector) {
		case 'Komga':
			var uri = `${apiUri}/LibraryConnectors`
			var body = {
				"libraryConnectors":"Komga"
			};
			break;
		case 'Kavita':
			var uri = `${apiUri}/LibraryConnectors`
			var body = {
				"libraryConnector":"Kavita"
			};
			break;
		case 'Gotify':
			var uri = `${apiUri}/NotificationConnectors`
			var body = {
				"notificationConnector":"Gotify"
			};
		case 'LunaSea':
			var uri = `${apiUri}/NotificationConnectors`
			var body = {
				"notificationConnector":"LunaSea"
			};
		case 'Ntfy':
			var uri = `${apiUri}/NotificationConnectors`
			var body = {
				"notificationConnector":"Ntfy"
			};
		default:
			console.log("Error, unknown connector: ${connector}");
	};
	DeleteData(uri, body);
}

function UpdateUserAgent(agent){
    var uri = `${apiUri}/Settings/userAgent`;
	var body = {
		"userAgent": agent
	};
    PostData(uri, body);
}

function UpdateRateLimit(byteValue, rateLimit) {
    var uri = `${apiUri}/Settings/customRequestLimit`;
	var body = {
		"requestType": byteValue,
		"requestsPerMinute": rateLimit
	};
    PostData(uri, body);
}

function RemoveJob(id){
    var uri = `${apiUri}/Jobs`;
	var body = {
		"jobId": id
	};
    DeleteData(uri, body);
}

function CancelJob(jobId){
    var uri = `${apiUri}/Jobs/Cancel?jobId=${jobId}`;
    PostData(uri);
}

async function GetLogmessages(count){
	var uri = `${apiUri}/LogMessages?count=${count}`;
	let json = await GetData(uri);
    console.log(json);
	return json;
}