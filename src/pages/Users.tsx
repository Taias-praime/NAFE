import { PlusCircle, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { HEADER_HEIGHT } from "../lib/utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import useFetch from "../hooks/useFetch";
import { toast } from "../components/ui/use-toast";
import { IUser } from "../models/interfaces";

const Users = () => {
  const PAGINATION_HEIGHT = 40;
  const [users, setUsers] = useState<IUser[]>([]);

  // get users
  const { onFetch: onFetchUsers } = useFetch(
    '/users/sa/',
    (data, status) => {
      if (status === 200) {
        const _data = data.data;
        const results = _data.results;
        setUsers(results)
      }
    },
    (error, status) => { // on error
      const { message, ...err } = error;
      // notify
      toast({
        title: `${message} (${status})`,
        description: err.errors.error_message,
        variant: 'destructive',
      })
    },
    {}, // options
  );

  useEffect(() => {
    onFetchUsers();
  }, [])

  return (
    <div className="pb-5 pt-10 px-10" style={{
      height: `calc(100vh - ${HEADER_HEIGHT}px - ${PAGINATION_HEIGHT}px)`
    }}>
      <div className="h-full overflow-y-auto">
        <div className="flex justify-between">
          <div className=""></div>
          <Button className="lg:absolute top-5 right-10 flex gap-3">
            <PlusCircle />
            Create Users
          </Button>
        </div>

        <div className="">
          <div className="lg:flex justify-between items-center p-5 space-y-5">
            <div className="">
              <h5 className="text-xl"> List of Users </h5>
              <small className="text-muted-foreground">
                {/* {users.length || 0} Departments */}
              </small>
            </div>
            <div className="relative flex items-center w-fit">
              <Input className='p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[300px]' />
              <Search className='absolute right-5 opacity-30' />
            </div>
          </div>
          
          <Table className="">
            {/* <TableCaption className="py-5">A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead> Email </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: IUser) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {/* <ProfileImg url={user.image || ''}/> */}
                      <span className="ms-2">
                        {user.full_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className=""> {user.department_name} </span>
                    </div>
                  </TableCell>
                  <TableCell> 
                    <span> {user.rank || 'N/A'} </span>
                  </TableCell>
                  <TableCell className="">
                    <span> {user.email} </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination className={`!h-[${PAGINATION_HEIGHT}px]`}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default Users