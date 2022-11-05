import type { GetServerSidePropsContext, NextPage } from 'next'
import Banner from '../components/Home/Banner'

import Contact from '../components/Home/Contact'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Service from '../components/Home/Service'
import { sessionOptions } from '../utils/session'
import { withIronSessionSsr } from 'iron-session/next'
import { Fragment } from 'react'

const ComponentPage: NextPage = () => {
  return (
    <Fragment>
      <Header />
      <Banner/>
      <Service />
      <Contact />
      <Footer />
    </Fragment>
  )
}

export default ComponentPage;

export const getServerSideProps = withIronSessionSsr( async (context:
GetServerSidePropsContext) => {

  console.log('TOKEN', context.req.session.token);

  return {
    props: {

    }
  }

}, sessionOptions)
