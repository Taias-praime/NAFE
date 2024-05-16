import { createContext } from "react";

export interface IToastContext {
    isVisible: boolean
    onClose: () => void
    onOpen: () => void
    onToggle: () => void
}

export const ModalContext = createContext<IToastContext>({} as IToastContext);