import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import {
    SheetContent,
} from '../ui/modified-sheet';
import { Trash2 } from 'lucide-react';
import { Sheet, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

interface ModalProps {
    open: boolean,
    title?: string
    className: string
    label: ReactNode | string,
    children: ReactNode,
    openModal: () => void;
    deleteImage?: (e: { preventDefault: () => void }) => void;
    onOpenChange: (value: boolean) => void;
}

const Modal = ({ open, label, title, className, children, openModal, deleteImage, onOpenChange }: ModalProps) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger onClick={openModal} className={cn(className, 'outline-none')}>
                {label}
            </SheetTrigger>

            <SheetContent className="w-96 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className='pb-10'>{title}</SheetTitle>
                    <SheetTrigger onClick={deleteImage} className={cn(className, 'outline-none absolute right-4 top-4 bg-white rounded-full')}>
                        <Trash2 className="text-red-600" />
                    </SheetTrigger>
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
