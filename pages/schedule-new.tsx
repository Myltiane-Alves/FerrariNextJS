import { NextPage } from "next";
import { Fragment } from "react";
import Calendar from "../components/Calendar";
import Header from "../components/Home/Header";
import Page from "../components/Page";
import Footer, { ButtonBack, ButtonContinue } from "../components/Page/Footer";

const SchedulesNew = () => {
  <Fragment>
    <Header />
    <Page
      pageColor="blue"
      title="Escolha a Data"
      id="page-schedule-new"
    >
      <Calendar/>
      <form action="schedules-time-options.html">
        <input type="hidden" name="schedule_at" />

       <Footer
          buttons={[
           ButtonBack,
           ButtonContinue
          ]}
       />
      </form>
    </Page>

  </Fragment>
}

export default SchedulesNew;
