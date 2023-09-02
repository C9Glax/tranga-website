let apiUri = `http://${window.location.host.split(':')[0]}:6531`

if(getCookie("apiUri") != ""){
    apiUri = getCookie("apiUri");
}
setCookie("apiUri", apiUri);

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

function PostData(uri){
    fetch(uri, {
        method: 'POST'
    });
}

function DeleteData(uri){
    fetch(uri, {
        method: 'DELETE'
    });
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

async function GetChapters(connector, internalId){
    var uri = `${apiUri}/Manga/Chapters?connector=${connector}&internalId=${internalId}`;
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

function CreateMonitorJob(connector, internalId){
    var uri = `${apiUri}/Jobs/MonitorManga?connector=${connector}&internalId=${internalId}&interval=03:00:00`;
    PostData(uri);
}

function CreateDownloadNewChaptersJob(connector, internalId){
    var uri = `${apiUri}/Jobs/DownloadNewChapters?connector=${connector}&internalId=${internalId}`;
    PostData(uri);
}

function StartJob(jobId){
    var uri = `${apiUri}/Jobs/StartNow?jobId=${jobId}`;
    PostData(uri);
}

function UpdateDownloadLocation(downloadLocation){
    var uri = `${apiUri}/Settings/UpdateDownloadLocation?downloadLocation=${downloadLocation}`;
    PostData(uri);	
}

function UpdateKomga(komgaUrl, komgaAuth){
    var uri = `${apiUri}/LibraryConnectors/Update?libraryConnector=Komga&komgaUrl=${komgaUrl}&komgaAuth=${komgaAuth}`;
    PostData(uri);
}

function UpdateKavita(kavitaUrl, kavitaUsername, kavitaPassword){
    var uri = `${apiUri}/LibraryConnectors/Update?libraryConnector=Kavita&kavitaUrl=${kavitaUrl}&kavitaUsername=${kavitaUsername}&kavitaPassword={kavitaPassword}`;
    PostData(uri);
}

function UpdateGotify(gotifyUrl, gotifyAppToken){
    var uri = `${apiUri}/NotificationConnectors/Update?notificationConnector=Gotify&gotifyUrl=${gotifyUrl}&gotifyAppToken=${gotifyAppToken}`;
    PostData(uri);
}

function UpdateLunaSea(lunaseaWebhook){
    var uri = `${apiUri}/NotificationConnectors/Update?notificationConnector=LunaSea&lunaseaWebhook=${lunaseaWebhook}`;
    PostData(uri);
}

function RemoveJob(jobId){
    var uri = `${apiUri}/Jobs?jobId=${jobId}`;
    DeleteData(uri);
}

function CancelJob(jobId){
    var uri = `${apiUri}/Jobs/Cancel?jobId=${jobId}`;
    PostData(uri);
}