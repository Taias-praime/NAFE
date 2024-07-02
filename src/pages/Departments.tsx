import { Loader2, PlusCircle, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ProfileImg from "../components/ui-custom/profileImg";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { HEADER_HEIGHT, USER_PLACEHOLDER_IMG_URL } from "../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { useEffect, useState } from "react";
import { useToast } from "../components/ui/use-toast";
import useFetch from "../hooks/useFetch";
import EditDepartment from "../components/ui-custom/editDepartment";

const Departments = () => {
  const PAGINATION_HEIGHT = 40;

  const [deps, setDeps] = useState([]);
  const [depsCount, setDepsCount] = useState(0);
  const [tenantId, setTenantId] = useState('');
  const [tenant, setTenant] = useState('');

  const { toast } = useToast();

  const { onFetch: getDeps, isFetching } = useFetch(
    "/tenants/sa/",
    (data) => {
      setDeps(data.data.results);
      setDepsCount(data.data.number_of_items);
    },
    (error, status) => {
      const { message, ...err } = error;
      // notify
      toast({
        title: `${message} (${status})`,
        description: err.errors.error_message,
        variant: "destructive",
      });
    }
  );

  useEffect(() => {
    getDeps();
  }, []);

  const updateTenantId = (id: string, code: string) => {
    setTenantId(id);
    setTenant(code)
  }

  return (
    <div
      className="pb-5 pt-10 px-10"
      style={{
        height: `calc(100vh - ${HEADER_HEIGHT}px - ${PAGINATION_HEIGHT}px)`,
      }}
    >
      {
        isFetching ? <Loader2 className='animate-spin m-auto' /> : (
          <>
            <div className="h-full overflow-y-auto">
              <div className="flex justify-between">
                <div className=""></div>
                <Button className="lg:absolute top-5 right-10 flex gap-3">
                  <PlusCircle />
                  Create Department
                </Button>
              </div>

              <div className="">
                <div className="lg:flex justify-between items-center p-5 space-y-5">
                  <div className="">
                    <h5 className="text-xl "> List of Users </h5>
                    <small className="text-muted-foreground">
                      {depsCount} Departments
                    </small>
                  </div>
                  <div className="relative flex items-center w-fit">
                    <Input className="p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[300px]" />
                    <Search className="absolute right-5 opacity-30" />
                  </div>
                </div>
                <EditDepartment label={`Department/${tenant}`} tenantId={tenantId} >
                  <Table>
                    {/* <TableCaption className="py-5">A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                      <TableRow>
                        <TableHead>Departments</TableHead>
                        <TableHead>No. of Users</TableHead>
                        <TableHead>Events</TableHead>
                        <TableHead className="text-center">Live Webinars</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody >
                      {deps.map((d: any) => (
                        <TableRow onClick={() => updateTenantId(d.tenant_id, d.code)} key={d.tenant_id} className="text-start" >
                          <TableCell className="font-medium">{d.code}</TableCell>

                          <TableCell>
                            <div className="flex items-center">
                              {[...Array(d.total_members).keys()]
                                .map((_, i) => (
                                  <ProfileImg
                                    className={i ? "-ml-4" : ""}
                                    url={USER_PLACEHOLDER_IMG_URL}
                                  />
                                ))
                                .slice(0, 3)}
                              <span className="ms-2">
                                {d.total_members > 3
                                  ? "+ " + (d.total_members - 3)
                                  : ""}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell> {d.total_events} </TableCell>

                          <TableCell className="flex justify-center items-center gap-3">
                            <span> {d.webinars} </span>
                            <Badge variant={"destructive"}> Live </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </EditDepartment>
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
          </>

        )
      }

    </div>
  );
};

export default Departments;
