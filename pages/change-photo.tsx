import { get } from "lodash";
import { NextPage } from "next";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Cropper } from "react-cropper";
import Header from "../components/Header";
import Page from "../components/Page";
import Footer from "../components/Page/Footer";
import Toast from "../components/Toast";
import axios from "axios";
import { withAuthentication } from "../utils/withAuthentication";
import { redirectToAuth } from "../utils/redirectToAuth";
import { User } from "../types/User";
import { MeResponse } from "../types/MeResponse";
import { useAuth } from "../components/Auth/AuthContext";
import { render } from "react-dom";
import 'cropperjs/dist/cropper.css';

type ComponentPageProps = {
    user: User;
    token: string;
}

const ComponentPage: NextPage<ComponentPageProps> = ({ token, user }) => {

    const cropperRef = useRef<HTMLImageElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const [toastType, setToastType] = useState<'success' | 'danger'>('danger');
    const [toastOpen, setToastOpen] = useState(false);
    const [photo, setPhoto] = useState('');
    const [error, setError] = useState('');

    const {user: stateUser, setUser} = useAuth();

    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const imgElement: any = cropperRef?.current;
        const cropper = imgElement?.cropper;

        if (!cropper) {
            setError('Selecione uma fot.')
            return false;
        }

        if (imageRef?.current) {
            imageRef.current.src = cropper.getCroppedCanvas().toDataURL();
        }

        cropper.getCroppedCanvas().toBlob((blob: Blob) => {

            const formData = new FormData();

            formData.append('file', blob, 'photo.png');

            axios.put<User>(`/auth/photo`, formData, {
                baseURL: process.env.API_URL,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(({ data: { photo } }) => {
                user.photo = photo;
                setUser({
                    ...stateUser!,
                    photo,
                });
                setPhoto('')
                setToastType('success');
                setToastOpen(true);
                setTimeout(() => {
                    setToastOpen(false);
                }, 3000);
            }).catch((e) => {
                setToastType('danger');
                setToastOpen(true);

            });
        })


    }, [token, imageRef])

    useEffect(() => {

        if (error) {
            setToastType('danger');
            setToastOpen(true);
        } else {
            setToastOpen(false);
        }

    }, [error]);


    const onChangeFile = (event: any) => {
        const { files } = event.target as HTMLInputElement;

        if (files && files.length) {

            const reader = new FileReader();

            reader.onload = () => {
                setPhoto(String(reader.result));
            }

            reader.readAsDataURL(files[0]);
        }
    }

    const onSelectFile = () => {

        const inputFile = document.createElement('input');
        inputFile.type = 'file';

        inputFile.addEventListener('change', onChangeFile);

        inputFile.click();
    }

    return (
        <Fragment>
            <Header />

            <Page
                title={"Mudar Foto"}
                id="change-photo"
            >

                <form onSubmit={onSubmit}>

                    {photo && <Cropper
                        src={photo}
                        style={{ height: 400, width: '100%' }}
                        aspectRatio={1}
                        guides={false}
                        ref={cropperRef}
                    />}

                    {!photo && <img
                        src={`${process.env.API_URL}/photo/${user?.photo}`}
                        alt="Foto Atual"
                        id="photo-preview"
                        onClick={onSelectFile}
                        ref={imageRef}
                    />}

                    <input type="file" name="photo" id="file" />

                    <button type="button" onClick={onSelectFile} className="choose-photo">
                        {!photo && 'Procurar Foto'}
                        {photo && 'Procurar outra Foto'}
                    </button>

                    <Toast
                        type={toastType}
                        open={toastOpen}
                        onClose={() => setError('')}
                    >
                        {error && toastType === 'danger' && <p>{error}</p>}
                        {error && toastType === 'success' && <p>Foto atualizada com sucesso!</p>}
                    </Toast>

                    <Footer
                        buttons={[
                            {
                                value: "Salvar",
                                type: 'submit'
                            }
                        ]}
                    />
                </form>
            </Page>
        </Fragment>
    )
}

export default ComponentPage;

export const getServerSideProps = withAuthentication(async (context) => {

    try {

        const { token } = context.req.session;

        const { data: user } = await axios.get<MeResponse>(`/auth/me`, {
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return {
            props: {
                user,
                token,
            },
        };

    } catch (e) {
        return redirectToAuth(context)
    }

});
