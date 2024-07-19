import { ReactNode, useState } from 'react';
import { cn } from '../../lib/utils';
import {
    SheetContent,
} from '../ui/modified-sheet';
import { Sheet, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';

interface ModalProps {
    open: boolean,
    title?: string
    className: string
    label: ReactNode | string,
    children: ReactNode,
    onOpenChange: (value: boolean) => void;
    setIsDelete?: (value: boolean) => void;
}

const Modal = ({ open, label, title, className, children, onOpenChange, setIsDelete}: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger onClick={() => setIsOpen(!isOpen)}  className={cn(className, 'outline-none')}>
                {label}
            </SheetTrigger>

            <SheetContent className="w-96 overflow-y-auto">
                <SheetHeader className="">
                    <SheetTitle className='pb-10 text-center'>{title}</SheetTitle>
                    {
                        setIsDelete &&  <Button onClick={() => setIsDelete(true)} variant="link" className="absolute right-0 top-3" > Delete</Button>
                    }
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
