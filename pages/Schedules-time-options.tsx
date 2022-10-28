import { Fragment, useCallback, useState } from "react"
import Header from "../components/Home/Header";
import Page from "../components/Page";
import Footer, { ButtonBack, ButtonContinue } from "../components/Page/Footer";
import { GetServerSideProps, NextPage } from "next";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../utils/session";
import { format, getDay, parse } from "date-fns";
import { ScheduleSession } from "../types/ScheduleSession";
import { TimeOption } from "../types/TimeOption";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import locale from 'date-fns/locale/pt-BR';
import { get } from "lodash";
import Toast from "../components/Toast";

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


  const save: SubmitHandler<FormData> = async (data) => {
    axios
    .post('/api/schedules/time-options', data)
    .then(() => router.push("/schedules-services"))
    .catch((error) => {
      setError('scheduleAt', {
        message: error.response?.data.message ?? error.message,
      });
    });
  }


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

          <h3>
            {format(parse(scheduleAt!, 'yyyy-MM-dd', new Date()),
              // 'EEEE, dd/MM/yyyy'
              "EEEE, d 'de' MMMM 'de' yyyy",
              { locale }
            )}

          </h3>

          <div className="options">
            {timeOptions.map((option) => (
              <label
                key={String(option.id)}
              >
                <input
                  type="radio"
                  value={option.id}
                  defaultChecked
                  {...register("timeOptionId", {
                    required: "Selecione o horário desejado",
                  })}
                />
                <span>{format(new Date(option.time), "HH:mm", {locale })}</span>
              </label>

            ))}
          </div>

            <Toast
              type="danger"
              open={Object.keys(errors).length > 0}
              onClose={() => clearErrors()}
            >

              {Object.keys(errors).map((err) => (
                get(errors, `${err}.message`, 'Verifique os Horários')
              ))}
            </Toast>
          <Footer />
        </form>
      </Page>
    </Fragment>
  )
}

export default ComponentPage;

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const { schedule } = req.session;

  if (!schedule?.scheduleAt) {
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
