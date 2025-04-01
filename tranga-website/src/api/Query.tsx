import IAuthor from "./types/IAuthor.ts";
import {getData} from "./fetchApi.tsx";
import ILink from "./types/ILink.ts";

export const GetAuthor = async (apiUri: string, authorId: string) : Promise<IAuthor> => {
    if(authorId === undefined || authorId === null || authorId.length < 1)
        return Promise.reject("authorId was not provided");
    return await getData(`${apiUri}/v2/Query/Author/${authorId}`) as Promise<IAuthor>;
}

export const GetLink = async (apiUri: string, linkId: string) : Promise<ILink> => {
    if(linkId === undefined || linkId === null || linkId.length < 1)
        return Promise.reject("linkId was not provided");
    return await getData(`${apiUri}/v2/Query/Link/${linkId}`) as Promise<ILink>;
}