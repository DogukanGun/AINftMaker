import { ReactNode } from "react"

type PageProps = {
    children: ReactNode
}
const Page = ({ children }: PageProps) => {
    return(
        <body className="min-h-screen w-full">
            {children}
        </body>
    )
}

export default Page;