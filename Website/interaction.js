let monitoringJobsCount = 0;
let runningJobs = [];
let waitingJobs = [];
let notificationConnectorTypes = [];
let libraryConnectorTypes = [];
let selectedManga;
let selectedJob;
let searchMatch;

let connectorMatch = [];
let connectorNameMatch;
let statusMatch = [];
let statusNameMatch = [];

const searchBox = document.querySelector("#searchbox");
const settingsPopup = document.querySelector("#settingsPopup");
const filterBox = document.querySelector("#filterBox");
const filterContent = document.querySelector("#filterContent");
const settingsCog = document.querySelector("#settingscog");
const filterFunnel = document.querySelector("#filterFunnel");
const tasksContent = document.querySelector("content");
const createMonitorTaskButton = document.querySelector("#createMonitoJobButton");
const createDownloadChapterTaskButton = document.querySelector("#createDownloadChapterJobButton");
const startJobButton = document.querySelector("#startJobButton");
const cancelJobButton = document.querySelector("#cancelJobButton");
const deleteJobButton = document.querySelector("#deleteJobButton");

//Manga viewer popup
const mangaViewerPopup = document.querySelector("#publicationViewerPopup");
const mangaViewerWindow = document.querySelector("publication-viewer");
const mangaViewerDescription = document.querySelector("#publicationViewerDescription");
const mangaViewerName = document.querySelector("#publicationViewerName");
const mangaViewerTags = document.querySelector("#publicationViewerTags");
const mangaViewerAuthor = document.querySelector("#publicationViewerAuthor");
const mangaViewCover = document.querySelector("#pubviewcover");

//General Rate Limits
const defaultRL = document.querySelector("#defaultRL");
const coverRL = document.querySelector("#coverRL");
const imageRL = document.querySelector("#imageRL");
const infoRL = document.querySelector("#infoRL");

//MangaDex Rate Limits
const mDexFeedRL = document.querySelector("#mDexFeedRL");
const mDexImageRL = document.querySelector("#mDexImageRL");

//Komga
const settingKomgaUrl = document.querySelector("#komgaUrl");
const settingKomgaUser = document.querySelector("#komgaUsername");
const settingKomgaPass = document.querySelector("#komgaPassword");

//Kavita
const settingKavitaUrl = document.querySelector("#kavitaUrl");
const settingKavitaUser = document.querySelector("#kavitaUsername");
const settingKavitaPass = document.querySelector("#kavitaPassword");

//Gotify
const settingGotifyUrl = document.querySelector("#gotifyUrl");
const settingGotifyAppToken = document.querySelector("#gotifyAppToken");

//Lunasea
const settingLunaseaWebhook = document.querySelector("#lunaseaWebhook");

//Ntfy
const settingNtfyEndpoint = document.querySelector("#ntfyEndpoint");
const settingNtfyAuth = document.querySelector("#ntfyAuth");

//Connector Configured
const settingKomgaConfigured = document.querySelector("#komgaConfigured");
const settingKavitaConfigured = document.querySelector("#kavitaConfigured");
const settingGotifyConfigured = document.querySelector("#gotifyConfigured");
const settingLunaseaConfigured = document.querySelector("#lunaseaConfigured");
const settingNtfyConfigured = document.querySelector("#ntfyConfigured");

const settingUserAgent = document.querySelector("#userAgent");
const settingApiUri = document.querySelector("#settingApiUri");
const settingAprilFoolsMode = document.querySelector("#aprilFoolsMode");
const settingCSSStyle = document.querySelector('#cssStyle');
const settingDownloadLocation = [];

//Search and Add
const newMangaPopup = document.querySelector("#newMangaPopup");
const newMangaConnector = document.querySelector("#newMangaConnector");
const newMangaTitle = document.querySelector("#newMangaTitle");
const newMangaResult = document.querySelector("#newMangaResult");
const newMangaTranslatedLanguage = document.querySelector("#newMangaTranslatedLanguage");
const newMangaLoader = document.querySelector("popup-content #loaderdiv");

//Jobs
const jobsRunningTag = document.querySelector("#jobsRunningTag");
const jobsQueuedTag = document.querySelector("#jobsQueuedTag");
const loaderdiv = document.querySelector('#loaderdiv');
const jobStatusView = document.querySelector("#jobStatusView");
const jobStatusRunning = document.querySelector("#jobStatusRunning");
const jobStatusWaiting = document.querySelector("#jobStatusWaiting");

function Setup(){
  Ping().then((ret) => {
    loaderdiv.style.display = 'none';
    
    GetAvailableNotificationConnectors().then((json) => {
      //console.log(json);
      json.forEach(connector => {
        notificationConnectorTypes[connector.Key] = connector.Value;
      });
    });

    GetAvailableLibraryConnectors().then((json) => {
      //console.log(json);
      json.forEach(connector => {
        libraryConnectorTypes[connector.Key] = connector.Value;
      });
    });

    GetAvailableControllers().then((json) => {
      //console.log(json);
      newMangaConnector.replaceChildren();
      connectorFilterBox = document.querySelector("#connectorFilterBox");
      connectorFilterBox.replaceChildren();
      json.forEach(connector => {
        //Add the connector to the New Manga dropdown        
        var option = document.createElement('option');
        option.value = connector;
        option.innerText = connector;
        newMangaConnector.appendChild(option);

        //Add the connector to the filter box
        connectorFilter = document.createElement('connector-name');
        connectorFilter.innerText = connector;
        connectorFilter.className = "pill";
        connectorFilter.style.backgroundColor = stringToColour(connector);

        connectorFilter.addEventListener("click", (event) => {
          ToggleFilterConnector(connector, event);
        });
        connectorFilterBox.appendChild(connectorFilter);
      });
    });

    //Add the publication status options to the filter bar
    publicationStatusOptions = ["Ongoing", "Completed", "On Hiatus", "Cancelled", "Upcoming", "Status Unavailable"]; 
    statusFilterBox = document.querySelector("#statusFilterBox");
    statusFilterBox.replaceChildren();
    publicationStatusOptions.forEach(publicationStatus => {
      var releaseStatus = document.createElement('status-filter');
      releaseStatus.innerText = publicationStatus;
      releaseStatus.setAttribute("release-status", publicationStatus);
      releaseStatus.addEventListener("click", (event) => {
        ToggleFilterStatus(publicationStatus, event);
      });

      statusFilterBox.appendChild(releaseStatus);
    });
    
    ResetContent();
    UpdateJobs();
    GetSettings().then((json) => {
      //console.log(json);
      settingApiUri.placeholder = apiUri;
      settingDownloadLocation.value = json.downloadLocation;
      settingUserAgent.value = json.userAgent;
      settingAprilFoolsMode.checked = json.aprilFoolsMode;
    });
    GetRateLimits().then((json) => {
      defaultRL.placeholder = json.Default + ' Requests/Minute';
      coverRL.placeholder = json.MangaCover + ' Requests/Minute';
      imageRL.placeholder = json.MangaImage + ' Requests/Minute';
      infoRL.placeholder = json.MangaInfo + ' Requests/Minute';
      mDexFeedRL.placeholder = json.MangaDexFeed + ' Requests/Minute';
      mDexImageRL.placeholder = json.MangaDexImage + ' Requests/Minute';
    });

    //If the cssStyle key isn't in the local storage of the browser, then set the css style to the default and load the page
    //Otherwise get the style key from storage and set it.
    if (!localStorage.getItem('cssStyle')) {
      localStorage.setItem('cssStyle', 'card_compact');
      document.getElementById('librarystyle').setAttribute('href', 'styles/' + localStorage.getItem('cssStyle') + '.css');
      document.getElementById('card_compact').selected = true;
    } else {
      css_style = localStorage.getItem('cssStyle');
      document.getElementById('librarystyle').setAttribute('href', 'styles/' + css_style + '.css');
      document.getElementById(css_style).selected = true;
    }
    setInterval(() => {
      UpdateJobs();
    }, 1000);
  });
  //Clear the previous values if any exist.
  searchBox.value = "";
  connectorMatch.length = 0;
  statusMatch.length = 0;
}
Setup();

function ToggleFilterBox() {
  if (filterBox.style.display == 'none') {
    filterBox.style.display = 'flex';
  } else {
    filterBox.style.display = 'none';
  }
  filterContent.scrollTop = 0;
}

function ToggleFilterConnector(connector, event) {
  //console.log("Initial Array:");
  //console.log(connectorMatch);
  if (connectorMatch.includes(connector)) {
    idx = connectorMatch.indexOf(connector);
    connectorMatch.splice(idx, 1);
    event.target.style.outline = 'none';
    event.target.style.outlineOffset = "0px";
  } else {
    connectorMatch.push(connector);
    event.target.style.outline = '4px solid var(--secondary-color)';
    event.target.style.outlineOffset = '3px';
  }
  //console.log("Final Array");
  //console.log(connectorMatch);
  FilterResults();
}

function ToggleFilterStatus(status, event) {
  //console.log("Initial Array:");
  //console.log(statusMatch);
  if (statusMatch.includes(status)) {
    idx = statusMatch.indexOf(status);
    statusMatch.splice(idx, 1);
    event.target.style.outline = 'none';
    event.target.style.outlineOffset = "0px";
  } else {
    statusMatch.push(status);
    event.target.style.outline = '4px solid var(--secondary-color)';
    event.target.style.outlineOffset = '3px';
  }
  //console.log("Final Array");
  //console.log(statusMatch);
  FilterResults();
}

function ClearFilter() {
  searchBox.value = "";
  statusMatch.length = 0;
  connectorMatch.length = 0;
  FilterResults();

  //Get rid of the outlines
  connectorFilterBox = document.querySelector("#connectorFilterBox");
  connectorFilterBox.childNodes.forEach(connector => {
    if (connector.nodeName.toLowerCase() == 'connector-name') {
      connector.style.outline = 'none';
      connector.style.outlineOffset = "0px";
    }
  });

  statusFilterBox = document.querySelector("#statusFilterBox");
  statusFilterBox.childNodes.forEach(publicationStatus => {
    if (publicationStatus.nodeName.toLowerCase() == 'status-filter') {
      publicationStatus.style.outline = 'none';
      publicationStatus.style.outlineOffset = "0px";
    }
  });
}

settingCSSStyle.addEventListener("change", (event) => {
  localStorage.setItem('cssStyle', settingCSSStyle.value);
  document.getElementById('librarystyle').setAttribute('href', 'styles/' + localStorage.getItem('cssStyle') + '.css');
}); 

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

    //Populate with the monitored mangas
    GetMonitorJobs().then((json) => {
        //console.log(json);
        json.forEach(job => {
          var mangaView = CreateManga(job.manga, job.mangaConnector.name);
          mangaView.addEventListener("click", (event) => {
            ShowMangaWindow(job, job.manga, event, false);
          });
          tasksContent.appendChild(mangaView);
        });
        monitoringJobsCount = json.length;
    });
}

function ShowNewMangaSearch(){
  newMangaTitle.value = "";
  newMangaPopup.style.display = "block";
  newMangaResult.replaceChildren();
  newMangaLoader.style.display = 'none';
}

newMangaTitle.addEventListener("keypress", (event) => { if(event.key === "Enter") GetNewMangaItems();});

function GetNewMangaItems(){
  
  if(newMangaTitle.value.length < 4) {
    return;
  }
  newMangaResult.replaceChildren();
  newMangaConnector.disabled = true;
  newMangaTitle.disabled = true;
  newMangaTranslatedLanguage.disabled = true;
  newMangaLoader.style.display = 'block';
  GetPublicationFromConnector(newMangaConnector.value, newMangaTitle.value).then((json) => {
    //console.log(json);
    newMangaLoader.style.display = 'none';
    newMangaResult.scrollTop = 0;
    if(json.length > 0)
      newMangaResult.style.display = "flex";
    json.forEach(result => {
      var searchResult = CreateSearchResult(result, newMangaConnector.value)
      newMangaResult.appendChild(searchResult);
    });
    
    newMangaConnector.disabled = false;
    newMangaTitle.disabled = false;
  newMangaTranslatedLanguage.disabled = false;
  });
}

//Returns a new "Publication" Item to display in the jobs section
function CreateManga(manga, connector){
  //Create a new publication and set an internal ID
    var mangaElement = document.createElement('publication');
    mangaElement.id = GetValidSelector(manga.internalId);
    
  //Append the cover image to the publication
    var mangaImage = document.createElement('img');
    mangaImage.src = GetCoverUrl(manga.internalId);
    mangaElement.appendChild(mangaImage);
  
//Append the publication information to the publication
    //console.log(manga);
    var info = document.createElement('publication-information');
    var connectorName = document.createElement('connector-name');
    connectorName.innerText = connector;
    connectorName.className = "pill";
    connectorName.style.backgroundColor = stringToColour(connector);
    info.appendChild(connectorName);

    var mangaName = document.createElement('publication-name');
    mangaName.innerText = manga.sortName;

    //Create the publication status indicator
    var releaseStatus = document.createElement('publication-status');
    releaseStatus.setAttribute("release-status", manga.releaseStatus);
    switch(manga.releaseStatus){
      case 0:
        releaseStatus.setAttribute("release-status", "Ongoing");
        break;
      case 1:
        releaseStatus.setAttribute("release-status", "Completed");
        break;
      case 2:
        releaseStatus.setAttribute("release-status", "On Hiatus");
        break;
      case 3:
        releaseStatus.setAttribute("release-status", "Cancelled");
        break;
      case 4:
        releaseStatus.setAttribute("release-status", "Upcoming");
        break;
      default:
        releaseStatus.setAttribute("release-status", "Status Unavailable");
        break;
    }

    info.appendChild(mangaName);
    mangaElement.appendChild(info);
    mangaElement.appendChild(releaseStatus);                  //Append the release status indicator to the publication element
    return mangaElement;
}

//Returns a new "Search Result" item to display in the search window
function CreateSearchResult(manga, connector) {
  //Create a new publication and set an internal ID
  var searchResult = document.createElement('div');
  searchResult.id = GetValidSelector(manga.internalId);
  searchResult.className = "section-item";
  
//Append the cover image to the publication
  var imageCont = document.createElement('img-container');

  var mangaImage = document.createElement('img');
  mangaImage.src = GetCoverUrl(manga.internalId);
  imageCont.appendChild(mangaImage);

  var connectorName = document.createElement('manga-connector');
  connectorName.innerText = connector.toUpperCase();
  connectorName.style.backgroundColor = stringToColour(connector);
  imageCont.appendChild(connectorName);

  var chapterNo = document.createElement('span');
  chapterNo.className = 'latest-chapter-no';
  chapterNo.innerText = manga.latestChapterAvailable.toString();
  imageCont.appendChild(chapterNo);

  searchResult.appendChild(imageCont);

  var mangaDetails = document.createElement('div');
  mangaDetails.className = 'jobDetails';

  var headerRow = document.createElement('header-row');
  
  var mangaTitle = document.createElement('a');
  mangaTitle.innerText = manga.sortName;
  mangaTitle.href = manga.websiteUrl;
  mangaTitle.className = 'mangaTitle';
  headerRow.appendChild(mangaTitle);

  //Create the publication status indicator
  var releaseStatus = document.createElement('status-filter');
  switch(manga.releaseStatus){
    case 0:
      releaseStatus.setAttribute("release-status", "Ongoing");
      releaseStatus.innerText = "Ongoing";
      break;
    case 1:
      releaseStatus.setAttribute("release-status", "Completed");
      releaseStatus.innerText = "Completed";
      break;
    case 2:
      releaseStatus.setAttribute("release-status", "On Hiatus");
      releaseStatus.innerText = "On Hiatus";
      break;
    case 3:
      releaseStatus.setAttribute("release-status", "Cancelled");
      releaseStatus.innerText = "Cancelled";
      break;
    case 4:
      releaseStatus.setAttribute("release-status", "Upcoming");
      releaseStatus.innerText = "Upcoming";
      break;
    default:
      releaseStatus.setAttribute("release-status", "Status Unavailable");
      releaseStatus.innerText = "Status Unavailable";
      break;
  }
  headerRow.appendChild(releaseStatus);

  mangaDetails.appendChild(headerRow);

  //Genres
  var tagCloud = document.createElement('tag-cloud');
  manga.authors.forEach(author => {
    var authorCard = document.createElement('author-tag');

    var personImg = document.createElement('img');
    personImg.src = 'media/person.svg';
    authorCard.appendChild(personImg);

    var authorName = document.createElement('span');
    authorName.innerText = author;
    authorCard.appendChild(authorName);

    tagCloud.appendChild(authorCard);
  });
  manga.tags.forEach(tag => {
    var tagElement = document.createElement('manga-tag');
    tagElement.innerText = tag;
    tagCloud.appendChild(tagElement);
  });
  mangaDetails.appendChild(tagCloud);

  //Description
  var description = document.createElement('div');
  description.className = 'mangaDescription';
  description.innerText = manga.description;
  mangaDetails.appendChild(description);

  searchResult.appendChild(mangaDetails);

  //Download Settings
  var dlSett = document.createElement('div');
  dlSett.className = 'new-manga-download-settings'
  
  folderRow = document.createElement('row');
  folderLabel = document.createElement('label');
  folderLabel.innerText = 'Download Folder:';
  folderRow.appendChild(folderLabel);
  folderInput = document.createElement('input');
  downloadFolder = manga.folderName;
  folderInput.placeholder = downloadFolder.toString();
  folderInput.type = 'text';
  folderInput.id = manga.internalId.concat('-downloadfolder')
  folderRow.appendChild(folderInput);
  dlSett.appendChild(folderRow);

  intervalRow = document.createElement('row');
  intervalLabel = document.createElement('label');
  intervalLabel.innerText = 'Job Interval:';
  intervalRow.appendChild(intervalLabel);
  intervalInput = document.createElement('input');
  intervalInput.placeholder = '03:00:00 (HH:MM:SS)';
  intervalInput.type = 'text';
  intervalInput.id = manga.internalId.concat('-downloadinterval')
  intervalRow.appendChild(intervalInput);
  dlSett.appendChild(intervalRow);

  chapterRow = document.createElement('row');
  chapterLabel = document.createElement('label');
  chapterLabel.innerText = 'Download from Chapter:';
  chapterRow.appendChild(chapterLabel);
  chapterInput = document.createElement('input');
  chapterInput.placeholder = (manga.ignoreChaptersBelow + 1).toString();
  chapterInput.type = 'number';
  chapterInput.id = manga.internalId.concat('-downloadchapter')
  chapterRow.appendChild(chapterInput);
  dlSett.appendChild(chapterRow);

  dlButton = document.createElement('border-bar-button');
  if (IsInLibrary(manga.internalId)) {
    dlButton.className = 'section in-library';
    dlButton.innerText = 'In Library';
  } else {
    dlButton.className = 'section downloadManga';
    dlButton.innerText = 'Monitor Manga';
    dlButton.addEventListener('click', function() { AddManga(manga.internalId, connector) });
  }
  

  dlSett.appendChild(dlButton);

  mangaDetails.appendChild(dlSett);

//Append the publication information to the publication
  //console.log(manga);
  return searchResult;
}

function IsInLibrary(id) {
  matchFound = false;
  tasksContent.childNodes.forEach(publication => {
    if (id.toLowerCase().includes(publication.id.toLowerCase())) {
      console.log('Match found');
      matchFound = true;
    }
  });
  return matchFound;
}

function AddManga(id, connector) {
  console.log('Adding Manga');
  mangaID = id;
  mangaConnector = connector; 
  mangaLanguage = document.getElementById('newMangaTranslatedLanguage').value.toLowerCase();

  folderInput = document.getElementById(id.concat('-downloadfolder')).value;
  if (folderInput != null || folderInput != '') {
    mangaFolder = folderInput;
  }
  
  intervalInput = document.getElementById(id.concat('-downloadinterval')).value;
  if (intervalInput == null || intervalInput == '') {
    mangaInterval = '03:00:00';
  } else {
    mangaInterval = intervalInput;
  }

  chapterInput = document.getElementById(id.concat('-downloadchapter')).value;
  if (chapterInput == null || chapterInput == '') {
    mangaChapter = 0;
  } else {
    mangaChapter = chapterInput;
  }

  CreateMonitorJob(mangaConnector, mangaID, mangaLanguage, mangaInterval, mangaFolder, mangaChapter);
}

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
        createDownloadChapterJobButton.style.display = "none";
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
  //For each publication   
  tasksContent.childNodes.forEach(publication => {
    //If the search box isn't empty check that the title contains the searchbox content. If it does then
    //'searchMatch' is true and the manga is shown. If the search box is empty, then consider this field
    //to be true anyways.
    if (searchBox.value.length > 0) {
      publication.childNodes.forEach(item => {
        if (item.nodeName.toLowerCase() == "publication-information"){
          item.childNodes.forEach(information => {
            if (information.nodeName.toLowerCase() == "publication-name") {
              if (information.textContent.toLowerCase().includes(searchBox.value.toLowerCase())){
                searchMatch = 1;
              } else {
                searchMatch = 0;
              }
            }
          });
        }
      });
    } else {  
      searchMatch = 1;
    }

    //If the array connectorMatch isn't empty then check that the connector matches one of the ones
    //in the array
    if (connectorMatch.length > 0) {
      publication.childNodes.forEach(item => {
        if (item.nodeName.toLowerCase() == "publication-information"){
          item.childNodes.forEach(information => {
            if (information.nodeName.toLowerCase() == "connector-name") {
              if (connectorMatch.includes(information.textContent)){
                connectorNameMatch = 1;
              } else {
                connectorNameMatch = 0;
              }
            }
          });
        }
      });
    } else {
      connectorNameMatch = 1;
    }

    //If the array statusMatch isn't empty then check that the status matches one of the ones
    //in the array
    if (statusMatch.length > 0) {
      publication.childNodes.forEach(item => {
        if (item.nodeName.toLowerCase() == "publication-status"){
          if (statusMatch.includes(item.getAttribute('release-status'))) {
            statusNameMatch = 1;
          } else {
            statusNameMatch = 0;
          }
        }
      });
    } else {
      statusNameMatch = 1;
    }

    //If all of the filtering conditions are met then show the manga, otherwise hide it.
    if (searchMatch && connectorNameMatch && statusNameMatch) {
      publication.style.display = 'initial';
    } else {
      publication.style.display = 'none';
    }
  });
}

settingsCog.addEventListener("click", () => {
  OpenSettings();
  settingsPopup.style.display = "flex";
});

filterFunnel.addEventListener("click", () => {
  ToggleFilterBox();
});

settingKomgaUrl.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKomgaUser.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKomgaPass.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKavitaUrl.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKavitaUser.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingKavitaPass.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingGotifyUrl.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingGotifyAppToken.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingLunaseaWebhook.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingNtfyEndpoint.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingNtfyAuth.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingUserAgent.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });
settingApiUri.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings(); });

defaultRL.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings();}); 
coverRL.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings();}); 
imageRL.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings();}); 
infoRL.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings();}); 
mDexFeedRL.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings();}); 
mDexImageRL.addEventListener("keypress", (event) => { if(event.key === "Enter") UpdateSettings();}); 


function OpenSettings(){
  settingGotifyConfigured.setAttribute("configuration", "Not Configured");
  settingLunaseaConfigured.setAttribute("configuration", "Not Configured");
  settingNtfyConfigured.setAttribute("configuration", "Not Configured");
  settingKavitaConfigured.setAttribute("configuration", "Not Configured");
  settingKomgaConfigured.setAttribute("configuration", "Not Configured");
  settingKomgaUrl.value = "";
  settingKomgaUser.value = "";
  settingKomgaPass.value = "";
  settingKavitaUrl.value = "";
  settingKavitaUser.value = "";
  settingKavitaPass.value = "";
  settingGotifyUrl.value = "";
  settingGotifyAppToken.value = "";
  settingLunaseaWebhook.value = "";
  settingNtfyAuth.value = "";
  settingNtfyEndpoint.value = "";
  settingUserAgent.value = "";
  settingApiUri.value = "";
  defaultRL.value = "";
  coverRL.value = "";
  imageRL.value = "";
  infoRL.value = "";
  mDexFeedRL.value = "";
  mDexImageRL.value = "";
  
  GetSettings().then((json) => {
    //console.log(json);
    settingApiUri.value = apiUri;
    settingUserAgent.value = json.userAgent;
    settingAprilFoolsMode.checked = json.aprilFoolsMode;
    settingDownloadLocation.value = json.downloadLocation;
    //console.log(json.styleSheet);
  });
  GetRateLimits().then((json) => {
    defaultRL.placeholder = json.Default + ' Requests/Minute';
    coverRL.placeholder = json.MangaCover + ' Requests/Minute';
    imageRL.placeholder = json.MangaImage + ' Requests/Minute';
    infoRL.placeholder = json.MangaInfo + ' Requests/Minute';
    mDexFeedRL.placeholder = json.MangaDexFeed + ' Requests/Minute';
    mDexImageRL.placeholder = json.MangaDexImage + ' Requests/Minute';
  });
  GetLibraryConnectors().then((json) => {
    //console.log(json);
    json.forEach(connector => {
      switch(libraryConnectorTypes[connector.libraryType]){
        case "Kavita":
          settingKavitaConfigured.setAttribute("configuration", "Active");
          settingKavitaUrl.value = connector.baseUrl;
          settingKavitaUser.value = "***";
          settingKavitaPass.value = "***";
          break;
        case "Komga":
          settingKomgaConfigured.setAttribute("configuration", "Active");
          settingKomgaUrl.value = connector.baseUrl;
          settingKomgaUser.value = "***";
          settingKomgaPass.value = "***";
          break;
        default:
          console.log("Unknown type");
          console.log(connector);
          break;
      }
    });
  });
  GetNotificationConnectors().then((json) => {
    json.forEach(connector => {
      switch(notificationConnectorTypes[connector.notificationConnectorType]){
        case "Gotify":
          settingGotifyUrl.value = connector.endpoint;
          settingGotifyAppToken.value = "***";
          settingGotifyConfigured.setAttribute("configuration", "Active");
          break;
        case "LunaSea":
          settingLunaseaConfigured.setAttribute("configuration", "Active");
          settingLunaseaWebhook.value = connector.id;
          break;
        case "Ntfy":
          settingNtfyConfigured.setAttribute("configuration", "Active");
          settingNtfyEndpoint.value = connector.endpoint;
          settingNtfyAuth.value = "***";
          break;
        default:
          console.log("Unknown type");
          console.log(connector);
          break;
      }
    });
  });
}

//Functions for clearing/resetting connectors in the settings pop-up
function ClearKomga(){
  settingKomgaUrl.value = "";
  settingKomgaUser.value = "";
  settingKomgaPass.value = "";
  settingKomgaConfigured.setAttribute("configuration", "Not Configured");
  ResetKomga();
}

function ClearKavita(){
  settingKavitaUrl.value = "";
  settingKavitaUser.value = "";
  settingKavitaPass.value = "";
  settingKavitaConfigured.setAttribute("configuration", "Not Configured");
  ResetKavita();
}

function ClearGotify(){
  settingGotifyUrl.value = "";
  settingGotifyAppToken.value = ""
  settingGotifyConfigured.setAttribute("configuration", "Not Configured");
  ResetGotify();
}

function ClearLunasea(){
  settingLunaseaWebhook.value = "";
  settingLunaseaConfigured.setAttribute("configuration", "Not Configured");
  ResetLunaSea();
}

function ClearNtfy(){
  settingNtfyEndpoint.value = "";
  settingNtfyAuth.value = "";
  settingNtfyConfigured.setAttribute("configuration", "Not Configured");
  ResetNtfy();
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
  
  if(settingNtfyEndpoint.value != "" &&
    settingNtfyAuth.value != ""){
    UpdateNtfy(settingNtfyEndpoint.value, settingNtfyAuth.value);
  }
  
  if(settingUserAgent.value != ""){
      UpdateUserAgent(settingUserAgent.value);
  }

  if (defaultRL.value != "") {
    UpdateRateLimit(0, defaultRL.value);
  }

  if (coverRL.value != "") {
    UpdateRateLimit(3, coverRL.value);
  }

  if (imageRL.value != "") {
    UpdateRateLimit(2, imageRL.value);
  }

  if (infoRL.value != "") {
    UpdateRateLimit(6, infoRL.value);
  }

  if (mDexFeedRL.value != "") {
    UpdateRateLimit(1, mDexFeedRL.value);
  }

  if (mDexImageRL.value != "") {
    UpdateRateLimit(5, mDexImageRL.value);
  }
  
  setTimeout(() => {
      OpenSettings();
      Setup();
  }, 100)
}

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent( str )));
}

function UpdateJobs(){

  GetMonitorJobs().then((json) => {
    if(monitoringJobsCount != json.length){
      ResetContent();
      monitoringJobsCount = json.length;
    }
  });

  //Get the jobs that are waiting in the queue
  GetWaitingJobs().then((json) => {
    jobsQueuedTag.innerText = json.length;
    
    var nowWaitingJobs = [];
    
    json.forEach(job => {
      if(!waitingJobs.includes(GetValidSelector(job.id))){
        var jobDom = createJob(job);
        jobStatusWaiting.appendChild(jobDom);
      }
      nowWaitingJobs.push(GetValidSelector(job.id));
    });
    waitingJobs = nowWaitingJobs;
  });
  
  jobStatusWaiting.childNodes.forEach(child => {
    if(!waitingJobs.includes(child.id))
      jobStatusWaiting.removeChild(child);
  });
  
  //Get currently running jobs
  GetRunningJobs().then((json) => {
    jobsRunningTag.innerText = json.length;
    
    var nowRunningJobs = [];
    
    json.forEach(job => {
      if(!runningJobs.includes(GetValidSelector(job.id))){
        var jobDom = createJob(job);
        jobStatusRunning.appendChild(jobDom);
      }
      nowRunningJobs.push(GetValidSelector(job.id));
      UpdateJobProgress(job.id);
    });
    
    runningJobs = nowRunningJobs;
  });
  
  jobStatusRunning.childNodes.forEach(child => {
    if(!runningJobs.includes(child.id))
      jobStatusRunning.removeChild(child);
  });
}

function createJob(jobjson){
  var manga;
  if(jobjson.chapter != null)
    manga = jobjson.chapter.parentManga;
  else if(jobjson.manga != null)
    manga = jobjson.manga;
  else return null;
  
  
  var wrapper = document.createElement("div");
  wrapper.className = "section-item";
  wrapper.id = GetValidSelector(jobjson.id);
  
  var image = document.createElement("img");
  image.className = "jobImage";
  image.src = GetCoverUrl(manga.internalId);
  wrapper.appendChild(image);

  var details = document.createElement("div");
  details.className = 'jobDetails';

  var title = document.createElement("span");
  title.className = "jobTitle";
  if(jobjson.chapter != null)
    title.innerText = `${manga.sortName} - ${jobjson.chapter.fileName}`;
  else if(jobjson.manga != null)
    title.innerText = manga.sortName;
  details.appendChild(title);
  
  var progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'progress-container';

  var progressBar = document.createElement("div");
  progressBar.className = "pending";
  progressBar.id = `jobProgressBar${GetValidSelector(jobjson.id)}`;
  progressBarContainer.appendChild(progressBar);
  details.appendChild(progressBarContainer);
  
  var cancelSpan = document.createElement("span");
  cancelSpan.className = "jobCancel";
  cancelSpan.innerText = "Cancel";
  cancelSpan.addEventListener("click", () => CancelJob(jobjson.id));
  details.appendChild(cancelSpan);
  
  wrapper.appendChild(details);

  return wrapper;
}

function ShowJobQueue(){  
  jobStatusView.style.display = "initial";
}

function UpdateJobProgress(jobId){
  GetProgress(jobId).then((json) => {
    var progressBar = document.querySelector(`#jobProgressBar${GetValidSelector(jobId)}`);
    if(progressBar != null && json.progress != 0){
      progressBar.className = 'jobProgressBar';
      percentageStr = Intl.NumberFormat("en-US", { style: "percent"}).format(json.progress);
      console.log(percentageStr);
      progressBar.style.width = percentageStr;
      progressBar.innerText = percentageStr;
    }
  });
}

function GetValidSelector(str){
    var clean = [...str.matchAll(/[a-zA-Z0-9]*-*_*/g)];
    return clean.join('');
}

function stringToColour(str) {
  let hash = 0;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  })
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).padStart(2, '0')
  }
  return colour
}