import React, {ChangeEventHandler, EventHandler, useEffect, useState} from 'react';
import {MangaConnector} from "./MangaConnector";
import IMangaConnector from "./interfaces/IMangaConnector";
import {isValidUri} from "../App";
import IManga, {SearchResult} from "./interfaces/IManga";
import '../styles/search.css';
import '../styles/MangaSearchResult.css'

export default function Search({createJob, closeSearch} : {createJob: (internalId: string, type: string) => void, closeSearch(): void}) {
    const [mangaConnectors, setConnectors] = useState<IMangaConnector[]>();
    const [selectedConnector, setSelectedConnector] = useState<IMangaConnector>();
    const [selectedLanguage, setSelectedLanguage] = useState<string>();
    const [searchBoxValue, setSearchBoxValue] = useState("");
    const [searchResults, setSearchResults] = useState<IManga[]>();


    const pattern = /https:\/\/([a-z0-9.]+\.[a-z0-9]{2,})(?:\/.*)?/i

    useEffect(() => {
        if(mangaConnectors === undefined) {
            MangaConnector.GetAllConnectors().then(setConnectors);
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
        setSelectedLanguage(selectedConnector.SupportedLanguages[0]);
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
            return con.BaseUris.find(uri => uri == baseUri);
        });
        if(selectCon != undefined){
            setSelectedConnector(selectCon);
            setSelectedLanguage(selectCon.SupportedLanguages[0]);
        }
    }

    const ExecuteSearch : EventHandler<any> = () => {
        if(searchBoxValue.length < 1 || selectedConnector === undefined || selectedLanguage === ""){
            console.error("Tried initiating search while not all fields where submitted.")
            return;
        }
        //console.info(`Searching Name: ${searchBoxValue} Connector: ${selectedConnector.name} Language: ${selectedLanguage}`);
        if(isValidUri(searchBoxValue) && !selectedConnector.BaseUris.find((uri: string) => {
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
            MangaConnector.GetMangaFromConnectorByTitle(selectedConnector, searchBoxValue)
                .then((mangas: IManga[]) => {
                    setSearchResults(mangas);
                });
        }else{
            MangaConnector.GetMangaFromConnectorByUrl(selectedConnector, searchBoxValue)
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
                <option value="" disabled hidden>Select</option>
                {mangaConnectors === undefined
                    ? <option value="Loading">Loading</option>
                    : mangaConnectors.map(con => <option value={con.name} key={con.name}>{con.name}</option>)}
            </select>
            <select id="Searchbox-language" onChange={changeSelectedLanguage} value={selectedLanguage === null ? "" : selectedLanguage}>
                {selectedConnector === undefined
                    ? <option value="" disabled hidden>Select Connector</option>
                    : selectedConnector.SupportedLanguages.map(language => <option value={language} key={language}>{language}</option>)}
            </select>
            <button id="Searchbox-button" type="submit" onClick={ExecuteSearch}>Search</button>
        </div>
        <img alt="Close Search" id="closeSearch" src="../media/close-x.svg" onClick={closeSearch} />
        <div id="SearchResults">
            {searchResults === undefined
                ? <p></p>
                : searchResults.map(result => SearchResult(result, createJob))}
        </div>
    </div>)
}