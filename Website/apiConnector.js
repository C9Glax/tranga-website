let apiUri = `${window.location.protocol}//${window.location.host}/api`;

// if(getCookie("apiUri") != ""){
//     apiUri = getCookie("apiUri");
// }
// setCookie("apiUri", apiUri);

function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";path=/;samesite=strict";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

async function GetData(uri) {
  let request = await fetch(uri, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  let json = await request.json();
  return json;
}

async function PostData(uri) {
  let request = await fetch(uri, {
    method: "POST",
  });
  //console.log(request);
}

function DeleteData(uri) {
  fetch(uri, {
    method: "DELETE",
  });
}

async function Ping() {
  let ret = await GetData(`${apiUri}/Ping`);
  return ret;
}

async function GetAvailableControllers() {
  var uri = apiUri + "/Connectors";
  let json = await GetData(uri);
  return json;
}

async function GetPublicationFromConnector(connector, title) {
  var uri;
  if (title.includes("http")) {
    uri = `${apiUri}/Manga/FromConnector?connector=${connector}&url=${title}`;
  } else {
    uri = `${apiUri}/Manga/FromConnector?connector=${connector}&title=${title}`;
  }
  let json = await GetData(uri);
  return json;
}

async function GetChapters(connector, internalId, language) {
  var uri = `${apiUri}/Manga/Chapters?connector=${connector}&internalId=${internalId}&translatedLanguage=${language}`;
  let json = await GetData(uri);
  return json;
}

function GetCoverUrl(internalId) {
  return `${apiUri}/Manga/Cover?internalId=${internalId}`;
}

async function GetAllJobs() {
  var uri = `${apiUri}/Jobs`;
  let json = await GetData(uri);
  return json;
}

async function GetRunningJobs() {
  var uri = `${apiUri}/Jobs/Running`;
  let json = await GetData(uri);
  return json;
}

async function GetWaitingJobs() {
  var uri = `${apiUri}/Jobs/Waiting`;
  let json = await GetData(uri);
  return json;
}

async function GetMonitorJobs() {
  var uri = `${apiUri}/Jobs/MonitorJobs`;
  let json = await GetData(uri);
  return json;
}

async function GetProgress(jobId) {
  var uri = `${apiUri}/Jobs/Progress?jobId=${jobId}`;
  let json = await GetData(uri);
  return json;
}

async function GetSettings() {
  var uri = `${apiUri}/Settings`;
  let json = await GetData(uri);
  return json;
}

async function GetAvailableNotificationConnectors() {
  var uri = `${apiUri}/NotificationConnectors/Types`;
  let json = await GetData(uri);
  return json;
}

async function GetNotificationConnectors() {
  var uri = `${apiUri}/NotificationConnectors`;
  let json = await GetData(uri);
  return json;
}

async function GetAvailableLibraryConnectors() {
  var uri = `${apiUri}/LibraryConnectors/Types`;
  let json = await GetData(uri);
  return json;
}

async function GetLibraryConnectors() {
  var uri = `${apiUri}/LibraryConnectors`;
  let json = await GetData(uri);
  return json;
}

async function GetRateLimits() {
  var uri = `${apiUri}/Settings/customRequestLimit`;
  let json = await GetData(uri);
  return json;
}

function CreateMonitorJob(connector, internalId, language) {
  var uri = `${apiUri}/Jobs/MonitorManga?connector=${connector}&internalId=${internalId}&interval=03:00:00&translatedLanguage=${language}`;
  PostData(uri);
}

function CreateDownloadNewChaptersJob(connector, internalId, language) {
  var uri = `${apiUri}/Jobs/DownloadNewChapters?connector=${connector}&internalId=${internalId}&translatedLanguage=${language}`;
  PostData(uri);
}

function StartJob(jobId) {
  var uri = `${apiUri}/Jobs/StartNow?jobId=${jobId}`;
  PostData(uri);
}

function UpdateDownloadLocation(downloadLocation) {
  var uri = `${apiUri}/Settings/UpdateDownloadLocation?downloadLocation=${downloadLocation}`;
  PostData(uri);
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
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset-utf-8," + encodeURIComponent(result),
      );
      var newDate = new Date();
      var filename =
        "Tranga_Logs_" + newDate.today() + "_" + newDate.timeNow() + ".log";
      element.setAttribute("download", filename);
      element.click();
    });
}

//Following date-time code taken from: https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
// For todays date;
Date.prototype.today = function () {
  return (
    (this.getDate() < 10 ? "0" : "") +
    this.getDate() +
    "/" +
    (this.getMonth() + 1 < 10 ? "0" : "") +
    (this.getMonth() + 1) +
    "/" +
    this.getFullYear()
  );
};

// For the time now
Date.prototype.timeNow = function () {
  return (
    (this.getHours() < 10 ? "0" : "") +
    this.getHours() +
    "_" +
    (this.getMinutes() < 10 ? "0" : "") +
    this.getMinutes() +
    "_" +
    (this.getSeconds() < 10 ? "0" : "") +
    this.getSeconds()
  );
};

//Komga
function UpdateKomga(komgaUrl, komgaAuth) {
  var uri = `${apiUri}/LibraryConnectors/Update?libraryConnector=Komga&komgaUrl=${komgaUrl}&komgaAuth=${komgaAuth}`;
  PostData(uri);
}

function ResetKomga() {
  var uri = `${apiUri}/LibraryConnectors/Reset?libraryConnector=Komga`;
  PostData(uri);
}

function TestKomga(komgaUrl, komgaAuth) {
  var uri = `${apiUri}/LibraryConnectors/Test?libraryConnector=Komga&komgaUrl=${komgaUrl}&komgaAuth=${komgaAuth}`;
  PostData(uri);
}

//Kavita
function UpdateKavita(kavitaUrl, kavitaUsername, kavitaPassword) {
  var uri = `${apiUri}/LibraryConnectors/Update?libraryConnector=Kavita&kavitaUrl=${kavitaUrl}&kavitaUsername=${kavitaUsername}&kavitaPassword=${kavitaPassword}`;
  PostData(uri);
}

function ResetKavita() {
  var uri = `${apiUri}/LibraryConnectors/Reset?libraryConnector=Kavita`;
  PostData(uri);
}

function TestKavita(kavitaUrl, kavitaUsername, kavitaPassword) {
  var uri = `${apiUri}/LibraryConnectors/Test?libraryConnector=Kavita&kavitaUrl=${kavitaUrl}&kavitaUsername=${kavitaUsername}&kavitaPassword=${kavitaPassword}`;
  PostData(uri);
}

//Gotify
function UpdateGotify(gotifyUrl, gotifyAppToken) {
  var uri = `${apiUri}/NotificationConnectors/Update?notificationConnector=Gotify&gotifyUrl=${gotifyUrl}&gotifyAppToken=${gotifyAppToken}`;
  PostData(uri);
}

function ResetGotify() {
  var uri = `${apiUri}/NotificationConnectors/Reset?notificationConnector=Gotify`;
  PostData(uri);
}

function TestGotify(gotifyUrl, gotifyAppToken) {
  var uri = `${apiUri}/NotificationConnectors/Test?notificationConnector=Gotify&gotifyUrl=${gotifyUrl}&gotifyAppToken=${gotifyAppToken}`;
  PostData(uri);
}

//LunaSea
function UpdateLunaSea(lunaseaWebhook) {
  var uri = `${apiUri}/NotificationConnectors/Update?notificationConnector=LunaSea&lunaseaWebhook=${lunaseaWebhook}`;
  PostData(uri);
}

function ResetLunaSea() {
  var uri = `${apiUri}/NotificationConnectors/Reset?notificationConnector=LunaSea`;
  PostData(uri);
}

function TestLunaSea(lunaseaWebhook) {
  var uri = `${apiUri}/NotificationConnectors/Test?notificationConnector=LunaSea&lunaseaWebhook=${lunaseaWebhook}`;
  PostData(uri);
}

//Ntfy
function UpdateNtfy(ntfyEndpoint, ntfyAuth) {
  var uri = `${apiUri}/NotificationConnectors/Update?notificationConnector=Ntfy&ntfyUrl=${ntfyEndpoint}&ntfyAuth=${ntfyAuth}`;
  PostData(uri);
}

function ResetNtfy() {
  var uri = `${apiUri}/NotificationConnectors/Reset?notificationConnector=Ntfy`;
  PostData(uri);
}

function TestNtfy(ntfyEndpoint, ntfyAuth) {
  var uri = `${apiUri}/NotificationConnectors/Test?notificationConnector=Ntfy&ntfyUrl=${ntfyEndpoint}&ntfyAuth=${ntfyAuth}`;
  PostData(uri);
}

function UpdateUserAgent(userAgent) {
  var uri = `${apiUri}/Settings/userAgent?userAgent=${userAgent}`;
  PostData(uri);
}

function UpdateRateLimit(byteValue, rateLimit) {
  var uri = `${apiUri}/Settings/customRequestLimit?requestType=${byteValue}&requestsPerMinute=${rateLimit}`;
  PostData(uri);
}

function RemoveJob(jobId) {
  var uri = `${apiUri}/Jobs?jobId=${jobId}`;
  DeleteData(uri);
}

function CancelJob(jobId) {
  var uri = `${apiUri}/Jobs/Cancel?jobId=${jobId}`;
  PostData(uri);
}

async function GetLogmessages(count) {
  var uri = `${apiUri}/LogMessages?count=${count}`;
  let json = await GetData(uri);
  console.log(json);
  return json;
}
