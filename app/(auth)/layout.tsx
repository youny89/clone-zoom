
interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout:React.FC<AuthLayoutProps> = ({children}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">{children}</div>
  )
}

export default AuthLayout