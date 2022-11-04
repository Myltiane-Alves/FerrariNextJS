import { format } from "date-fns";
import locale from "date-fns/locale/pt-BR";
import { get } from "lodash";
import { NextPage, Redirect } from "next";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import Header from "../components/Header";
import Page from "../components/Page";
import Footer from "../components/Page/Footer";
import Toast from "../components/Toast";
import axios from "axios";
import { useRouter } from "next/router";
import { withAuthentication } from "../utils/withAuthentication";
import { ScheduleSession } from "../types/ScheduleSession";
import { Schedule } from "../types/Schedule";
import { redirectToAuth } from "../utils/redirectToAuth";
import Title from "../components/Page/Title";
import ScheduleItem from "../components/Schedule/ScheduleItem";


type FormData = {
    server?: unknown;
}

type ComponentPageProps = {
    schedules: Schedule[];
    token: string;
}

const ComponentPage: NextPage<ComponentPageProps> = ({ schedules, token, }) => {

    const [nextSchedules, setNextSchedules] = useState<Schedule[]>(schedules.filter(s => new Date(s.scheduleAt).getTime() > new Date().getTime()));
    const [historySchedules, setHistorySchedules] = useState<Schedule[]>(schedules.filter(s => new Date(s.scheduleAt).getTime() <= new Date().getTime()));

    const onCanceled = () => {

        axios.get<Schedule[]>(`/schedules`, {
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(({ data }) => {

            setNextSchedules(data.filter(s => new Date(s.scheduleAt).getTime() > new Date().getTime()));
            setHistorySchedules(data.filter(s => new Date(s.scheduleAt).getTime() <= new Date().getTime()));

        }).catch(console.error);

    }

    return (
        <Fragment>
            <Header />
            <Page
                pageColor="green"
                title="Agendamentos"
                id="schedules"
            >
                 <ul>
                    {nextSchedules.length === 0 && <li> Não há póximos agendamentos.</li>}
                    {nextSchedules.map((schedule, index) => <ScheduleItem key={index}  token={token} schedule={schedule} onCanceled={onCanceled} />)}
                 </ul>

                <Title value="Histórico"/>

                <ul>
                    {historySchedules.length === 0 && <li>Não há histórico de agendamentos.</li>}
                    {historySchedules.map((schedule, index) => <ScheduleItem key={index} token={token} schedule={schedule} />)}
                </ul>

                <Footer
                    buttons={[
                        {
                            value: "Novo Agendamento",
                            href: "/schedules-new",
                            className:"black"
                        }
                    ]}
                />
            </Page>
        </Fragment>
    )
}

export default ComponentPage;

export const getServerSideProps = withAuthentication(async (context) => {

    try {

        const { token } = context.req.session;

        const { data: schedules } = await axios.get(`/schedules`, {
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return {
            props: {
                schedules,
                token,
            },
        };

    } catch(e) {
        return redirectToAuth(context)
    }

});
