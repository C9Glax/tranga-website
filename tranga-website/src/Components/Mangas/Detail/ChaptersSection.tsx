import { ReactNode, useContext, useEffect, useState } from 'react';
import { Chapter, Manga, MangaConnector, MangaConnectorId } from '../../../api/data-contracts.ts';
import { Accordion, AccordionDetails, AccordionSummary, Table, Typography } from '@mui/joy';
import { ApiContext } from '../../../contexts/ApiContext.tsx';
import { MangaConnectorContext } from '../../../contexts/MangaConnectorContext.tsx';
import MangaConnectorIcon from '../MangaConnectorIcon.tsx';
import TCheckbox from '../../Inputs/TCheckbox.tsx';

export default function ChaptersSection(props: ChaptersSectionProps): ReactNode {
    const Api = useContext(ApiContext);
    const MangaConnectors = useContext(MangaConnectorContext);

    const [chapters, setChapters] = useState<Chapter[]>([]);
    useEffect(() => {
        if (!props.manga) return;
        Api.mangaChaptersList(props.manga.key).then((data) => {
            if (!data.ok) return;
            setChapters(data.data);
        });
    }, [props]);

    const chapterConnectorCheckbox = (chapter: Chapter, connector: MangaConnector): ReactNode => {
        const id = chapter.mangaConnectorIds.find((id) => id.mangaConnectorName == connector.key);
        if (!id) return null;
        return (
            <TCheckbox
                onCheckChanged={(value) => setDownloadingFrom(id, value)}
                defaultChecked={id.useForDownload}
            />
        );
    };

    const setDownloadingFrom = (id: MangaConnectorId, value: boolean): Promise<void> => {
        console.log(id,  value);
        return Promise.reject();
    };

    return (
        <Accordion sx={{ maxHeight: '50vh' }}>
            <AccordionSummary>
                <Typography level={'h3'}>Chapters</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography level={'body-md'}>Set source for chapter</Typography>
                <Table>
                    <thead>
                        <tr>
                            <th>Vol</th>
                            <th>Ch</th>
                            <th>Title</th>
                            {MangaConnectors.map((con) => (
                                <th>
                                    <MangaConnectorIcon mangaConnector={con} />
                                    {con.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {chapters.map((ch) => (
                            <tr>
                                <td>{ch.volume}</td>
                                <td>{ch.chapterNumber}</td>
                                <td>{ch.title}</td>
                                {MangaConnectors.map((con) => (
                                    <td>{chapterConnectorCheckbox(ch, con)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}

export interface ChaptersSectionProps {
    manga?: Manga;
}
