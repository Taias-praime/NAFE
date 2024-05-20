import { useLocation } from 'react-router-dom';
import { HEADER_HEIGHT } from '../../lib/utils';

export const Header = () => {
	const { pathname } = useLocation();

	return (
		<div className={`w-full px-10 bg-background/90 border-b flex items-center backdrop-blur-2xl`} style={{
            height: `${HEADER_HEIGHT}px`
        }}>
			<h1 className="text-xl capitalize">
				{pathname.replaceAll('/', '').replaceAll('-', ' ')}
			</h1>
		</div>
	);
};
