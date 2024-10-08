import { Loader2, PlusCircle, Search, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { HEADER_HEIGHT } from "../lib/utils";
import useFetch from "../hooks/useFetch";
import { toast } from "../components/ui/use-toast";
import { IUser } from "../models/interfaces";
import Paginate from "../components/ui/paginate";
import CreateUser from "../components/ui-custom/create-user";

const Users = () => {
  const PAGINATION_HEIGHT = 40;
  const [users, setUsers] = useState<IUser[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");


  // get users
  const { onFetch: onFetchUsers, isFetching } = useFetch(
    `/users/sa/?page=${currentPage}&items_per_page=10`,
    (data, status) => {
      if (status === 200) {
        const _data = data.data;
        const results = _data.results;
        setUserCount(_data.number_of_items);
        setNumOfPages(_data.number_of_pages);
        setUsers(results);
      }
    },
    (error, status) => {
      const { message } = error;
      toast({
        title: `${message} (${status})`,
        variant: 'destructive',
      })
    },
  );

  // search user
  const { onFetch: onSearchUser, isFetching: isSearching } = useFetch(
    `/users/sa/?search_query${searchValue}&page=1&items_per_page=10`,
    (data, status) => {
      if (status === 200) {
        const _data = data.data;
        const results = _data.results;
        setUserCount(_data.number_of_items);
        setNumOfPages(_data.number_of_pages);
        setUsers(results);
      }
    },
    (error, status) => {
      const { message } = error;
      toast({
        title: `${message} (${status})`,
        variant: 'destructive',
      })
    },
  );

  useEffect(() => {
    onFetchUsers();
  }, [currentPage])

  const handlePageClick = (event: { selected: number; }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!searchValue) return;
    onSearchUser();
  }

  const clearSearch = () => {
    setSearchValue("");
    onFetchUsers();
  }

  return (
    <div className="pb-5 pt-10 px-10" style={{
      height: `calc(100vh - ${HEADER_HEIGHT}px - ${PAGINATION_HEIGHT}px)`
    }}>
      <div className="h-full overflow-y-auto">
        <div className="flex justify-between">
          <CreateUser tenantId={''}
            label={
              <Button className="lg:absolute top-5 right-10 flex gap-3">
                <PlusCircle />
                Create Users
              </Button>
            }
          />
        </div>
        {
          isFetching || isSearching ? <Loader2 className='animate-spin m-auto' /> : (
            <div className="">
              <div className="flex items-center justify-between flex-wrap p-5">
                <div className="">
                  <h5 className="text-xl"> List of Users </h5>
                  <small className="text-muted-foreground">
                    {userCount} Users
                  </small>
                </div>
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)}  className='p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[300px]' />
                  <div className="absolute right-5 opacity-30">
                    {
                      searchValue ? <X role="button" onClick={clearSearch}  /> : <Search/>
                    }
                  </div>
                </form>
              </div>

              <Table className="">
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
                      <CreateUser tenantId={user.id}
                        label={
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <span className="ms-2">
                                {user.full_name || 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                        }
                      />
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
          )
        }


      </div>
      <Paginate
        handlePageClick={handlePageClick}
        numOfPages={numOfPages}
      />
    </div>
  );
}

export default Users