import React, {useEffect, useState} from 'react';
import Footer from "./modules/Footer";
import Search from "./modules/Search";
import Header from "./modules/Header";
import MonitorJobsList from "./modules/MonitorJobsList";
import './styles/index.css'
import {Job} from "./modules/Job";
import IFrontendSettings from "./modules/interfaces/IFrontendSettings";

export default function App(){
    const [connected, setConnected] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [frontendSettings, setFrontendSettings] = useState<IFrontendSettings>({jobInterval: new Date(0,0,0,3)});

    useEffect(() => {
        checkConnection().then(res => setConnected(res)).catch(() => setConnected(false));
        setInterval(() => {
            checkConnection().then(res => setConnected(res)).catch(() => setConnected(false));
        }, 500);
    }, []);

    function CreateJob(internalId: string, jobType: string){
        Job.CreateJobDateInterval(internalId, jobType, frontendSettings.jobInterval);
    }

    return(<div>
        <Header settings={frontendSettings} changeSettings={setFrontendSettings}/>
        {connected
            ? <>
                {showSearch
                    ? <>
                        <Search createJob={CreateJob} closeSearch={() => setShowSearch(false)} />
                        <hr/>
                    </>
                    : <></>}
                <MonitorJobsList onStartSearch={() => setShowSearch(true)} onJobsChanged={() => console.info("jobsChanged")} connectedToBackend={connected} />
            </>
            : <h1>No connection to backend</h1>}
        <Footer connectedToBackend={connected} />
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

export const checkConnection  = async (): Promise<boolean> =>{
    return getData('http://127.0.0.1:6531/v2/Ping').then((result) => {
        return result != null;
    }).catch(() => Promise.reject());
}