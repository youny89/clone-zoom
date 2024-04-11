import StreamVideoProvider from "@/providers/stream-video-provider";

interface RootlayoutProps {
    children:React.ReactNode;
}

const RootLayout:React.FC<RootlayoutProps> = ({children}) => {
  return (
    <main>
        <StreamVideoProvider>
            {children}
        </StreamVideoProvider>
    </main>
  )
}

export default RootLayout