import Sheet from "@mui/joy/Sheet";
import {Box, Link, Stack, Typography} from "@mui/joy";
import {ReactElement} from "react";
import './Header.css';
import { GitHub } from "@mui/icons-material";

export default function Header({children} : {children? : ReactElement<any, any> | ReactElement<any,any>[] | undefined}) : ReactElement {
    
    return (
        <Sheet className={"header"} sx={{position: "sticky !important", zIndex: 100}}>
            <Stack direction={"row"} spacing={2} sx={{width: "100%", alignItems: "center"}}>
                <img src={"/blahaj.png"} style={{cursor: "grab", maxHeight: "100%"}}/>
                <Typography level={"h2"} sx={{
                    background: "linear-gradient(110deg, var(--joy-palette-primary-solidBg), var(--joy-palette-success-400))", 
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    cursor: "default"
                }}>Tranga</Typography>
                <Link href={"https://github.com/C9Glax/tranga"} color={"neutral"} height={"min-content"} ><GitHub /> Server</Link>
                <Link href={"https://github.com/C9Glax/tranga-website"} color={"neutral"} height={"min-content"} ><GitHub /> Website</Link>
                <Box sx={{flexGrow: 1}} />
                {children}
            </Stack>
        </Sheet>
    );
}