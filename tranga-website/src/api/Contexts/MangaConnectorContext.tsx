import {createContext} from "react";
import IMangaConnector from "../types/IMangaConnector.ts";

export const MangaConnectorContext = createContext<IMangaConnector[]>([]);