import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { FileLibrary } from '../api/data-contracts.ts'
import { ApiContext } from './ApiContext.tsx'

export const FileLibraryContext = createContext<FileLibrary[]>([])

export default function LibraryProvider({
    children,
}: {
    children: ReactNode
}): ReactNode {
    const Api = useContext(ApiContext)

    const [state, setState] = useState<FileLibrary[]>([])

    useEffect(() => {
        Api.fileLibraryList().then((result) => {
            if (result.ok) {
                setState(result.data)
            }
        })
    }, [Api])

    return <FileLibraryContext value={state}>{children}</FileLibraryContext>
}
