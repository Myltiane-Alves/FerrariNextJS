import { format } from "date-fns";
import locale from "date-fns/locale/pt-BR";
import { get } from "lodash";
import { NextPage, Redirect } from "next";
import { Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Header from "../components/Header";
import Page from "../components/Page";
import Footer, { ButtonBack } from "../components/Page/Footer";
import Toast from "../components/Toast";
import axios from "axios";
import { useRouter } from "next/router";
import { withAuthentication } from "../utils/withAuthentication";
import { ScheduleSession } from "../types/ScheduleSession";
import { Schedule } from "../types/Schedule";
import { formatCurrency } from "../utils/formatCurrency";
import { ScheduleCreate } from "../types/ScheduleCreate";

type FormData = {
    server?: unknown;
}

type ComponentPageProps = {
    schedule: ScheduleSession;
    data: Schedule;
    token: string;
}

const ComponentPage: NextPage<ComponentPageProps> = ({ schedule, data, token }) => {

    const {
        handleSubmit,
        setError,
        formState: { errors },
        clearErrors,
    } = useForm<FormData>();

    const router = useRouter();

    const onSubmit: SubmitHandler<FormData> = () => {

        axios
            .post(`/payment/${data.id}`, null, {
                baseURL: process.env.API_URL,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(() => router.push(`/schedules-complete`))
            .catch((e: any) => {
                if (e.response.data.error === "Unauthorized") {
                    router.push(`/auth?next=${router.pathname}`);
                } else {
                    setError("server", {
                        type: "required",
                        message: e.message,
                    });
                }
            });

    }
    return (
        <Fragment>
            <Header />
            <Page
                pageColor="blue"
                title={
                    <Fragment>
                        Resumo de Pedido <small>Confira os Detalhes do pedido</small>
                    </Fragment>
                }
                id="schedules-address-form"
            >
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="field">
                        <input
                            type="text"
                            name="payment"
                            id="payment"
                            value={schedule.paymentTypeId === "credit_card" ? "Cart??o de Cr??dito" : "Cart??o de D??bito"}
                            readOnly
                        />
                        <label htmlFor="payment">Forma de Pagamento</label>
                    </div>

                    <div className="field">
                        <input
                            type="text"
                            name="creditcard"
                            id="creditcard"
                            value={`${schedule.cardFirstSixDigits} **** ${schedule.cardLastFourDigits}`}
                            readOnly
                        />
                        <label htmlFor="creditcard">Cart??o Final</label>
                    </div>

                    <div className="field">
                        <input
                            type="text"
                            name="installments"
                            id="installments"
                            value={data.installments === 1 ? "?? vista" : `${data.installments}x`}
                            readOnly
                        />
                        <label htmlFor="installments">Parcelas</label>
                    </div>

                    <div className="field">
                        <input
                            type="text"
                            name="services"
                            id="services"
                            value={data.ScheduleService.length ?? 0}
                            readOnly
                        />
                        <label htmlFor="services">Quantidade de Servi??os</label>
                    </div>

                    <div className="field">
                        <input
                            type="text"
                            name="schedule_at"
                            id="schedule_at"
                            value={format(
                                new Date(data.scheduleAt),
                                "d 'de' MMMM 'de' yyyy",
                                { locale }
                            )}
                            // value={"23 de julho de 2020 ??s 9:00"}
                            readOnly
                        />
                        <label htmlFor="schedule_at">Data do Servi??o</label>
                    </div>

                    <div className="field">
                        <input
                            type="text"
                            name="total"
                            id="total"
                            value={formatCurrency(Number(data.total)) ?? 0}
                            readOnly
                        />
                        <label htmlFor="total">Valor Total</label>
                    </div>

                    <Toast
                        type='danger'
                        open={Object.keys(errors).length > 0}
                        onClose={() => clearErrors()}
                    >
                        {Object.keys(errors).map((err) => (
                            get(errors, `${err}.message`, 'Verifique os servi??os selecionados.')
                        ))}
                    </Toast>
                    <Footer
                        buttons={[
                            ButtonBack,
                            {
                                value: "Confirmar",
                                type: "submit",
                            }
                        ]}
                    />

                </form>

            </Page>
        </Fragment>
    )
}

export default ComponentPage;

export const getServerSideProps = withAuthentication(async ({ req }) => {

    const { schedule, token } = req.session;

    const { data } = schedule;

    if (!data) {
        return {
            redirect: {
                destination: '/schedules-payment',
            } as Redirect,
        }
    }

    return {
        props: {
            schedule,
            data,
            token
        }
    }

});
