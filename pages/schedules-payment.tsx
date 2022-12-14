import { addMonths, format } from "date-fns";
import { get } from "lodash";
import { GetServerSidePropsContext, NextPage, Redirect } from "next";
import { Fragment, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import Header from "../components/Header";
import Page from "../components/Page";
import Footer from "../components/Page/Footer";
import Toast from "../components/Toast";
import { isCPF } from "../utils/isCPF"
import { isCNPJ } from "../utils/isCNPJ"
import CreditCard from "../components/CreditCard";
import axios from "axios";
import { useRouter } from "next/router";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../utils/session";
import { withAuthentication } from "../utils/withAuthentication";
// import { ScheduleCreate } from "../types/ScheduleCreate";

type ScheduleCreate = {
    installments: number;
    cardToken: string;
    paymentMethod: string;
    document: string;
    cardFirstSixDigits: string;
    cardLastFourDigits: string;
    paymentTypeId: string;
}

type FormData = {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
    bank: string;
    installments: string;
    cardDocument: string;
    token: string;
    server?: string;
}

type Issuer = {
    id: string;
    name: string;
}

type InstallmentOption = {
    number: number;
    value: number;
    description: string;
}

declare var MercadoPago: any;

type ComponentPageProps = {
    amount: string;
}

const ComponentPage: NextPage<ComponentPageProps> = ({ amount }) => {

    const router = useRouter();
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors },
        clearErrors,
        setValue,
        watch,
    } = useForm<FormData>();

    const [mp, setMp] = useState<any>(null);
    const number = watch("number");
    const name = watch("name");
    const expiry = watch("expiry");
    const cvv = watch("cvv");
    const installments = watch("installments");
    const cardDocument = watch("cardDocument");
    const [bin, setBin] = useState("");
    const [issuers, setIssuers] = useState<Issuer[]>([]);
    const [installmentOptions, setInstallmentOptions] = useState<InstallmentOption[]>([]);
    const [flipped, setFlipped] = useState(false);
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [paymentTypeId, setPaymentTypeId] = useState("");

    const bank = watch("bank");
    const [token, setToken] = useState("");

    const createPayment = (data: ScheduleCreate) => {
        axios
            .post('/api/payment', data)
            .then(() => router.push(`/schedules-summary`))
            .catch(error => {
                setError('server', {
                    message: error.message
                });
            });
    }

    const onSubmit: SubmitHandler<FormData> = (data) => {

        const expirtyMonth = Number(expiry.split("/")[0]);
        const expirtyYear = Number(expiry.split("/")[1]);

        if (expirtyMonth < 0 && expirtyMonth > 12) {
            setError("expiry", {
                message: "M??s de vencimento inv??lido",
            });
            return;
        }

        if (expirtyYear < new Date().getFullYear()) {
            setError("expiry", {
                message: "Ano de vencimento inv??lido",
            });
            return;
        }

        if (number.length < 15) {
            setError("number", {
                message: "N??mero do cart??o inv??lido",
            });
            return;
        }


        if (cvv.length < 3) {
            setError('cvv', {
                message: 'CVV inv??lido'
            });
            return;
        }

        if (!isCPF(cardDocument) && !isCNPJ(cardDocument)) {
            setError('cardDocument', {
                message: 'CPF ou CNPJ inv??lido'
            });
            return;
        }

        mp.createCardToken({
            cardNumber: number,
            cardholderName: name,
            cardExpirationMonth: expiry.split("/")[0],
            cardExpirationYear: expiry.split("/")[1],
            securityCode: cvv,
            identificationType: cardDocument.length === 11 ? 'CPF' : 'CNPJ',
            identificationNumber: cardDocument,
        }).then((response: any) =>
            createPayment({
                cardToken: response.id,
                document: cardDocument,
                installments: Number(installments),
                paymentMethod: paymentMethodId,
                cardFirstSixDigits: response.first_six_digitis,
                cardLastFourDigits: response.last_four_digitis,
                paymentTypeId,
        })).catch((error: any) => {
            setError('token', {
                message: error.message
            });
        });
    }

    const initMercadoPago = () => {
        new MercadoPago(process.env.MERCADOPAGO_KEY, {
            language: 'pt-BR',
        })
    }

    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            if (mp) {
                setValue('number', '5031 4332 1540 6351');
                setValue('name', 'APRO');
                setValue('expiry', format(addMonths(new Date(), 1), 'MM/yy'));
                setValue('cvv', '123');
            }

        }
    }, [mp]);


    useEffect(() => {
        if (number && number.length >= 6 && number.substring(0, 6) !== bin) {
            setBin(number.substring(0, 6));
        }
    }, [number]);

    useEffect(() => {
        if (mp && bin) {
            mp.getInstallments({
                bin,
                amount,
                locale: 'pt-BR',
            }).then((response: any) => {

                const options = response[0];

                setPaymentMethodId(options.payment_method_id);
                setPaymentTypeId(options.payment_type_id);
                setValue('installments', '1')

                setInstallmentOptions(options.payer_costs.map(
                    (cost: any) => ({
                        number: cost.installments,
                        value: cost.total_amount,
                        description: cost.recommended_message,
                    })
                ));
            }).catch((error: any) => {
                setError('installments', {
                    message: error.message
                });
            });
        }
    }, [bin]);

    useEffect(() => {
        if (bin && paymentMethodId) {
            mp.getIssuers({
                bin,
                paymentMethodId,
            }).then((response: any) => {
                setIssuers(response.map((issuer: any) => ({
                    id: issuer.id,
                    name: issuer.name,
                })));
            }).catch((error: any) => {
                setError('bank', {
                    message: error.message
                })
            });
        }
    }, [bin, paymentMethodId]);

    useEffect(() => {
        console.log({ errors });
    }, [errors]);


    useEffect(() => {

        const script: HTMLScriptElement = document.createElement("script");

        script.src = 'https://sdk.mercadopago.com/js/v2';

        script.onload = initMercadoPago;

        document.body.appendChild(script);

    }, [])

    return (
        <Fragment>
            <Header />
            <Page
                pageColor="blue"
                title="Dados do Cart??o de Cr??dito"
                id=""
            >
                <form onSubmit={handleSubmit(onSubmit)}>

                    <input type="hidden" name="schedule_at" />
                    <input type="hidden" name="option" />
                    <input type="hidden" name="service" />

                    <div className="form-creditcard">
                        <div className="form-fields">
                            <div className="field">
                                <IMaskInput
                                    mask={'0000 0000 0000 0000'}
                                    unmask={true}
                                    value={number}
                                    onAccept={(value) => setValue('number', String(value))}
                                />
                                <label htmlFor="number">N??mero do Cart??o</label>
                            </div>

                            <div className="fields">
                                <div className="field">
                                    <IMaskInput
                                        mask={'00/0000'}
                                        placeholder={'MM/AAAA'}
                                        unmask={false}
                                        value={expiry}
                                        onAccept={(value) => setValue('expiry', String(value))}
                                    />
                                    <label htmlFor="expiry">Validade</label>
                                </div>
                                <div className="field">
                                    <IMaskInput
                                        mask={`000[0]`}
                                        placeholderChar={'MM/AAAA'}
                                        unmask={true}
                                        value={cvv}
                                        onAccept={(value) => setValue('cvv', String(value))}
                                        onFocus={() => setFlipped(true)}
                                        onBlur={() => setFlipped(false)}
                                    />
                                    <label htmlFor="cvv">C??digo de Seguran??a</label>
                                </div>
                            </div>

                            <div className="field">
                                <input id="name" className="name" {...register('name', {
                                    required: 'Preencha o nome impresso no cart??o.'
                                })} />
                                <label htmlFor="name">Nome Impresso no Cart??o</label>
                            </div>

                            {issuers.length > 1 &&
                                <div className="field">
                                    <select
                                        id="issuers"
                                        {...register('bank', {
                                            required: 'Selecione o banco emissor do cart??o.'
                                        })}
                                    >
                                        {issuers.map(({ id, name }, index) => (
                                            <option key={index} value={id}>{name}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="issuers">Banco Emissor</label>
                                </div>
                            }

                            <div className="field">
                                <select
                                    disabled={installmentOptions.length === 0}
                                    id="installments"
                                    {...register('installments', {
                                        required: 'Selecione a quantidade de parcelas.'
                                    })}

                                >
                                    {installmentOptions.map(({ number, description }, index) => (
                                        <option key={index} value={number}>{description}</option>
                                    ))}
                                </select>
                                <label htmlFor="installments">Parcelas</label>
                            </div>
                            <div className="field">
                                <IMaskInput
                                    id="card-document"
                                    mask={[{
                                        mask: '000.000.000-00',
                                    }, {
                                        mask: '00.000.000/0000-00'
                                    }]}
                                    unmask={true}
                                    value={cardDocument}
                                    onAccept={(value) => setValue('cardDocument', String(value))}
                                />
                                <label htmlFor="card-document">CPF ou CNPJ do Titular do Cart??o</label>
                            </div>
                        </div>

                        <div className="form-card">
                            <CreditCard
                                cvv={cvv}
                                expiry={expiry}
                                name={name}
                                number={number}
                                flipped={flipped}
                            />
                        </div>
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

                    <Footer />
                </form>

            </Page>
        </Fragment>
    )
}

export default ComponentPage;

type PaymentResponse = {
    amount: number;
}

export const getServerSideProps = withAuthentication(async ({ req }: GetServerSidePropsContext) => {
    try {


    const { data } = await axios.get<PaymentResponse>('/payment', {
        baseURL: process.env.API_URL,
        params: {
            services: req.session.schedule.services?.toString(),
        }
    });

    return {
        props: {
            amount: String(data.amount),
        } as ComponentPageProps,
    }
    } catch (error: any) {
        return {
            statusCode: 401,
            redirect: {
                destination: `/schedules-services`,
            } as Redirect,
        }
    }
});
