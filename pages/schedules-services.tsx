
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Page from "../components/Page";
import Footer from "../components/Page/Footer";
import Panel from "../components/Schedule/Panel";
import ScheduleServiceProvider, { useScheduleService } from "../components/Schedule/ScheduleServiceContext";
import Toast from "../components/Toast";
import { ScheduleService } from "../types/ScheduleService";
import { formatCurrency } from "../utils/formatCurrency";

type FormData = {
  services: number[];
  server?: unknown;
}

const SchedulesServicesPage = () => {
  const { services, addSelectedService, removeSelectedService } = useScheduleService();

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>();
  const router = useRouter();


  const onChangeService = (cheked: boolean, serviceId: number) => {

    if (cheked) {
      addSelectedService(serviceId);
    } else {
      removeSelectedService(serviceId);
    }

  }

  const save: SubmitHandler<FormData> = (data) => {

  }

  return (
    <Page
      pageColor="blue"
      title="Escolha os Serviços"
      id="schedules-services"
      panel={<Panel />}
    >
      <form onSubmit={handleSubmit(save)}>

        <input type="hidden" name="schedule_at" />
        <input type="hidden" name="option" />

        <div className="options">
          {services.map(({ id, name, description, price }) => (
            <label
              key={String(id)}
            >
              <input
                type="checkbox"
                name="service"
                value={id}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onChangeService(e.target.checked, Number(id))
                }}
              />
              <div className="square">
                <div></div>
              </div>
              <div className="content">
                <span className="name">{name}</span>
                <span className="description">{description}</span>
                <span className="price">{formatCurrency(+price)}</span>
              </div>
            </label>
          ))}
        </div>
        <Footer />
      </form>
    </Page>
  )
}


const ComponentPage: NextPage = () => {
  return (
    <ScheduleServiceProvider>
      <SchedulesServicesPage />
    </ScheduleServiceProvider>
  )
}

export default ComponentPage;

