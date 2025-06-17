import Sheet from "@mui/joy/Sheet";
import {Box, Stack, Typography} from "@mui/joy";
import {ReactElement} from "react";
import './Header.css';

export default function Header({children} : {children? : ReactElement<any, any> | ReactElement<any,any>[] | undefined}) : ReactElement {
    
    return (
        <Sheet className={"header"} sx={{position: "sticky !important", zIndex: 100}}>
            <Stack direction={"row"} spacing={2} sx={{width: "100%"}}>
                <img src={"/blahaj.png"} style={{cursor: "grab"}}/>
                <Typography level={"h2"} sx={{
                    background: "linear-gradient(110deg, var(--joy-palette-primary-solidBg), var(--joy-palette-success-400))", 
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    cursor: "default"
                }}>Tranga</Typography>
                <Box sx={{flexGrow: 1}} />
                {children}
            </Stack>
        </Sheet>
    );
}