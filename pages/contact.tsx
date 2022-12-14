import { withIronSessionSsr } from "iron-session/next";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Contact from "../components/Home/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { sessionOptions } from "../utils/session";

type ComponentPageType = {
  token: string;
}
const ComponentPage: NextPage<ComponentPageType> = ({ token }) => {
  return (
    <>
      <Header />
      <Contact />
      <Footer />
    </>
  )
}

export default ComponentPage;

export const getServersSideProps = withIronSessionSsr(async (context: GetServerSidePropsContext) => {

  return {
    props: {
      token: context.req.session.token
    }

  }
}, sessionOptions)
