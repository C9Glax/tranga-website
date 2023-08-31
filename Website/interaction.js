let jobs = [];
let notificationConnectorTypes = [];
let libraryConnectorTypes = [];

function Setup(){
  GetAvailableNotificationConnectors().then((json) => {
    json.forEach(connector => {
      notificationConnectorTypes[connector.Key] = connector.Value;
    });
  });

  GetAvailableLibraryConnectors().then((json) => {
    json.forEach(connector => {
      libraryConnectorTypes[connector.Key] = connector.Value;
    });
  });
  
  GetMonitorJobs().then((json) => {
    json.forEach(job => {
      if(!jobs.includes(job)){
        jobs.push(job);
      }
    });
  });
}
Setup();


const searchBox = document.querySelector("#searchbox");
const settingsPopup = document.querySelector("#settingsPopup");
const settingsCog = document.querySelector("#settingscog");
const tasksContent = document.querySelector("content");
const createMonitorTaskButton = document.querySelector("#createMonitorTaskButton");
const createDownloadChapterTaskButton = document.querySelector("#createDownloadChapterTaskButton");
const publicationViewerPopup = document.querySelector("#publicationViewerPopup");
const publicationViewerWindow = document.querySelector("publication-viewer");
const publicationViewerDescription = document.querySelector("#publicationViewerDescription");
const publicationViewerName = document.querySelector("#publicationViewerName");
const publicationViewerTags = document.querySelector("#publicationViewerTags");
const publicationViewerAuthor = document.querySelector("#publicationViewerAuthor");
const pubviewcover = document.querySelector("#pubviewcover");
const publicationDelete = document.querySelector("publication-delete");
const publicationTaskStart = document.querySelector("publication-starttask");
const settingDownloadLocation = document.querySelector("#downloadLocation");
const settingKomgaUrl = document.querySelector("#komgaUrl");
const settingKomgaUser = document.querySelector("#komgaUsername");
const settingKomgaPass = document.querySelector("#komgaPassword");
const settingKavitaUrl = document.querySelector("#kavitaUrl");
const settingKavitaUser = document.querySelector("#kavitaUsername");
const settingKavitaPass = document.querySelector("#kavitaPassword");
const settingGotifyUrl = document.querySelector("#gotifyUrl");
const settingGotifyAppToken = document.querySelector("#gotifyAppToken");
const settingLunaseaWebhook = document.querySelector("#lunaseaWebhook");
const settingKomgaConfigured = document.querySelector("#komgaConfigured");
const settingKavitaConfigured = document.querySelector("#kavitaConfigured");
const settingGotifyConfigured = document.querySelector("#gotifyConfigured");
const settingLunaseaConfigured = document.querySelector("#lunaseaConfigured");
const settingApiUri = document.querySelector("#settingApiUri");

ResetContent();
function ResetContent(){
    //Delete everything
    tasksContent.replaceChildren();
    
    //Add "Add new Task" Button
    var add = document.createElement("div");
    add.setAttribute("id", "addPublication")
    var plus = document.createElement("p");
    plus.innerText = "+";
    add.appendChild(plus);
    add.addEventListener("click", () => ShowNewTaskWindow());
    tasksContent.appendChild(add);
}

//Returns a new "Publication" Item to display in the jobs section
function CreatePublication(publication, connector){
    var publicationElement = document.createElement('publication');
    publicationElement.setAttribute("id", publication.internalId);
    var img = document.createElement('img');
    img.src = `imageCache/${publication.coverFileNameInCache}`;
    publicationElement.appendChild(img);
    var info = document.createElement('publication-information');
    var connectorName = document.createElement('connector-name');
    connectorName.innerText = connector;
    connectorName.className = "pill";
    info.appendChild(connectorName);
    var publicationName = document.createElement('publication-name');
    publicationName.innerText = publication.sortName;
    info.appendChild(publicationName);
    publicationElement.appendChild(info);
    if(publications.filter(pub => pub.internalId === publication.internalId) < 1)
        publications.push(publication);
    return publicationElement;
}

function ShowPublicationViewerWindow(publicationId, event, add){
    //Show popup
    publicationViewerPopup.style.display = "block";
    
    //Set position to mouse-position
    if(event.clientY < window.innerHeight - publicationViewerWindow.offsetHeight)
        publicationViewerWindow.style.top = `${event.clientY}px`;
    else
        publicationViewerWindow.style.top = `${event.clientY - publicationViewerWindow.offsetHeight}px`;
    
    if(event.clientX < window.innerWidth - publicationViewerWindow.offsetWidth)
        publicationViewerWindow.style.left = `${event.clientX}px`;
    else
        publicationViewerWindow.style.left = `${event.clientX - publicationViewerWindow.offsetWidth}px`;
    
    //Edit information inside the window
    var publication = publications.filter(pub => pub.internalId === publicationId)[0];
    publicationViewerName.innerText = publication.sortName;
    publicationViewerTags.innerText = publication.tags.join(", ");
    publicationViewerDescription.innerText = publication.description;
    publicationViewerAuthor.innerText = publication.authors.join(',');
    pubviewcover.src = `imageCache/${publication.coverFileNameInCache}`;
    toEditId = publicationId;
    
    //Check what action should be listed
    if(add){
        createMonitorTaskButton.style.display = "initial";
        createDownloadChapterTaskButton.style.display = "initial";
        publicationDelete.style.display = "none";
        publicationTaskStart.style.display = "none";
    }
    else{
        createMonitorTaskButton.style.display = "none";
        createDownloadChapterTaskButton.style.display = "none";
        publicationDelete.style.display = "initial";
        publicationTaskStart.style.display = "initial";
    }
}

function HidePublicationPopup(){
    publicationViewerPopup.style.display = "none";
}

searchBox.addEventListener("keyup", () => FilterResults());

//Filter shown jobs
function FilterResults(){
    if(searchBox.value.length > 0){
        tasksContent.childNodes.forEach(publication => {
            publication.childNodes.forEach(item => {
                if(item.nodeName.toLowerCase() == "publication-information"){
                    item.childNodes.forEach(information => {
                        if(information.nodeName.toLowerCase() == "publication-name"){
                            if(!information.textContent.toLowerCase().includes(searchBox.value.toLowerCase())){
                                publication.style.display = "none";
                            }else{
                                publication.style.display = "initial";
                            }
                        }
                    });
                }
            });
        });
    }else{
        tasksContent.childNodes.forEach(publication => publication.style.display = "initial");
    }
}

settingsCog.addEventListener("click", () => {
  OpenSettings();
  settingsPopup.style.display = "flex";
});

settingKomgaUrl.addEventListener("keypress", (event) => { { if(event.key === "Enter") UpdateSettings(); } });
settingKomgaUser.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKomgaPass.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKavitaUrl.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKavitaUser.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKavitaPass.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingGotifyUrl.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingGotifyAppToken.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingLunaseaWebhook.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingApiUri.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });

function OpenSettings(){
  settingGotifyConfigured.innerText = "❌";
  settingLunaseaConfigured.innerText = "❌";
  settingKavitaConfigured.innerText = "❌";
  settingKomgaConfigured.innerText = "❌";
  settingKomgaUrl.value = "";
  settingKomgaUser.value = "";
  settingKomgaPass.value = "";
  settingKavitaUrl.value = "";
  settingKavitaUser.value = "";
  settingKavitaPass.value = "";
  settingGotifyUrl.value = "";
  settingGotifyAppToken.value = "";
  settingLunaseaWebhook.value = "";
  settingApiUri.value = "";
  
  GetSettings().then((json) => {
    //console.log(json);
    settingDownloadLocation.innerText = json.downloadLocation;
    settingApiUri.placeholder = apiUri;
  });
  GetLibraryConnectors().then((json) => {
    //console.log(json);
    json.forEach(connector => {
      switch(libraryConnectorTypes[connector.libraryType]){
        case "Kavita":
          settingKavitaConfigured.innerText = "✅";
          settingKavitaUrl.placeholder = connector.baseUrl;
          settingKavitaUser.placeholder = "***";
          settingKavitaPass.placeholder = "***";
          break;
        case "Komga":
          settingKomgaConfigured.innerText = "✅";
          settingKomgaUrl.placeholder = connector.baseUrl;
          settingKomgaUser.placeholder = "***";
          settingKomgaPass.placeholder = "***";
          break;
        default:
          console.log("Unknown type");
          console.log(connector);
          break;
      }
    });
  });
  GetNotificationConnectors().then((json) => {
    //console.log(json);
    json.forEach(connector => {
      switch(notificationConnectorTypes[connector.notificationConnectorType]){
        case "Gotify":
          settingGotifyUrl.placeholder = connector.endpoint;
          settingGotifyAppToken.placeholder = "***";
          settingGotifyConfigured.innerText = "✅";
          break;
        case "LunaSea":
          settingLunaseaConfigured.innerText = "✅";
          settingLunaseaWebhook.placeholder = connector.id;
          break;
        default:
          console.log("Unknown type");
          console.log(connector);
          break;
      }
    });
  });
}

function UpdateSettings(){
  if(settingApiUri.value != ""){
    apiUri = settingApiUri.value;
    setCookie("apiUri", apiUri);
    Setup();
  }
  
  if(settingKomgaUrl.value != "" &&
     settingKomgaUser.value != "" &&
     settingKomgaPass.value != ""){
    UpdateKomga(settingKomgaUrl.value, utf8_to_b64(`${settingKomgaUser.value}:${settingKomgaPass.value}`));
  }
  
  if(settingKavitaUrl.value != "" &&
    settingKavitaUser.value != "" &&
    settingKavitaPass.value != ""){
    UpdateKavita(settingKavitaUrl.value, settingKavitaUser.value, settingKavitaPass.value);
  }
  
  if(settingGotifyUrl.value != "" &&
    settingGotifyAppToken.value != ""){
    UpdateGotify(settingGotifyUrl.value, settingGotifyAppToken.value);
  }
  
  if(settingLunaseaWebhook.value != ""){
    UpdateLunaSea(settingLunaseaWebhook.value);
  }
  
  OpenSettings();
}

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent( str )));
}
