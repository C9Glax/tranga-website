import {Chip, Link, ColorPaletteProp} from "@mui/joy";
import ILink from "../api/types/ILink.ts";

export default function LinkTag({link, color} : { link: ILink | undefined, color?: ColorPaletteProp }) {
    return (
        <Chip variant={"soft"} size={"sm"} color={color??"primary"}>
            <Link sx={{textDecoration:"underline"}} level={"body-xs"} href={link?.linkUrl}>{link?.linkProvider??"Load Failed"}</Link>
        </Chip>
    );
}