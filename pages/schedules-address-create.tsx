import axios from "axios";
import { get } from "lodash";
import { NextPage, } from "next";
import { useRouter } from "next/router";
import { Fragment, useCallback } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import Header from "../components/Header";
import Page from "../components/Page"
import Footer from "../components/Page/Footer";
import Toast from "../components/Toast";
import { Address } from "../types/Address";
import { getOnlyNumbers } from "../utils/getOnlyNumbers";
import { withAuthentication } from "../utils/withAuthentication";

import { useAuth } from "../components/Auth/AuthContext";

type ZipCodeResponse = {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
}

type FormData = {
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

type ComponentPageProps = {
    addresses: Address[];
    addressSelected: number
}

type AddressCreateResponse = Address;

const ComponentPage: NextPage = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
        setError,
        setValue,
        watch
    } = useForm<FormData>();

    const zipCode = watch("zipCode");
    const router = useRouter();
    const { token } = useAuth()
    const searchZipCode = useCallback((value: string) => {

        value = getOnlyNumbers(value);

        if (value.length >= 8 && value !== getOnlyNumbers(zipCode)) {

            axios.get<ZipCodeResponse>(`/addresses/zip-code/${value}`, {
                baseURL: process.env.API_URK,
            })
                .then(({ data }) => {

                    clearErrors();
                    setValue("street", data.logradouro);
                    setValue("district", data.bairro);
                    setValue("complement", data.complemento);
                    setValue("city", data.localidade);
                    setValue("state", data.uf);
                    setValue("country", "Brasil");

                    const numberField = document.querySelector<HTMLInputElement>("#number");

                    if (numberField) {
                        numberField.focus();
                    }

                })
                .catch(() => {
                    setError("zipCode", {
                        type: "required",
                        message: "CEP n??o encontrado",
                    });
                })
        }
    }, [zipCode]);

    const onSubmit: SubmitHandler<FormData> = (data) => {

        data.zipCode = getOnlyNumbers(zipCode);

        axios.post<AddressCreateResponse>("/addresses", data, {
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(({ data: address }) => {
                router.push(`/schedules-address?selected=${address.id}`);
            })
            .catch((e) => {
                if (e.response.data.error === "Unauthorized") {
                    router.push(`/auth?next=${router.pathname}`);
                } else {
                    setError("zipCode", {
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
                title="Novo Endere??o"
                id="schedules-address-form"
            >
                <form onSubmit={handleSubmit<FormData>(onSubmit)}>
                    <div className="fields zipcode">
                        <div className="field">
                            <input
                                type="text"
                                id="zipcode"
                                {...register("zipCode", {
                                    required: "O campo CEP ?? obrigat??rio.",
                                    onChange: (event) => { searchZipCode(event.target.value) },
                                })}
                            />
                            <label htmlFor="zipcode">CEP</label>
                        </div>
                        <div className="field">
                            <button
                                type="button"
                                id="btn-search"
                                onClick={() => searchZipCode(zipCode)}
                            >Buscar</button>
                        </div>
                    </div>

                    <div className="fields address-number">
                        <div className="field">
                            <input
                                type="text"
                                id="address"
                                {...register("street", {
                                    required: "O campo endere??o ?? obrigat??rio.",
                                })}
                            />
                            <label htmlFor="address">Endere??o</label>
                        </div>

                        <div className="field">
                            <input
                                type="text"
                                id="number"
                                {...register("number")}
                            />
                            <label htmlFor="number">N??mero</label>
                        </div>
                    </div>

                    <div className="field">
                        <input
                            type="text"
                            id="complement"
                            {...register("complement")}
                        />
                        <label htmlFor="complement">Complemento</label>
                    </div>

                    <div className="field">
                        <input
                            type="text"
                            id="district"
                            {...register("district", {
                                required: "O campo bairro ?? obrigat??rio.",
                            })}
                        />
                        <label htmlFor="district">Bairro</label>
                    </div>

                    <div className="field">
                        <input
                            type="text"
                            id="city"
                            {...register("city", {
                                required: "O campo cidade ?? obrigat??rio.",
                            })}
                        />
                        <label htmlFor="city">Cidade</label>
                    </div>

                    <div className="fields">
                        <div className="field">
                            <input
                                type="text"
                                id="state"
                                {...register("state", {
                                    required: "O campo estado ?? obrigat??rio.",
                                })}
                            />
                            <label htmlFor="state">Estado</label>
                        </div>

                        <div className="field">
                            <input
                                type="text"
                                id="country"
                                {...register("country", {
                                    required: "O campo pa??s ?? obrigat??rio",
                                })}
                            />
                            <label htmlFor="country">Pa??s</label>
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

export const getServerSideProps = withAuthentication();
