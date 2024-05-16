import { createContext } from "react";
import { IModalContext } from "./modal.context";

export interface IDialogContext {
    onSetMessage: (message: string) => void
    modal: IModalContext;
    message: string
    setMessage: (message: string) => void
}

export const DialogContext = createContext<IDialogContext>({} as IDialogContext);