import { V2 } from '../api/V2.ts'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { ApiConfig } from '../api/http-client.ts'

export const ApiContext = createContext<V2>(new V2())

export default function ApiProvider({
    apiConfig,
    children,
}: {
    apiConfig: ApiConfig
    children: ReactNode
}) {
    const [api, setApi] = useState<V2>(new V2(apiConfig))
    useEffect(() => {
        setApi(new V2(apiConfig))
    }, [apiConfig])

    return <ApiContext value={api}>{children}</ApiContext>
}
