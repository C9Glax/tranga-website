import {ColorPaletteProp} from "@mui/joy";

export enum MangaReleaseStatus {
    Continuing = "Continuing",
    Completed = "Completed",
    OnHiatus = "OnHiatus",
    Cancelled = "Cancelled",
    Unreleased = "Unreleased",
}

export function ReleaseStatusToPalette(status: MangaReleaseStatus): ColorPaletteProp {
    switch (status) {
        case MangaReleaseStatus.Continuing:
            return "success";
        case MangaReleaseStatus.Completed:
            return "primary";
        case MangaReleaseStatus.Cancelled:
            return "danger";
        case MangaReleaseStatus.Unreleased:
            return "neutral";
        case MangaReleaseStatus.OnHiatus:
            return "warning";
    }
}