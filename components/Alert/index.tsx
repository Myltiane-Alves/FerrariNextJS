import { ReactNode } from "react";

type AlertProps = {
  children: ReactNode;
  type: 'success' | 'danger';
}

const Alert = ({ children, type }: AlertProps) => {
  return  <div className={["alert", type].join(" ")}>{children}</div>
}

export default Alert
