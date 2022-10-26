
import { Fragment, useCallback, useState } from "react";

import Header from "../components/Home/Header";
import Page from "../components/Page";
import Footer, { ButtonBack, ButtonContinue } from "../components/Page/Footer";
import { GetServerSideProps, NextPage } from "next";
import { withIronSessionSsr } from "iron-session/next/dist";
import { sessionOptions } from "../utils/session";
import { parse } from "date-fns";
import { ScheduleSession } from "../types/ScheduleSession";
import { TimeOption } from "../types/TimeOption";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";

type FormData = {
  scheduleAt: string;
  timeOptionId: string;
}

type ComponentPageProps = {
  schedule: ScheduleSession;
  timeOptions: TimeOption[];
}


const ComponentPage: NextPage<ComponentPageProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<FormData>();
  const router = useRouter();
  const [scheduleAt] = useState(props.schedule.scheduleAt);
  const [timeOptions] = useState(props.timeOptions);


  axios
  .post('/api/schedules/time-options', data)
  .then(() => router.push("/schedules-services"))
  .catch((error) => {
    setError('scheduleAt', {
      message: error.response?.data.message ?? error.message,
    });
  });

};

  return (
    <Fragment>
      <Header />
      <Page
        pageColor="blue"
        title="Escolha o Horário"
        id="schedules-time-options"
      >


        <header className="page-title">
          <h2>Horários do Dia</h2>
          <hr />
        </header>

        <form action="schedules-services.html">
          <input type="hidden" name="schedule_at" />

          <h3>Quinta, 23 de julho de 2020</h3>

          <div className="options">
            <label>
              <input type="radio" name="option" value="9:00" checked />
              <span>9:00</span>
            </label>

            <label>
              <input type="radio" name="option" value="10:00" />
              <span>10:00</span>
            </label>

            <label>
              <input type="radio" name="option" value="11:00" />
              <span>11:00</span>
            </label>

            <label>
              <input type="radio" name="option" value="12:00" />
              <span>12:00</span>
            </label>

            <label>
              <input type="radio" name="option" value="13:00" />
              <span>13:00</span>
            </label>

            <label>
              <input type="radio" name="option" value="14:00" />
              <span>14:00</span>
            </label>

            <label>
              <input type="radio" name="option" value="15:00" />
              <span>15:00</span>
            </label>
          </div>

          <Footer />
        </form>

      </Page>

    </Fragment>
  )
}

export default ComponentPage;

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const { schedule } = req.session;

  if (schedule?.scheduleAt) {
    return {
      redirect: {
        destination: '/schedules-new',
        permanent: false
      }
    }
  }
  const day = getDay(
    parse(String(schedule.scheduleAt), 'yyyy-MM-dd', new Date())
  );

  const { data: timeOptions } = await axios.get<TimeOption[]>("/time-options", {
    baseURL: process.env.API_URL,
    params: {
      day,
    },
  });

    return {
    props: {
      schedule,
      timeOptions,
    },
  };

}, sessionOptions)
