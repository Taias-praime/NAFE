import { ReactNode, useState } from 'react';
import { cn } from '../../lib/utils';
import CreateEvent from '../../modules/CreateEvent';
import {
	Sheet,
	SheetContent,
	// SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet';

const AddEvent = ({ children, className }: { children: ReactNode, className: string }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const dismiss = () => {
        setIsOpen(false);
    }

	return (
		<Sheet open={isOpen} onOpenChange={(newVal: boolean) => setIsOpen(newVal)}>
			<SheetTrigger onClick={() => setIsOpen(!isOpen)} className={cn(className, 'outline-none')}>
				{children}
			</SheetTrigger>

			<SheetContent className="!max-w-full w-full md:w-[1200px] overflow-y-auto">
				<SheetHeader>
					<SheetTitle className='pb-10'> Create Event </SheetTitle>
					{/* <SheetDescription></SheetDescription> */}
				</SheetHeader>

				{/* ----- content ---- */}
                { <CreateEvent onCancel={dismiss} /> }
				{/* ----- oef content ---- */}
			</SheetContent>
		</Sheet>
	);
};

export default AddEvent;
