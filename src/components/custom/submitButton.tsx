import React from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
// import { cn } from '../../lib/utils';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	state: boolean;
}

const SubmitButton = ({ state, children, ...props }: IProps) => {
	return (
		<Button type="submit" disabled={state} {...props}>
			{state ? <Loader2 className='animate-spin' /> : children}
		</Button>
	);
};

export default SubmitButton;
