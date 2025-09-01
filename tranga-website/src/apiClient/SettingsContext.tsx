import { createContext, useContext, useState } from "react";
import { TrangaSettings } from "./data-contracts.ts";
import { ApiContext } from "./ApiContext.tsx";

const [settingsPromise, setSettingsPromise] =
  useState<Promise<TrangaSettings | undefined>>();
const [settings, setSettings] = useState<TrangaSettings>();

export const SettingsContext = createContext<{
  GetSettings: () => Promise<TrangaSettings | undefined>;
}>({
  GetSettings: (): Promise<TrangaSettings | undefined> => {
    const API = useContext(ApiContext);
    const promise = settingsPromise;
    if (promise) return promise;
    const p = new Promise<TrangaSettings | undefined>((resolve, reject) => {
      if (settings) resolve(settings);

      console.log(`Fetching settings`);
      API.settingsList()
        .then((result) => {
          if (!result.ok) throw new Error(`Error fetching settings`);
          setSettings(result.data);
          resolve(result.data);
        })
        .catch(reject);
    });
    setSettingsPromise(p);
    return p;
  },
});
