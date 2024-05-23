import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import useFetch from "../hooks/useFetch";
import { toast } from "../components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { USER_PLACEHOLDER_IMG_URL } from "../lib/utils";
import ProfileImg from "../components/ui-custom/profileImg";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";

interface IUser {
    id: string;
    full_name: string;
    email: string;
    profileImg: string;
    rank: string;
}

const AddUser = ({ action, endpoint }: { action: string, endpoint: string }) => {
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);

    const updateSelectedUsers = (user: IUser) => {
        setSelectedUsers((prevSelected) => {
            const isSelected = prevSelected.some((u) => u.id === user.id);
            if (isSelected) {
                return prevSelected.filter((u) => u.id !== user.id);
            } else {
                return [...prevSelected, user];
            }
        });
    };

    return (
        <div className="flex gap-5">
            {selectedUsers.map((u: IUser) => (
                <User key={u.id} url={endpoint} user={u} selectedUsers={selectedUsers} updateSelectedUsers={updateSelectedUsers} />
            ))}
            <User action={action} selectedUsers={selectedUsers} updateSelectedUsers={updateSelectedUsers} />
        </div>
    );
};

const User = ({ action, user, selectedUsers, updateSelectedUsers, url }: {
    setSelected?: (users: IUser[]) => void;
    user?: IUser;
    action?: string;
    url?: string;
    selectedUsers: IUser[];
    updateSelectedUsers: (user: IUser) => void;
}) => {
    const [userList, setUserList] = useState<IUser[]>([]);

    const { onFetch: fetchUsers, isFetching: isFetchingUsers } = useFetch(
        url || '',
        (data) => {
            setUserList(data.data.results);
        },
        (error, status) => {
            const { message, ...err } = error;
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: "destructive",
            });
        }
    );

    useEffect(() => {
        if (url) fetchUsers(); // get user list
    }, []);

    const handleCheckboxClick = (user: IUser) => {
        updateSelectedUsers(user);
    };

    return user ? (
        <div className="relative rounded-lg border-2 border-gray-300 min-w-[200px] h-[250px] max-h-[200px] overflow-hidden flex items-center justify-center bg-cover" style={{ backgroundImage: `url(${user.profileImg})` }}>
            <div className="absolute bottom-0 text-white w-full text-start p-2 bg-gradient-to-t h-1/2 from-black">
                <div className="flex items-end h-full">
                    <div className="">
                        <div className="text-md">{user.full_name}</div>
                        <div className="text-xs uppercase">{user.rank || 'no-rank-set' }</div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="rounded-lg border-2 border-dotted border-gray-300 min-w-[200px] h-[250px] max-h-[200px] overflow-hidden flex items-center justify-center">
            <Sheet>
                <SheetTrigger>
                    <Button className="px-5" variant="secondary">
                        {action}
                    </Button>
                </SheetTrigger>

                <SheetContent className="!max-w-full w-[600px]">
                    <SheetHeader>
                        <SheetTitle>Select {action?.split(' ')[1]}</SheetTitle>

                        <div className="w-full flex justify-end">
                            <div className="relative flex items-center w-fit">
                                <Input className='p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[400px] max-w-full' />
                                <Search className='absolute right-5 opacity-30' />
                            </div>
                        </div>

                        <SheetDescription>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm">Name</TableHead>
                                        <TableHead className="text-sm">Email</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {!isFetchingUsers && (
                                        userList.map((user: IUser) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="">
                                                    <div className="flex items-center">
                                                        <ProfileImg url={USER_PLACEHOLDER_IMG_URL} />
                                                        {user.full_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Checkbox checked={selectedUsers.some((u) => u.id === user.id)} onClick={() => handleCheckboxClick(user)} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default AddUser;
