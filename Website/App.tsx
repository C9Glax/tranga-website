import React, {ReactElement, useEffect} from 'react';
import Footer from "./modules/Footer";
import Search from "./modules/Search";
import Header from "./modules/Header";

export default function App(){
    const [content, setContent] = React.useState<ReactElement>();

    useEffect(() => {
        setContent(<h1>Testing connection to backend...</h1>)
        getData('http://127.0.0.1:6531/v2/Ping').then((result) => {
            console.log(result);
            if(result === null){
                setContent(<h1>No connection to backend</h1>);
            }else{
                setContent(<Search />)
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
            console.error(err);
            return null;
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