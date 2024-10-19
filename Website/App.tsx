import React, {ReactElement, useEffect} from 'react';
import Footer from "./modules/Footer";
import Search from "./modules/Search";
import Header from "./modules/Header";
import MonitorJobsList from "./modules/MonitorJobsList";
import './styles/Manga.css'

export default function App(){
    const [content, setContent] = React.useState<ReactElement>();

    function ShowSearch() {
        setContent(<>
            <Search />
            <MonitorJobsList onStartSearch={ShowSearch} />
        </>);
    }

    useEffect(() => {
        setContent(<h1>Testing connection to backend...</h1>)
        getData('http://127.0.0.1:6531/v2/Ping').then((result) => {
            console.log(result);
            if(result === null){
                setContent(<h1>No connection to backend</h1>);
            }else{
                setContent(<>
                    <MonitorJobsList onStartSearch={ShowSearch} />
                    </>)
            }
        })
    }, []);

    return(<div>
        <Header />
        {content}
        <Footer />
    </div>)
}

export function getData (uri: string) : Promise<object> {
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
            if(!response.ok) throw new Error("Could not fetch data");
            return response.json();
        })
        .catch(function(err){
            console.error(`Error POSTing Data ${uri}\n${err}`);
            return Promise.reject();
        });
}

export function deleteData(uri: string) {
    fetch(uri,
        {
            method: 'DELETE',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
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