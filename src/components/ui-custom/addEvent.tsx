import { ReactNode, useState } from 'react';
import { cn } from '../../lib/utils';
import CreateEvent from '../../modules/CreateEvent';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet';

interface AddEventProps {
	children: ReactNode;
	className: string;
	eventId?: string;
	currentStep?: number;
	isEditEvent: boolean;
	setIsEditEvent: (value: boolean) => void;
	setReload: (value: boolean) => void;
}

const AddEvent = ({ children, className, currentStep, isEditEvent, setIsEditEvent, setReload, eventId }: AddEventProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const dismiss = () => {
		setIsOpen(false);
		setIsEditEvent(false);
		setReload(true);
	}

	return (
		<Sheet open={isOpen} onOpenChange={(newVal: boolean) => setIsOpen(newVal)}>
			<SheetTrigger onClick={() => setIsOpen(!isOpen)} className={cn(className, 'outline-none')}>
				{children}
			</SheetTrigger>

			<SheetContent className="!max-w-full w-full md:w-[1200px] overflow-y-auto">
				<SheetHeader>
					<SheetTitle className='pb-10'> {isEditEvent ? 'Edit Event' : 'Create Event'} </SheetTitle>
				</SheetHeader>

				{/* ----- content ---- */}
				{<CreateEvent setReload={setReload} onCancel={dismiss} setIsOpen={setIsOpen} isEditEvent={isEditEvent} currentStep={currentStep ?? 1 } eventId={eventId ?? null} />}
				{/* ----- oef content ---- */}
			</SheetContent>
		</Sheet>
	);
};

export default AddEvent;
