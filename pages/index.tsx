import type { NextPage } from 'next'

import Contact from '../components/Home/Contact'
import Footer from '../components/Home/Footer'
import Header from '../components/Home/Header'




const ComponentPage: NextPage = () => {
  return (
    <>
      <Header />
     
    
      <Contact />
      <Footer />
    </>
  )
}

export default ComponentPage;
