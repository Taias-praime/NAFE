import { motion } from 'framer-motion';
import NAFE_LOGO from '/icons/nafe_logo.png';
import { IMenu } from '../../models/interfaces';
import { NavLink, useLocation } from 'react-router-dom';
import {
	Building2,
	CalendarDays,
	CircleUserRound,
	Cog,
	LayoutDashboard,
	LogOut,
	Speech,
	UsersRound,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const menu: IMenu[] = [
	{
		icon: <LayoutDashboard />,
		label: 'Dashboard',
		link: '/dashboard',
	},
	{
		icon: <CircleUserRound />,
		label: 'Chief of Army Staff',
		link: '/chief-of-army-staff',
	},
	{
		icon: <CalendarDays />,
		label: 'Events',
		link: '/events',
	},
	{
		icon: <Building2 />,
		label: 'Departments',
		link: '/departments',
	},
	{
		icon: <UsersRound />,
		label: 'Users',
		link: '/users',
	},
	{
		icon: <Speech />,
		label: 'Announcements',
		link: '/announcements',
	},
];

const subMenu: IMenu[] = [
	{
		icon: <Cog />,
		label: 'Settings',
		link: '/settings',
	},
	{
		icon: <LogOut />,
		label: 'Logout',
		link: '',
		handleClick: () => {},
	},
];

const SideMenu = () => {
	const { pathname } = useLocation();
	const { logOut } = useAuth();
	
	const handleLogout = () => logOut(); // logout logic here

	return (
		<aside className="relative h-svh max-w-[80px] min-w-[80px] lg:w-full lg:max-w-[350px] bg-black text-white py-10 flex flex-col">
			{/* logo */}
			<div className="rounded-sm lg:px-10 flex gap-5 items-center">
				<div className="px-5 lg:px-0 lg:w-[50px]">
					<img className="w-full" src={NAFE_LOGO} />
				</div>

				<div className="hidden lg:block">
					<p className="text-lg"> NAFE </p>
					<p className="text-xs"> Super Admin </p>
				</div>
			</div>

			{/* content */}
			<ul className="relative px-5 lg:px-10 mt-16 flex-grow">
				{menu.map((m: IMenu, k: number) => (
					<NavItem key={k} menuItem={m} pathname={pathname} />
				))}
			</ul>

			{/* footer */}
			<ul className="px-5 lg:px-10 mt-auto">
				{subMenu.map((m: IMenu, k: number) =>
					m.label === 'Logout' ? (
						<NavItem
							key={k}
							menuItem={{ ...m, handleClick: handleLogout }}
						/>
					) : (
						<NavItem key={k} menuItem={m} pathname={pathname} />
					)
				)}
			</ul>
		</aside>
	);
};

const NavItem = ({
	menuItem,
	pathname,
}: {
	menuItem: IMenu;
	pathname?: string;
}) => {
	return (
		<NavLink
			to={menuItem.link}
            onClick={menuItem.handleClick && menuItem.handleClick}
            className={({ isActive }) =>
				(isActive ? '' : 'hover:bg-background/10') +
				' rounded-lg py-2 my-6 lg:p-4 lg:my-2 block relative' +
				(menuItem.label === 'Logout' ? ' hover:text-red-400' : '')
			}
        >
			<li className="flex items-center justify-center lg:justify-start gap-4 text-sm overflow-hidden">
				{menuItem.icon}

                <span className="hidden lg:block truncate">{menuItem.label}</span>
			</li>
 
            {pathname === menuItem.link && (
                <motion.div
                    layoutId="active-nav"
                    className="absolute rounded-lg bg-background/20 inset-0 w-full h-full"></motion.div>
            )}
		</NavLink>
	);
};

export default SideMenu;
