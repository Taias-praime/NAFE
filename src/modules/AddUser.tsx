import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import useFetch from '../hooks/useFetch';
import { toast } from '../components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { USER_PLACEHOLDER_IMG_URL } from '../lib/utils';
import ProfileImg from '../components/ui-custom/profileImg';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import Moderator from '../components/ui-custom/moderator';
import KeynoteSpeaker from '../components/ui-custom/keynoteSpeaker';

interface IUser {
	id: string;
	position: string;
	name: string;
	image: string;
}

const AddUser = ({
	users,
	action,
	endpoint,
	setUsers,
}: {
	users: IUser[];
	action: string;
	endpoint: string;
	setUsers: any;
}) => {

	const updateSelectedUsers = (user: IUser) => {
		setUsers((prevSelected: IUser[]) => {
			const isSelected = prevSelected.some((u: IUser) => u.id === user.id);
			if (isSelected) return prevSelected.filter((u: IUser) => u.id !== user.id);
			else return [...prevSelected, user];
		});
	};

	return (
		<div className="flex gap-5">
			<User
				action={action}
				endpoint={endpoint}
				selectedUsers={users}
				updateSelectedUsers={updateSelectedUsers}
			/>
			{users.slice().reverse().map((u: IUser) => (
				<User
					key={u.id}
					user={u}
					selectedUsers={users}
					updateSelectedUsers={updateSelectedUsers}
				/>
			))}
		</div>
	);
};

const User = ({
	action,
	user,
	selectedUsers,
	updateSelectedUsers,
	endpoint,
}: {
	setSelected?: (users: IUser[]) => void;
	user?: IUser;
	action?: string;
	endpoint?: string;
	selectedUsers: IUser[];
	updateSelectedUsers: (user: IUser) => void;
}) => {
	const handleCheckboxClick = (user: IUser) => {
		updateSelectedUsers(user);
	};

	return user ? (
		// selected used
		<div
			className="relative rounded-lg border-2 border-gray-300 min-w-[200px] h-[250px] max-h-[200px] overflow-hidden flex items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: `url(${user.image})` }}>
			<div className="absolute bottom-0 text-white w-full text-start p-2 bg-gradient-to-t h-1/2 from-black">
				<div className="flex items-end h-full">
					<div className="">
						<div className="text-md">{user.name}</div>
						<div className="text-xs uppercase">
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		// actionable add user placehlder
		<div className="rounded-lg border-2 border-dotted border-gray-300 min-w-[200px] h-[250px] max-h-[200px] overflow-hidden flex items-center justify-center">
			<Sheet>
				<SheetTrigger>
					<Button className="px-5" variant="secondary">
						{action}
					</Button>
				</SheetTrigger>

				<AddUserActionSheet
					action={action as string}
					endpoint={endpoint as string}
					selectedUsers={selectedUsers}
					handleCheckboxClick={handleCheckboxClick}
				/>
			</Sheet>
		</div>
	);
};

const AddUserActionSheet = ({
	action,
	endpoint,
	selectedUsers,
	handleCheckboxClick,
}: {
	action: string;
	endpoint: string;
	selectedUsers: IUser[];
	handleCheckboxClick: (user: IUser) => void;
}) => {

	const [userList, setUserList] = useState<IUser[]>([]);
	const [filterList, setFilterList] = useState<IUser[]>([])
	const [search, setSearch] = useState('')
	const [moderatorOpen, setModeratorOpen] = useState(false);
	const [reload, setReload] = useState(false);

	const { onFetch: fetchUsers, isFetching } = useFetch(
		endpoint,
		(data) => {
			setUserList(data.data.results);
			setFilterList(data.data.results)
		},
		(error, status) => {
			const { message} = error;
			toast({
				title: `${message} (${status})`,
				variant: "destructive",
			});
		}
	);

	useEffect(() => {
		if (endpoint) fetchUsers(); // get user list
	}, [reload]);

	useEffect(() => {
		const filter = userList.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
		setFilterList(filter)
		setReload(false);
	}, [search])


	return (
		<SheetContent className="!max-w-full w-[600px]">
			<SheetHeader>
				<SheetTitle>Select {action}</SheetTitle>

				<div className="w-full flex align-center justify-between gap-4">
					{
						action === 'Moderator' ?
							<Moderator title="Add Moderator" label="Speaker name" setReload={setReload} setModalOpen={setModeratorOpen} open={moderatorOpen} />
							: <KeynoteSpeaker title="Add Keynote Speaker" label="Speaker name" setReload={setReload} setModalOpen={setModeratorOpen} open={moderatorOpen} />
					}
					<div className="relative flex items-center w-fit">
						<Input value={search} onChange={(e) => setSearch(e.target.value)} className="p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[400px] max-w-full" />
						<Search className="absolute right-5 opacity-30" />
					</div>
				</div>

				<SheetDescription>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-sm">Name</TableHead>
								<TableHead></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{!isFetching &&
								filterList.map((user: IUser) => (
									<TableRow key={user.id}>
										<TableCell className="">
											<div className="flex items-center">
												<ProfileImg
													url={
														user.image ||
														USER_PLACEHOLDER_IMG_URL
													}
												/>
												<span className='ms-2'> {user.name} </span>
											</div>
										</TableCell>
										<TableCell>
											<Checkbox
												checked={selectedUsers.some(
													(u) => u.id === user.id
												)}
												onClick={() =>
													handleCheckboxClick(user)
												}
											/>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</SheetDescription>
			</SheetHeader>
		</SheetContent>
	);
};

export default AddUser;
