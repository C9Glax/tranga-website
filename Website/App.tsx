import React, {EventHandler, useEffect} from 'react';
import Footer from "./modules/Footer";
import Search from "./modules/Search";
import Header from "./modules/Header";
import MonitorJobsList from "./modules/MonitorJobsList";
import './styles/index.css'
import QueuePopUp from "./modules/QueuePopUp";

export default function App(){
    const [connected, setConnected] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [showQueue, setShowQueue] = React.useState(false);
    const [lastMangaListUpdate, setLastMangaListUpdate] = React.useState<Date>(new Date());
    const [lastJobListUpdate, setLastJobListUpdate] = React.useState<Date>(new Date());

    useEffect(() => {
        getData('http://127.0.0.1:6531/v2/Ping').then((result) => {
            console.log(result);
            if(result === null){
                setConnected(false);
            }else{
                setConnected(true);
            }

            const interval = setInterval(() => {
                setLastJobListUpdate(new Date());
            }, 5000);

            return () => clearInterval(interval);
        });
    }, []);

    const JobsChanged : EventHandler<any> = () => {
        setLastMangaListUpdate(new Date());
        setLastJobListUpdate(new Date());
    }

    return(<div>
        <Header/>
        {connected
            ? <>
                {showSearch
                    ? <>
                        <Search onJobsChanged={JobsChanged} closeSearch={() => setShowSearch(false)} />
                        <hr/>
                    </>
                    : <></>}
                {showQueue
                    ? <QueuePopUp closeQueue={() => setShowQueue(false)} />
                    : <></>
                }
                <MonitorJobsList onStartSearch={() => setShowSearch(true)} onJobsChanged={JobsChanged} key={lastMangaListUpdate.getTime()}/>
            </>
            : <h1>No connection to backend</h1>}
        <Footer key={lastJobListUpdate.getTime()} showQueue={() => setShowQueue(true)}/>
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