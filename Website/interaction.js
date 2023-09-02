let jobs = [];
let notificationConnectorTypes = [];
let libraryConnectorTypes = [];
let selectedManga;
let selectedJob;

const searchBox = document.querySelector("#searchbox");
const settingsPopup = document.querySelector("#settingsPopup");
const settingsCog = document.querySelector("#settingscog");
const tasksContent = document.querySelector("content");
const createMonitorTaskButton = document.querySelector("#createMonitoJobButton");
const createDownloadChapterTaskButton = document.querySelector("#createDownloadChapterJobButton");
const startJobButton = document.querySelector("#startJobButton");
const cancelJobButton = document.querySelector("#cancelJobButton");
const deleteJobButton = document.querySelector("#deleteJobButton");
const mangaViewerPopup = document.querySelector("#publicationViewerPopup");
const mangaViewerWindow = document.querySelector("publication-viewer");
const mangaViewerDescription = document.querySelector("#publicationViewerDescription");
const mangaViewerName = document.querySelector("#publicationViewerName");
const mangaViewerTags = document.querySelector("#publicationViewerTags");
const mangaViewerAuthor = document.querySelector("#publicationViewerAuthor");
const mangaViewCover = document.querySelector("#pubviewcover");
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
const newMangaPopup = document.querySelector("#newMangaPopup");
const newMangaConnector = document.querySelector("#newMangaConnector");
const newMangaTitle = document.querySelector("#newMangaTitle");
const newMangaResult = document.querySelector("#newMangaResult");

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
  
  GetAvailableControllers().then((json) => {
    json.forEach(connector => {
      var option = document.createElement('option');
      option.value = connector;
      option.innerText = connector;
      newMangaConnector.appendChild(option);
    });
    
  });
}
Setup();

function ResetContent(){
    //Delete everything
    tasksContent.replaceChildren();
    
    //Add "Add new Task" Button
    var add = document.createElement("div");
    add.setAttribute("id", "addPublication")
    var plus = document.createElement("p");
    plus.innerText = "+";
    add.appendChild(plus);
    add.addEventListener("click", () => ShowNewMangaSearch());
    tasksContent.appendChild(add);
}

function ShowNewMangaSearch(){
  newMangaTitle.value = "";
  newMangaPopup.style.display = "block";
  newMangaResult.replaceChildren();
}

newMangaTitle.addEventListener("keypress", (event) => { if(event.key === "Enter") GetNewMangaItems();})
function GetNewMangaItems(){
  if(newMangaTitle.value.length < 4)
    return;
  
  newMangaResult.replaceChildren();
  newMangaConnector.disabled = true;
  newMangaTitle.disabled = true;
  GetPublicationFromConnector(newMangaConnector.value, newMangaTitle.value).then((json) => {
    //console.log(json);
    if(json.length > 0)
      newMangaResult.style.display = "flex";
    json.forEach(result => {
      var mangaElement = CreateManga(result, newMangaConnector.value)
      newMangaResult.appendChild(mangaElement);
      mangaElement.addEventListener("click", (event) => {
        ShowMangaWindow(null, result, event, true);
      });
    });
    
    newMangaConnector.disabled = false;
    newMangaTitle.disabled = false;
  });
}

//Returns a new "Publication" Item to display in the jobs section
function CreateManga(manga, connector){
    var mangaElement = document.createElement('publication');
    mangaElement.setAttribute("id", manga.internalId);
    var mangaImage = document.createElement('img');
    mangaImage.src = GetCoverUrl(manga.internalId);
    mangaElement.appendChild(mangaImage);
    var info = document.createElement('publication-information');
    var connectorName = document.createElement('connector-name');
    connectorName.innerText = connector;
    connectorName.className = "pill";
    info.appendChild(connectorName);
    var mangaName = document.createElement('publication-name');
    mangaName.innerText = manga.sortName;
    info.appendChild(mangaName);
    mangaElement.appendChild(info);
    return mangaElement;
}

createMonitorJobButton.addEventListener("click", () => {
  CreateMonitorJob(newMangaConnector.value, selectedManga.internalId);
  UpdateJobs();
  mangaViewerPopup.style.display = "none";
});
startJobButton.addEventListener("click", () => {
  StartJob(selectedJob.id);
  mangaViewerPopup.style.display = "none";
});
cancelJobButton.addEventListener("click", () => {
  CancelJob(selectedJob.id);
  mangaViewerPopup.style.display = "none";
});
deleteJobButton.addEventListener("click", () => {
  RemoveJob(selectedJob.id);
  UpdateJobs();
  mangaViewerPopup.style.display = "none";
});

function ShowMangaWindow(job, manga, event, add){
    selectedManga = manga;
    selectedJob = job;
    //Show popup
    mangaViewerPopup.style.display = "block";
    
    //Set position to mouse-position
    if(event.clientY < window.innerHeight - mangaViewerWindow.offsetHeight)
        mangaViewerWindow.style.top = `${event.clientY}px`;
    else
        mangaViewerWindow.style.top = `${event.clientY - mangaViewerWindow.offsetHeight}px`;
    
    if(event.clientX < window.innerWidth - mangaViewerWindow.offsetWidth)
        mangaViewerWindow.style.left = `${event.clientX}px`;
    else
        mangaViewerWindow.style.left = `${event.clientX - mangaViewerWindow.offsetWidth}px`;
    
    //Edit information inside the window
    mangaViewerName.innerText = manga.sortName;
    mangaViewerTags.innerText = manga.tags.join(", ");
    mangaViewerDescription.innerText = manga.description;
    mangaViewerAuthor.innerText = manga.authors.join(',');
    mangaViewCover.src = GetCoverUrl(manga.internalId);
    toEditId = manga.internalId;
    
    //Check what action should be listed
    if(add){
        createMonitorJobButton.style.display = "initial";
        createDownloadChapterJobButton.style.display = "initial";
        cancelJobButton.style.display = "none";
        startJobButton.style.display = "none";
        deleteJobButton.style.display = "none";
    }
    else{
        createMonitorJobButton.style.display = "none";
        createDownloadChapterJobButton.style.display = "none";
        cancelJobButton.style.display = "initial";
        startJobButton.style.display = "initial";
        deleteJobButton.style.display = "initial";
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


UpdateJobs();
setInterval(() => {
  UpdateJobs();
}, 1000);
function UpdateJobs(){
  GetMonitorJobs().then((json) => {
    ResetContent();
    console.log(json);
    json.forEach(job => {
      var mangaView = CreateManga(job.manga, job.mangaConnector.name);
      mangaView.addEventListener("click", (event) => {
        ShowMangaWindow(job, job.manga, event, false);
      });
      tasksContent.appendChild(mangaView);
    });
  });
}
