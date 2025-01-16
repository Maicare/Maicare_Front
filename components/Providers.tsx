"use client";

import React, { FunctionComponent, PropsWithChildren } from "react";

import ModalProvider from "@/components/providers/ModalProvider";

const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {


  return (

      <ModalProvider>{children}</ModalProvider>

  );
};

export default Providers;
