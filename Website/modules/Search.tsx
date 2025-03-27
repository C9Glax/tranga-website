import React, {ChangeEventHandler, EventHandler, useEffect, useState} from 'react';
import {MangaConnectorFunctions} from "./MangaConnectorFunctions";
import IMangaConnector from "./interfaces/IMangaConnector";
import {isValidUri} from "../App";
import IManga, {MangaItem} from "./interfaces/IManga";
import '../styles/search.css';
import SearchFunctions from "./SearchFunctions";
import JobFunctions from "./JobFunctions";
import ILocalLibrary from "./interfaces/ILocalLibrary";
import LocalLibraryFunctions from "./LocalLibraryFunctions";
import Loader from "./Loader";

export default function Search({apiUri, jobInterval, closeSearch} : {apiUri: string, jobInterval: Date, closeSearch(): void}) {
    let [loading, setLoading] = useState<boolean>(true);
    const [mangaConnectors, setConnectors] = useState<IMangaConnector[]>();
    const [selectedConnector, setSelectedConnector] = useState<IMangaConnector>();
    const [selectedLanguage, setSelectedLanguage] = useState<string>();
    const [searchBoxValue, setSearchBoxValue] = useState("");
    const [searchResults, setSearchResults] = useState<IManga[]>();

    const pattern = /https:\/\/([a-z0-9.]+\.[a-z0-9]{2,})(?:\/.*)?/i

    useEffect(() => {
        MangaConnectorFunctions.GetAllConnectors(apiUri).then((connectors)=> {
            return connectors.filter(c => c.enabled);
        }).then(setConnectors).then(() => setLoading(false));
    }, []);

    useEffect(() => {
        setSelectedConnector(mangaConnectors?.find(c => c.name == "Global"));
        setSelectedLanguage(mangaConnectors?.find(c => c.name == "Global")?.supportedLanguages[0])
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
        setLoading(true);
        if(!isValidUri(searchBoxValue)){
            SearchFunctions.SearchNameOnConnector(apiUri, selectedConnector.name, searchBoxValue)
                .then((mangas: IManga[]) => {
                    setSearchResults(mangas);
                })
                .finally(()=>setLoading(false));
        }else{
            SearchFunctions.SearchUrl(apiUri, searchBoxValue)
                .then((manga: IManga) => {
                    setSearchResults([manga]);
                })
                .finally(()=>setLoading(false));
        }
    }

    const changeSelectedLanguage : ChangeEventHandler<HTMLSelectElement> = (event) => setSelectedLanguage(event.target.value);
    let [selectedLibrary, setSelectedLibrary] = useState<ILocalLibrary | null>(null);
    let [libraries, setLibraries] = useState<ILocalLibrary[] | null>(null);
    useEffect(() => {
        LocalLibraryFunctions.GetLibraries(apiUri).then(setLibraries);
    }, []);
    useEffect(() => {
        if(libraries === null || libraries.length < 1)
            setSelectedLibrary(null);
        else
            setSelectedLibrary(libraries[0]);
    }, [libraries]);

    const selectedLibraryChanged : ChangeEventHandler<HTMLSelectElement> = (event) => {
        event.preventDefault();
        if(libraries === null)
            return;
        const selectedLibrary = libraries.find((lib:ILocalLibrary) => lib.localLibraryId == event.target.value);
        if(selectedLibrary === undefined)
            return;
        setSelectedLibrary(selectedLibrary);
    }

    return (<div id="Search">
        <div id="SearchBox">
            <input type="text" placeholder="Manganame" id="Searchbox-Manganame" onKeyDown={(e) => {if(e.key == "Enter") ExecuteSearch(null);}} onChange={searchBoxValueChanged} disabled={loading} />
            <select id="Searchbox-Connector" value={selectedConnector === undefined ? "" : selectedConnector.name} onChange={selectedConnectorChanged} disabled={loading}>
                {mangaConnectors === undefined ? <option value="Loading">Loading</option> : <option value="" disabled hidden>Select</option>}
                {mangaConnectors === undefined
                    ? null
                    : mangaConnectors.map(con => <option value={con.name} key={con.name}>{con.name}</option>)}
            </select>
            <select id="Searchbox-language" onChange={changeSelectedLanguage} value={selectedLanguage === null ? "" : selectedLanguage} disabled={loading}>
                {mangaConnectors === undefined ? <option value="Loading">Loading</option> : <option value="" disabled hidden>Select Connector</option>}
                {selectedConnector === undefined
                    ? null
                    : selectedConnector.supportedLanguages.map(language => <option value={language} key={language}>{language}</option>)}
            </select>
            <button id="Searchbox-button" type="submit" onClick={ExecuteSearch} disabled={loading}>Search</button>
            <Loader loading={loading} style={{width:"40px", height:"40px", zIndex: 50}}/>
        </div>
        <img alt="Close Search" id="closeSearch" src="../media/close-x.svg" onClick={closeSearch} />
        <div id="SearchResults">
            {searchResults === undefined
                ? null
                : searchResults.map(result => {
                    return <MangaItem apiUri={apiUri} mangaId={result.mangaId} >
                        <select defaultValue={selectedLibrary === null ? "" : selectedLibrary.localLibraryId} onChange={selectedLibraryChanged}>
                            {selectedLibrary === null || libraries === null ? <option value="">Loading</option>
                                : libraries.map(library => <option key={library.localLibraryId} value={library.localLibraryId}>{library.libraryName} ({library.basePath})</option>)}
                        </select>
                        <button className="Manga-AddButton" onClick={() => {
                            JobFunctions.CreateDownloadAvailableChaptersJob(apiUri, result.mangaId, {recurrenceTimeMs: new Date(jobInterval).getTime(), localLibraryId: selectedLibrary!.localLibraryId});
                        }}>Monitor</button>
                    </MangaItem>
                })
            }
        </div>
    </div>);
}