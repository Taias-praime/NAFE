import { ReactNode, useState } from 'react';
import { cn } from '../../lib/utils';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet';
import DepartmentDashboard from './departmentDashboard';

interface EditDepartmentProps {
	children: ReactNode;
	className?: string;
	label: string;
	tenantId: string;
}

const EditDepartment = ({ children, className, label, tenantId }: EditDepartmentProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Sheet open={isOpen} onOpenChange={(newVal: boolean) => setIsOpen(newVal)}>
			<SheetTrigger onClick={() => setIsOpen(!isOpen)} className={cn(className, 'outline-none w-full')}>
				{children}
			</SheetTrigger>

			<SheetContent className="!max-w-full w-full md:w-[1200px] overflow-y-auto">
				<SheetHeader>
					<SheetTitle className='pb-10'> {label} </SheetTitle>
				</SheetHeader>

				{/* ----- content ---- */}
				<DepartmentDashboard tenantId={tenantId} />
				{/* ----- oef content ---- */}
			</SheetContent>
		</Sheet>
	);
};

export default EditDepartment;
