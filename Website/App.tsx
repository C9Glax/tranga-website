import React, {useEffect, useState} from 'react';
import Footer from "./modules/Footer";
import Search from "./modules/Search";
import Header from "./modules/Header";
import MonitorJobsList from "./modules/MonitorJobsList";
import './styles/index.css'
import IFrontendSettings, {LoadFrontendSettings} from "./modules/interfaces/IFrontendSettings";
import {useCookies} from "react-cookie";

export default function App(){
    const [, setCookie] = useCookies(['apiUri', 'jobInterval']);
    const [connected, setConnected] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [frontendSettings, setFrontendSettings] = useState<IFrontendSettings>(LoadFrontendSettings());
    const [updateInterval, setUpdateInterval] = React.useState<number>();
    const [updateMonitorList, setUpdateMonitorList] = React.useState<Date>(new Date());

    const apiUri =  frontendSettings.apiUri;

    useEffect(() => {
        checkConnection(apiUri).then(res => setConnected(res)).catch(() => setConnected(false));
        if(updateInterval === undefined){
            setUpdateInterval(setInterval(() => {
                checkConnection(apiUri).then(res => setConnected(res)).catch(() => setConnected(false));
            }, 500));
        }else{
            clearInterval(updateInterval);
            setUpdateInterval(undefined);
        }
    }, [frontendSettings]);

    function ChangeSettings(settings: IFrontendSettings) {
        setFrontendSettings(settings);
        setCookie('apiUri', settings.apiUri);
        setCookie('jobInterval', settings.jobInterval);
    }

    const UpdateList = () => {setUpdateMonitorList(new Date())}

    return(<div>
        <Header apiUri={apiUri} backendConnected={connected} settings={frontendSettings} changeSettings={ChangeSettings}/>
        {connected
            ? <>
                {showSearch
                    ? <>
                        <Search apiUri={apiUri} jobInterval={frontendSettings.jobInterval} onJobsChanged={UpdateList} closeSearch={() => setShowSearch(false)} />
                        <hr/>
                    </>
                    : <></>}
                <MonitorJobsList updateList={updateMonitorList} apiUri={apiUri} onStartSearch={() => setShowSearch(true)} onJobsChanged={UpdateList} connectedToBackend={connected} />
            </>
            : <>
                <h1>No connection to the Backend.</h1>
                <h3>Check the Settings ApiUri.</h3>
            </>}
        <Footer apiUri={apiUri} connectedToBackend={connected} />
    </div>)
}

export function getData(uri: string) : Promise<object> {
    return fetch(uri,
        {
            method: 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(function(response){
            if(!response.ok) throw new Error("Could not fetch data");
            return response.json();
        })
        .catch(function(err){
            console.error(`Error GETting Data ${uri}\n${err}`);
            return Promise.reject();
        });
}

export function postData(uri: string, content: object) : Promise<object> {
    return fetch(uri,
        {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(content)
        })
        .then(function(response){
            if(!response.ok)
                throw new Error("Could not fetch data");
            let json = response.json();
            return json.then((json) => json).catch(() => null);
        })
        .catch(function(err){
            console.error(`Error POSTing Data ${uri}\n${err}`);
            return Promise.reject();
        });
}

export function deleteData(uri: string) : Promise<void> {
    return fetch(uri,
        {
            method: 'DELETE',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(() =>{
            return Promise.resolve();
        })
        .catch(function(err){
            console.error(`Error DELETEing Data ${uri}\n${err}`);
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

export const checkConnection  = async (apiUri: string): Promise<boolean> =>{
    return getData(`${apiUri}/v2/Ping`).then((result) => {
        return result != null;
    }).catch(() => Promise.reject());
}