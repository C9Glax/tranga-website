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

function CreateMonitorJob(connector, internalId, language){
    var uri = `${apiUri}/Jobs/MonitorManga?connector=${connector}&internalId=${internalId}&interval=03:00:00&translatedLanguage=${language}`;
    PostData(uri);
}

function CreateDownloadNewChaptersJob(connector, internalId, language){
    var uri = `${apiUri}/Jobs/DownloadNewChapters?connector=${connector}&internalId=${internalId}&translatedLanguage=${language}`;
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

function ChangeStyleSheet(sheet){
    var uri = `${apiUri}/Settings/ChangeStyleSheet?styleSheet=${sheet}`;
    PostData(uri);
}

function RefreshLibraryMetadata() {
    var uri = `${apiUri}/Jobs/UpdateMetadata`;
    PostData(uri);
}

//Komga
function UpdateKomga(komgaUrl, komgaAuth){
    var uri = `${apiUri}/LibraryConnectors/Update?libraryConnector=Komga&komgaUrl=${komgaUrl}&komgaAuth=${komgaAuth}`;
    PostData(uri);
}

function ResetKomga(){
    var uri = `${apiUri}/LibraryConnectors/Reset?libraryConnector=Komga`;
}

function TestKomga(komgaUrl, komgaAuth){
    var uri = `${apiUri}/LibraryConnectors/Test?libraryConnector=Komga&komgaUrl=${komgaUrl}&komgaAuth=${komgaAuth}`;
    PostData(uri);
}


//Kavita
function UpdateKavita(kavitaUrl, kavitaUsername, kavitaPassword){
    var uri = `${apiUri}/LibraryConnectors/Update?libraryConnector=Kavita&kavitaUrl=${kavitaUrl}&kavitaUsername=${kavitaUsername}&kavitaPassword=${kavitaPassword}`;
    PostData(uri);
}

function ResetKavita(){
    var uri = `${apiUri}/LibraryConnectors/Reset?libraryConnector=Kavita`;
}

function TestKavita(kavitaUrl, kavitaUsername, kavitaPassword){
    var uri = `${apiUri}/LibraryConnectors/Test?libraryConnector=Kavita&kavitaUrl=${kavitaUrl}&kavitaUsername=${kavitaUsername}&kavitaPassword=${kavitaPassword}`;
    PostData(uri);
}

//Gotify
function UpdateGotify(gotifyUrl, gotifyAppToken){
    var uri = `${apiUri}/NotificationConnectors/Update?notificationConnector=Gotify&gotifyUrl=${gotifyUrl}&gotifyAppToken=${gotifyAppToken}`;
    PostData(uri);
}

function ResetGotify(){
    var uri = `${apiUri}/NotificationConnectors/Reset?libraryConnector=Gotify`;
}

function TestGotify(gotifyUrl, gotifyAppToken){
    var uri = `${apiUri}/NotificationConnectors/Test?notificationConnector=Gotify&gotifyUrl=${gotifyUrl}&gotifyAppToken=${gotifyAppToken}`;
    PostData(uri);
}

//LunaSea
function UpdateLunaSea(lunaseaWebhook){
    var uri = `${apiUri}/NotificationConnectors/Update?notificationConnector=LunaSea&lunaseaWebhook=${lunaseaWebhook}`;
    PostData(uri);
}

function ResetLunaSea(){
    var uri = `${apiUri}/NotificationConnectors/Reset?libraryConnector=LunaSea`;
}

function TestLunaSea(lunaseaWebhook){
    var uri = `${apiUri}/NotificationConnectors/Test?notificationConnector=LunaSea&lunaseaWebhook=${lunaseaWebhook}`;
    PostData(uri);
}

//Ntfy
function UpdateNtfy(ntfyEndpoint, ntfyAuth){
    var uri = `${apiUri}/NotificationConnectors/Update?notificationConnector=Ntfy&ntfyUrl=${ntfyEndpoint}&ntfyAuth=${ntfyAuth}`;
    PostData(uri);
}

function ResetNtfy(){
    var uri = `${apiUri}/NotificationConnectors/Reset?libraryConnector=Ntfy`;
}

function TestNtfy(ntfyEndpoint, ntfyAuth){
    var uri = `${apiUri}/NotificationConnectors/Test?notificationConnector=Ntfy&ntfyUrl=${ntfyEndpoint}&ntfyAuth=${ntfyAuth}`;
    PostData(uri);
}

function UpdateUserAgent(userAgent){
    var uri = `${apiUri}/Settings/userAgent?userAgent=${userAgent}`;
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

async function GetLogmessages(count){
	var uri = `${apiUri}/LogMessages?count=${count}`;
	let json = await GetData(uri);
    console.log(json);
	return json;
}