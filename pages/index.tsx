import type { GetServerSidePropsContext, NextPage } from 'next'
import Banner from '../components/Home/Banner'

import Contact from '../components/Home/Contact'
import Footer from '../components/Home/Footer'
import Header from '../components/Home/Header'
import Service from '../components/Home/Service'
import { sessionOptions } from '../utils/session'
import { withIronSessionSsr } from 'iron-session/next'

const ComponentPage: NextPage = () => {
  return (
    <>
      <Header />
      <Banner/>
      <Service />
      <Contact />
      <Footer />
    </>
  )
}

export default ComponentPage;

export const getServerSideProps = withIronSessionSsr( async (context: 
GetServerSidePropsContext) => {
  
  context.req.session.token = "token";
  await context.req.session.save();

  return {
    props: {

    }
  }

}, sessionOptions)