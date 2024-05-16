import { PlusCircle, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Input } from "../components/ui/input";
import ProfileImg from "../components/custom/profileImg";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { HEADER_HEIGHT } from "../lib/utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";

const Departments = () => {
  const PAGINATION_HEIGHT = 40;
  const [deps,] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  return (
    <div className="pb-5 pt-10 px-10" style={{
      height: `calc(100vh - ${HEADER_HEIGHT}px - ${PAGINATION_HEIGHT}px)`
    }}>
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
              <h5 className="text-xl"> List of Users </h5>
              <small className="text-muted-foreground">
                {deps.length || 0} Departments
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
                <TableHead>Departments</TableHead>
                <TableHead>No. of Users</TableHead>
                <TableHead>Events</TableHead>
                <TableHead className="text-center">
                  Live Webinars
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deps.map((e: number) => (
                <TableRow key={e}>
                  <TableCell className="font-medium">
                    NCCQE
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <ProfileImg
                        url={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.random()}`}
                      />
                      <ProfileImg
                        url={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.random()}`}
                        className="-ml-4"
                      />
                      <ProfileImg
                        url={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.random()}`}
                        className="-ml-4"
                      />
                      <span className="ms-2"> + 300 </span>
                    </div>
                  </TableCell>
                  <TableCell>30</TableCell>
                  <TableCell className="flex justify-center items-center gap-3">
                    <span>5</span>
                    <Badge variant={'destructive'}>
                      Live
                    </Badge>
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

export default Departments