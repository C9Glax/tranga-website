import React, {useEffect, useState} from 'react';
import Footer from "./modules/Footer";
import Search from "./modules/Search";
import Header from "./modules/Header";
import MonitorJobsList from "./modules/MonitorJobsList";
import './styles/index.css'
import IFrontendSettings, {LoadFrontendSettings} from "./modules/interfaces/IFrontendSettings";
import {useCookies} from "react-cookie";
import Loader from "./modules/Loader";

export default function App(){
    const [, setCookie] = useCookies(['apiUri', 'jobInterval']);
    const [connected, setConnected] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [frontendSettings, setFrontendSettings] = useState<IFrontendSettings>(LoadFrontendSettings());
    const [updateInterval, setUpdateInterval] = React.useState<number | undefined>(undefined);
    const checkConnectedInterval = 5000;

    const apiUri =  frontendSettings.apiUri;

    useEffect(() => {
        setCookie('apiUri', frontendSettings.apiUri);
        setCookie('jobInterval', frontendSettings.jobInterval);
        updateConnected(apiUri, connected, setConnected);
    }, [frontendSettings]);

    useEffect(() => {
        if(updateInterval === undefined){
            setUpdateInterval(setInterval(() => {
                updateConnected(apiUri, connected, setConnected);
            }, checkConnectedInterval));
        }else{
            clearInterval(updateInterval);
            setUpdateInterval(undefined);
        }
    }, [connected]);

    return(<div>
        <Header apiUri={apiUri} backendConnected={connected} settings={frontendSettings} setFrontendSettings={setFrontendSettings} />
        {connected
            ? <>
                {showSearch
                    ? <>
                        <Search apiUri={apiUri} jobInterval={frontendSettings.jobInterval} closeSearch={() => setShowSearch(false)} />
                        <hr/>
                    </>
                    : <></>}
                <MonitorJobsList apiUri={apiUri} onStartSearch={() => setShowSearch(true)} connectedToBackend={connected} checkConnectedInterval={checkConnectedInterval} />
            </>
            : <>
                <h1>No connection to the Backend.</h1>
                <h3>Check the Settings ApiUri.</h3>
                <Loader loading={true} />
            </>}
        <Footer apiUri={apiUri} connectedToBackend={connected} checkConnectedInterval={checkConnectedInterval} />
    </div>)
}

export function getData(uri: string) : Promise<object> {
    return makeRequest("GET", uri, null) as Promise<object>;
}

export function postData(uri: string, content: object | string | number) : Promise<object> {
    return makeRequest("POST", uri, content) as Promise<object>;
}

export function deleteData(uri: string) : Promise<void> {
    return makeRequest("PUT", uri, null) as Promise<void>;
}

export function patchData(uri: string, content: object | string | number) : Promise<object> {
    return makeRequest("patch", uri, content) as Promise<object>;
}

export function putData(uri: string, content: object | string | number) : Promise<object> {
    return makeRequest("PUT", uri, content) as Promise<object>;
}

function makeRequest(method: string, uri: string, content: object | string | number | null) : Promise<object | void> {
    return fetch(uri,
        {
            method: method,
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: content ? JSON.stringify(content) : null
        })
        .then(function(response){
            if(!response.ok){
                if(response.status === 503){
                    let retryHeaderVal = response.headers.get("Retry-After");
                    let seconds = 10;
                    if(!retryHeaderVal){
                        return response.text().then(text => {
                            seconds = parseInt(text);
                            return new Promise(resolve => setTimeout(resolve, seconds * 1000))
                                .then(() => {
                                    return makeRequest(method, uri, content);
                                });
                        });
                    }else {
                        seconds = parseInt(retryHeaderVal);
                        return new Promise(resolve => setTimeout(resolve, seconds * 1000))
                            .then(() => {
                                return makeRequest(method, uri, content);
                            });
                    }
                }else
                    throw new Error(response.statusText);
            }
            let json = response.json();
            return json.then((json) => json).catch(() => null);
        })
        .catch(function(err : Error){
            console.error(`Error ${method}ing Data ${uri}\n${err}`);
            return Promise.reject();
        });
}

export function isValidUri(uri: string) : boolean{
    try {
        new URL(uri);
        return true;
    } catch (err) {
        return false;
    }
}

const updateConnected = (apiUri: string, connected: boolean, setConnected: (c: boolean) => void) => {
    checkConnection(apiUri)
        .then(res => {
            if(connected != res)
                setConnected(res);
        })
        .catch(() => setConnected(false));
}

export const checkConnection  = async (apiUri: string): Promise<boolean> =>{
    return fetch(`${apiUri}/swagger`,
        {
            method: 'GET',
        })
        .then((response) =>{
            return response.type != "error";
        })
        .catch(() => {
            return Promise.reject();
        });
}