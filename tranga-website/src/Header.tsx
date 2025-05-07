import Sheet from "@mui/joy/Sheet";
import {Stack, Typography} from "@mui/joy";
import {ReactElement} from "react";
import './Header.css';

export default function Header({children} : {children? : ReactElement<any, any> | ReactElement<any,any>[] | undefined}) : ReactElement {
    return (
        <Sheet className={"header"}>
            <Stack direction={"row"}
                   spacing={4}
                   sx={{
                       justifyContent: "flex-start",
                       alignItems: "center",
                   }}>
                <Typography level={"h2"}>Tranga</Typography>
                {children}
            </Stack>
        </Sheet>
    );
}