import {Chip, ColorPaletteProp} from "@mui/joy";
import IAuthor from "../api/types/IAuthor.ts";

export default function AuthorTag({author, color} : {author: IAuthor, color?: ColorPaletteProp }) {
    return (
        <Chip variant={"outlined"} size={"md"} color={color??"primary"}>
            {author.authorName ?? "Load Failed"}
        </Chip>
    );
}