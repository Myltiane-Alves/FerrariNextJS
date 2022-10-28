
import { NextPage } from "next";

import Page from "../components/Page";
import Footer from "../components/Page/Footer";
import Panel from "../components/Schedule/Panel";
import ScheduleServiceProvider, { useScheduleService } from "../components/Schedule/ScheduleServiceContext";
import Toast from "../components/Toast";
import { ScheduleService } from "../types/ScheduleService";
import { formatCurrency } from "../utils/formatCurrency";


const SchedulesServicesPage = () => {
  const { services } = useScheduleService();

  return (
    <Page
      pageColor="blue"
      title="Escolha os Serviços"
      id="schedules-services"
      panel={<Panel />}
    >
      <form >
        <input type="hidden" name="schedule_at" />
        <input type="hidden" name="option" />

        <div className="options">
          {services.map(({ id, name, description, price }) => (
            <label
              key={String(id)}
            >
              <input type="checkbox" name="service" value={id} />
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

