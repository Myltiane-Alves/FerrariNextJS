import axios from "axios";
import { withIronSessionSsr } from "iron-session/next/dist";
import { get } from "lodash";
import { GetServerSidePropsContext, NextPage, Redirect } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import Header from "../components/Header";
import Page from "../components/Page"
import Footer from "../components/Page/Footer";
import Toast from "../components/Toast";
import { Address } from "../types/Address";
import { redirectToAuth } from "../utils/redirectToAuth";
import { sessionOptions } from "../utils/session";
import { withAuthentication } from "../utils/withAuthentication";

type FormData = {
    billingAddressId: string;
}

type ComponentPageProps = {
    addresses: Address[];
    addressSelected: number
}

const ComponentPage: NextPage<ComponentPageProps> = ({ addresses, addressSelected }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
        setError,
        setValue,

    } = useForm<FormData>();
    const router = useRouter();

    const onSubmit: SubmitHandler<FormData> = ({ billingAddressId }) => {

        if (!Number(billingAddressId) || isNaN(Number(billingAddressId))) {
            setError("billingAddressId", {
                message: "Selecione um endereço de cobrança.",
            });
        }

        axios.post('/api/schedules/address', { billingAddressId, })
            .then(() => { router.push("/schedules-payment") })
            .catch((e: any) => {
                if (e.response.data.error === "Unauthorized") {
                    router.push(`/auth?next=${router.pathname}`);
                } else {
                    setError("billingAddressId", {
                        type: "required",
                        message: e.message,
                    });
                }
            });

    }

    useEffect(() => {
        if (addressSelected > 0) setValue("billingAddressId", String(addressSelected));
    }, [addressSelected]);

    return (
        <Fragment>
            <Header />
            <Page
                pageColor="blue"
                title="Endereço De Cobrança"
                id="schedules-address"
            >
                <form onSubmit={handleSubmit<FormData>(onSubmit)}>
                    <Link href="schedules-address-create.html">
                        <a className="btn-create">Novo Endereço</a>
                    </Link>

                    <hr />

                    <div className="addresses">
                        {addresses.map(({
                            id,
                            street,
                            number,
                            complement,
                            district,
                            city,
                            state,
                            zipCode,
                        }) => (

                            <label key={String(id)}>
                                <div>
                                    <input
                                        type="radio"
                                        {...register("billingAddressId")}
                                        value={id}
                                    />
                                    <div className="circle">
                                        <div></div>
                                    </div>
                                    <address>
                                        <strong>{street}{number && <Fragment>, {number}</Fragment>}</strong>
                                        <br />
                                        {complement && <Fragment>{complement} - </Fragment>}
                                        <br />
                                        {city} - {state}
                                        <br />
                                        {zipCode}
                                    </address>
                                </div>
                                <Link href="/schedules-address-update">
                                    <a className="btn-update">Editar</a>
                                </Link>
                            </label>
                        ))}


                    </div>
                    <Toast
                        type='danger'
                        open={Object.keys(errors).length > 0}
                        onClose={() => clearErrors()}
                    >
                        {Object.keys(errors).map((err) => (
                            get(errors, `${err}.message`, 'Verifique os serviços selecionados.')
                        ))}
                    </Toast>
                    <Footer />
                </form>
            </Page>
        </Fragment>
    )

}

export default ComponentPage;

export const getServerSideProps = withAuthentication(async (context) => {

    try {
        const { data: addresses } = await axios.get<Address[]>("/me/addresses", {
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${context.req.session.token}`,
            },
        });

        return {
            props: {
                addresses,
                addressSelected: Number(context.query.selected) ?? 0,
            }
        }
    } catch (e: any) {
        return redirectToAuth(context)
    }
})


{/* <label>
    <div>
        <input type="radio" name="address" value="1" />
        <div className="circle">
            <div></div>
        </div>
        <address>
            <strong>Av. Paulista, 500</strong><br />
            Bela Vista<br />
            São Paulo - SP<br />
            01310-100
        </address>
    </div>
    <Link href="schedules-address-update.html" >
        <a className="btn-update">Editar</a>
    </Link>

</label> */}
