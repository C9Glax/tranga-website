import React, {ChangeEventHandler, EventHandler, useEffect, useState} from 'react';
import {MangaConnector} from "./MangaConnector";
import IMangaConnector from "./interfaces/IMangaConnector";
import {isValidUri} from "../App";
import IManga, {ExtendedInfo} from "./interfaces/IManga";
import '../styles/search.css';
import '../styles/ExtendedInfo.css'
import SearchFunctions from "./SearchFunctions";
import Job from "./Job";

export default function Search({apiUri, jobInterval, onJobsChanged, closeSearch} : {apiUri: string, jobInterval: Date, onJobsChanged: (internalId: string) => void, closeSearch(): void}) {
    const [mangaConnectors, setConnectors] = useState<IMangaConnector[]>();
    const [selectedConnector, setSelectedConnector] = useState<IMangaConnector>();
    const [selectedLanguage, setSelectedLanguage] = useState<string>();
    const [searchBoxValue, setSearchBoxValue] = useState("");
    const [searchResults, setSearchResults] = useState<IManga[]>();

    const pattern = /https:\/\/([a-z0-9.]+\.[a-z0-9]{2,})(?:\/.*)?/i

    useEffect(() => {
        if(mangaConnectors === undefined) {
            MangaConnector.GetAllConnectors(apiUri).then(setConnectors)
            return;
        }
    }, [mangaConnectors]);

    const selectedConnectorChanged : ChangeEventHandler<HTMLSelectElement> = (event) => {
        event.preventDefault();
        if(mangaConnectors === undefined)
            return;
        const selectedConnector = mangaConnectors.find((con: IMangaConnector) => con.name == event.target.value);
        if(selectedConnector === undefined)
            return;
        setSelectedConnector(selectedConnector);
        setSelectedLanguage(selectedConnector.supportedLanguages[0]);
    }

    const searchBoxValueChanged : ChangeEventHandler<HTMLInputElement> = (event) => {
        event.currentTarget.style.width = event.target.value.length + "ch";
        if(mangaConnectors === undefined)
            return;
        var str : string = event.target.value;
        setSearchBoxValue(str);
        if(isValidUri(str))
            setSelectedConnector(undefined);
        const match = str.match(pattern);
        if(match === null)
            return;
        let baseUri = match[1];
        const selectCon = mangaConnectors.find((con: IMangaConnector) => {
            return con.baseUris.find(uri => uri == baseUri);
        });
        if(selectCon != undefined){
            setSelectedConnector(selectCon);
            setSelectedLanguage(selectCon.supportedLanguages[0]);
        }
    }

    const ExecuteSearch : EventHandler<any> = () => {
        if(searchBoxValue.length < 1 || selectedConnector === undefined || selectedLanguage === ""){
            console.error("Tried initiating search while not all fields where submitted.")
            return;
        }
        //console.info(`Searching Name: ${searchBoxValue} Connector: ${selectedConnector.name} Language: ${selectedLanguage}`);
        if(isValidUri(searchBoxValue) && !selectedConnector.baseUris.find((uri: string) => {
                const match = searchBoxValue.match(pattern);
                if(match === null)
                    return false;
                return match[1] == uri
            }))
        {
            console.error("URL in Searchbox detected, but does not match selected connector.");
            return;
        }
        if(!isValidUri(searchBoxValue)){
            SearchFunctions.SearchNameOnConnector(apiUri, selectedConnector.name, searchBoxValue)
                .then((mangas: IManga[]) => {
                    setSearchResults(mangas);
                });
        }else{
            SearchFunctions.SearchUrl(apiUri, searchBoxValue)
                .then((manga: IManga) => {
                    setSearchResults([manga]);
                });
        }
    }

    const changeSelectedLanguage : ChangeEventHandler<HTMLSelectElement> = (event) => setSelectedLanguage(event.target.value);

    return (<div id="Search">
        <div id="SearchBox">
            <input type="text" placeholder="Manganame" id="Searchbox-Manganame" onKeyDown={(e) => {if(e.key == "Enter") ExecuteSearch(null);}} onChange={searchBoxValueChanged}></input>
            <select id="Searchbox-Connector" value={selectedConnector === undefined ? "" : selectedConnector.name} onChange={selectedConnectorChanged}>
                {mangaConnectors === undefined ? <option value="Loading">Loading</option> : <option value="" disabled hidden>Select</option>}
                {mangaConnectors === undefined
                    ? null
                    : mangaConnectors.map(con => <option value={con.name} key={con.name}>{con.name}</option>)}
            </select>
            <select id="Searchbox-language" onChange={changeSelectedLanguage} value={selectedLanguage === null ? "" : selectedLanguage}>
                {mangaConnectors === undefined ? <option value="Loading">Loading</option> : <option value="" disabled hidden>Select Connector</option>}
                {selectedConnector === undefined
                    ? null
                    : selectedConnector.supportedLanguages.map(language => <option value={language} key={language}>{language}</option>)}
            </select>
            <button id="Searchbox-button" type="submit" onClick={ExecuteSearch}>Search</button>
        </div>
        <img alt="Close Search" id="closeSearch" src="../media/close-x.svg" onClick={closeSearch} />
        <div id="SearchResults">
            {searchResults === undefined
                ? <p></p>
                : searchResults.map(result =>
                    <ExtendedInfo key={"Searchresult-"+result.mangaId} apiUri={apiUri} manga={result} actions={[
                        <button className="Manga-AddButton" onClick={() => {
                            Job.CreateDownloadAvailableChaptersJob(apiUri, result.mangaId, jobInterval.getTime()).then(() => onJobsChanged(result.mangaId));
                        }}>Monitor</button>
                    ]}/>
                )
            }
        </div>
    </div>);
}