import { SettingsItem } from "./Settings.tsx";
import FlareSolverr from "./FlareSolverr.tsx";
import LibraryConnectors from "./LibraryConnectors/LibraryConnectors.tsx";

export default function () {
  return (
    <SettingsItem title={"Services"}>
      <FlareSolverr />
      <LibraryConnectors />
    </SettingsItem>
  );
}
