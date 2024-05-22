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

const AddEvent = ({ children, className }: any) => {

	return (
		<Sheet>
			<SheetTrigger className={cn(className, 'outline-none')}>
				{children}
			</SheetTrigger>
			<SheetContent className="!max-w-full w-full md:w-[1200px]">
				<SheetHeader>
					<SheetTitle className='pb-10'> Create Event </SheetTitle>
					{/* <SheetDescription></SheetDescription> */}
				</SheetHeader>

				{/* ----- content ---- */}
                { <CreateEvent /> }
				{/* ----- oef content ---- */}

			</SheetContent>
		</Sheet>
	);
};

export default AddEvent;
