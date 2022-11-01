import axios from "axios";
import { withIronSessionSsr } from "iron-session/next/dist";
import { GetServerSidePropsContext, NextPage, Redirect } from "next";
import { Fragment } from "react"
import Header from "../components/Header";
import Page from "../components/Page"
import { sessionOptions } from "../utils/session";
import { withAuthentication } from "../utils/withAuthentication";


const ComponentPage: NextPage = () => {
    return  (
        <Fragment>
            <Header/>
            <Page
                pageColor="blue"
                title="Endereços"
                id="schedules-addresses"
            >
                <form></form>
            </Page>
        </Fragment>
    )

}

export default ComponentPage;

export const getServerSideProps = withAuthentication()
