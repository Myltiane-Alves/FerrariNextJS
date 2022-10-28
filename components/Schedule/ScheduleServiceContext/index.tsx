import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ScheduleService } from "../../../types/ScheduleService";

type ScheduleServiceContextProps = {
  services: ScheduleService[];
  selecteds: ScheduleService[];
}
const ScheduleServiceContext = createContext<ScheduleServiceContextProps>({
  services: [],
  selecteds: [],
})

export default function ScheduleServiceProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [services, setServices] = useState<ScheduleService[]>([]);
  const [selecteds, setSelecteds] = useState<ScheduleService[]>([]);

  const loadServices = () => {
    axios.get<ScheduleService[]>(`/services`, {
      baseURL: process.env.API_URL,
    })
    .then(({ data }) => setServices(data));
  }


  useEffect(() => loadServices(), []);

  return (
    <ScheduleServiceContext.Provider
      value={{services, selecteds}}
    >
      {children}
    </ScheduleServiceContext.Provider>
  )

}

export function useScheduleService() {
  const context = useContext(ScheduleServiceContext);

  if(!context) {
    throw new Error('useScheduleService must be used within a ScheduleServiceProvider');
  }

  return context;
}
