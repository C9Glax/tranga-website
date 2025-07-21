import { createContext } from "react";
import {V2} from "./V2.ts";

export const ApiContext = createContext<V2>(new V2());