import '../assets/sass/main.scss'
import type { AppProps } from 'next/app'
import { MenuProvider } from '../context/MenuContext'
import { AuthProvider } from '../context/AuthContext/AuthProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return <AuthProvider><MenuProvider> <Component {...pageProps} /></MenuProvider> </AuthProvider>
}
export default MyApp
