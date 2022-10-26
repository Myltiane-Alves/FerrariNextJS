import axios from "axios";
import { format } from "date-fns";
import Router, { useRouter } from "next/router";
import { Fragment, useCallback, useState } from "react";
import Calendar from "../components/Calendar";
import Header from "../components/Home/Header";
import Page from "../components/Page";
import Footer, { ButtonBack, ButtonContinue } from "../components/Page/Footer";
import { NextPage } from "next";

const ComponentPage:NextPage = () => {
  const router = useRouter();
  const [scheduleAt, setScheduleAt] = useState<Date | null>(null);

  const onSubmit = useCallback(
    (e: any) => {
     e.preventDefault();

      if(!scheduleAt) {
        console.error('scheduleAt is null');
        return false;
      }

      axios
        .post('/api/schedules/new', {
         scheduleAt: format(scheduleAt, 'yyyy-MM-dd')
        })
        .then(({ data }) => router.push('/schedules-time-options'))
        .catch((error) => {
          console.error(error);
        });
    },
    [scheduleAt]
  );

  return (
    <Fragment>
      <Header />
      <Page
        pageColor="blue"
        title="Escolha a Data"
        id="page-schedule-new"
      >
        <Calendar
          selected={new Date()}
          onChange={(date) => setScheduleAt(date)}
        />
        <form onSubmit={onSubmit}>
          <input
            type="hidden"
            name="schedule_at"
            value={scheduleAt ? format(scheduleAt, 'yyyy-MM-dd') : ''}
          />

          <Footer
            buttons={[
              ButtonBack,
              ButtonContinue
            ]}
          />
        </form>
      </Page>

    </Fragment>

  )
}

export default ComponentPage;
