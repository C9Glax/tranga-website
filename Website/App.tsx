import React from 'react';
import Footer from "./modules/Footer";
import Search from "./modules/Search";
import Header from "./modules/Header";

export default function App(){
    // @ts-ignore
    const content = <div>
        <Header />
        <Search />
        <Footer />
    </div>

    return(content)
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