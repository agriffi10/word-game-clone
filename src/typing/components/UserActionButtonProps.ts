/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserActionButtonProps = {
  callback: (arg: any) => void;
  arg?: any;
  children: React.ReactNode;
};
