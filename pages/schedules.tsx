import { format } from "date-fns";
import locale from "date-fns/locale/pt-BR";
import { get } from "lodash";
import { NextPage, Redirect } from "next";
import { Fragment } from "react";
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


type FormData = {
    server?: unknown;
}

type ComponentPageProps = {
    schedule: ScheduleSession;
    data: Schedule;

}

const ComponentPage: NextPage<ComponentPageProps> = ({ schedule, data, }) => {

    const {
        handleSubmit,
        setError,
        formState: { errors },
        clearErrors,
    } = useForm<FormData>();

    const router = useRouter();

    return (
        <Fragment>
            <Header />
            <Page
                pageColor="green"
                title={
                    <Fragment>
                         <h1>Pagamento Efetuado<small>Confira os detalhes do pedido</small></h1>
                    </Fragment>
                }
                id="schedules-cmplete"
            >
                 <header className="page-title">
                    <h2>Obrigado!</h2>
                    <hr />
                </header>

                <p>{format(
                    new Date(data.scheduleAt),
                    "d 'de' MMMM 'de' yyyy",
                    { locale }
                )}</p>
                <p>
                    Número do Pedido: {String(data.id).padStart(6, "0")}<small>Cartão de Crédito final {schedule.cardLastFourDigits}</small>
                </p>

                <Toast
                    type='danger'
                    open={Object.keys(errors).length > 0}
                    onClose={() => clearErrors()}
                >
                    {Object.keys(errors).map((err) => (
                        get(errors, `${err}.message`, 'Verifique os serviços selecionados.')
                    ))}
                </Toast>
                <Footer
                    buttons={[
                        {
                            value: "Agendamentos",
                            href: "/schedules",
                        }
                    ]}
                />
            </Page>
        </Fragment>
    )
}

export default ComponentPage;

export const getServerSideProps = withAuthentication(async ({ req }) => {

    try {

        const { schedule, token } = req.session;

        const { data } = await axios.get(`/schedules/${req.session.schedule.data?.id}`, {
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return {
            props: {
                schedule,
                data,
            },
        };

    } catch(e) {
        return {
            redirect: {
                destination: '/schedules-summary',
            } as Redirect,
        }
    }

});
