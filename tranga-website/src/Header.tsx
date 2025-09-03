import Sheet from '@mui/joy/Sheet'
import { Link, Stack, Typography } from '@mui/joy'
import { ReactElement, ReactNode, useContext } from 'react'
import './Header.css'
import { Article, GitHub } from '@mui/icons-material'
import { ApiContext } from './contexts/ApiContext.tsx'

export default function Header({
    children,
}: {
    children?: ReactNode
}): ReactElement {
    const Api = useContext(ApiContext)

    return (
        <Sheet className={'header'}>
            <Stack
                direction={'row'}
                spacing={2}
                sx={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                useFlexGap
            >
                <Stack
                    sx={{ flexGrow: 1, flexBasis: 1 }}
                    direction={'row'}
                    spacing={2}
                >
                    {children}
                </Stack>
                <Stack
                    sx={{
                        flexGrow: 1,
                        height: '100%',
                        flexBasis: 1,
                        justifyContent: 'center',
                    }}
                    direction={'row'}
                >
                    <img
                        src={'/blahaj.png'}
                        style={{ cursor: 'grab', maxHeight: '100%' }}
                    />
                    <Typography
                        level={'h2'}
                        sx={{
                            background:
                                'linear-gradient(110deg, var(--joy-palette-primary-solidBg), var(--joy-palette-success-400))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            cursor: 'default',
                        }}
                    >
                        Tranga
                    </Typography>
                </Stack>
                <Stack
                    sx={{
                        flexGrow: 1,
                        flexBasis: 1,
                        justifyContent: 'flex-end',
                    }}
                    direction={'row'}
                    spacing={2}
                >
                    <Link
                        target={'_blank'}
                        href={'https://github.com/C9Glax/tranga'}
                        color={'neutral'}
                        height={'min-content'}
                    >
                        <GitHub /> Server
                    </Link>
                    <Link
                        target={'_blank'}
                        href={'https://github.com/C9Glax/tranga-website'}
                        color={'neutral'}
                        height={'min-content'}
                    >
                        <GitHub /> Website
                    </Link>
                    <Link
                        target={'_blank'}
                        href={Api.baseUrl + '/swagger'}
                        color={'neutral'}
                        height={'min-content'}
                    >
                        <Article />
                        Swagger
                    </Link>
                </Stack>
            </Stack>
        </Sheet>
    )
}
