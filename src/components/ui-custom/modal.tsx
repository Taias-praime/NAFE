import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import {
    SheetContent,
} from '../ui/modified-sheet';
import { Sheet, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

interface ModalProps {
    open: boolean,
    title?: string
    className: string
    label: ReactNode | string,
    children: ReactNode,
    openModal: () => void;
    onOpenChange: (value: boolean) => void;
}

const Modal = ({ open, label, title, className, children, openModal, onOpenChange }: ModalProps) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger onClick={openModal} className={cn(className, 'outline-none')}>
                {label}
            </SheetTrigger>

            <SheetContent className="w-96 overflow-y-auto">
                <SheetHeader className="">
                    <SheetTitle className='pb-10 text-center'>{title}</SheetTitle>
                </SheetHeader>

                {/* ----- content ---- */}
                <div className="">
                    {children}
                </div>
                {/* ----- oef content ---- */}
            </SheetContent>
        </Sheet>
    );
};

export default Modal;
