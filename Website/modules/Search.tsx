import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState} from 'react';
import {MangaConnector} from "./MangaConnector";
import IMangaConnector from "./interfaces/IMangaConnector";
import {isValidUri} from "../App";
import IManga, {HTMLFromIManga} from "./interfaces/IManga";

export default function Search(){
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
            let found = con.BaseUris.find(uri => uri == baseUri);
            return found;
        });
        if(selectCon != undefined){
            setSelectedConnector(selectCon);
            setSelectedLanguage(selectCon.SupportedLanguages[0]);
        }
    }

    const ExecuteSearch : MouseEventHandler<HTMLButtonElement> = (event) => {
        if(searchBoxValue.length < 1 || selectedConnector === undefined || selectedLanguage === ""){
            console.error("Tried initiating search while not all fields where submitted.")
            return;
        }
        console.debug(`Searching Name: ${searchBoxValue} Connector: ${selectedConnector.name} Language: ${selectedLanguage}`);
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

    return (<div>
        <div id="SearchBox">
            <input type="text" placeholder="Manganame" onChange={searchBoxValueChanged}></input>
            <select value={selectedConnector === undefined ? "" : selectedConnector.name} onChange={selectedConnectorChanged}>
                <option value="" disabled hidden>Select</option>
                {mangaConnectors === undefined
                    ? <option value="Loading">Loading</option>
                    : mangaConnectors.map(con => <option value={con.name} key={con.name}>{con.name}</option>)}
            </select>
            <select onChange={changeSelectedLanguage} value={selectedLanguage === null ? "" : selectedLanguage}>
                {selectedConnector === undefined
                    ? <option value="" disabled hidden>Select Connector</option>
                    : selectedConnector.SupportedLanguages.map(language => <option value={language}
                                                                                   key={language}>{language}</option>)}
            </select>
            <button type="submit" onClick={ExecuteSearch}>Search</button>
        </div>
        <div>
            {searchResults === undefined
                ? <p>No Results yet</p>
                : searchResults.map(result => HTMLFromIManga(result))}
        </div>
    </div>)
}