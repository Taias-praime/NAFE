import { useFormik } from "formik";
import { Input } from "../components/ui/input";
import { HEADER_HEIGHT } from "../lib/utils";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { ListFilter, Loader2, PencilLine, Search, X } from "lucide-react";
import { format } from "date-fns"
import { toast } from "../components/ui/use-toast";
import { IAnnouncements, ITenants } from "../models/interfaces";
import useFetch from "../hooks/useFetch";
import ReactSelect from "../components/ui/multi-select";
import Paginate from "../components/ui/paginate";

const PAGINATION_HEIGHT = 50;

const Announcements = () => {
  const [announcements, setAnnouncement] = useState<IAnnouncements[]>([]);
  const [tenants, setTenants] = useState<ITenants[]>([]);
  const [tenantsId, setEditTenantsId] = useState<ITenants[]>([]);
  const [numOfAnnouncement, setNumOfAnnouncement] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');
  const [searchValue, setSearchValue] = useState("");

  const validate = (values: any) => {
    const errors: any= {};
    if (!values.title) {
      errors.title = 'Required';
    } else if (values.title.length < 5) {
      errors.title = 'Must be more that 5 characters';
    }
    if (!values.description) {
      errors.description = 'Required';
    } else if (values.description.length < 5) {
      errors.description = 'Must be more that 5 characters';
    }
    if (!values.tenant_ids) {
      errors.tenant_ids = 'Required';
    } else if (values.tenant_ids.length < 1) {
      errors.tenant_ids = 'Must be more that 5 characters';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tenant_ids: [] as string[],
    },
    validate,
    onSubmit: (values) => {
      if (!isEdit) {
        onPost(values)
      } else {
        onPut(values)
      }
    }
  })

  const { onFetch: getEvents, isFetching: isLoadingAnnouncements } = useFetch(
    `/announcements/sa/?page=${currentPage}&items_per_page=3`,
    (data) => {
      setAnnouncement(data.data.results);
      setNumOfAnnouncement(data.data.number_of_items);
      setNumOfPages(data.data.number_of_pages);
    },
    () => { },
  );

  const { onFetch: getTenants } = useFetch(
    '/tenants/sa/',
    (data) => {
      setTenants(data.data.results)
    },
    () => { },
  );

  const { onFetch: searchAnnouncement, isFetching: isSearching } = useFetch(
    `/announcements/sa/?search_query${searchValue}`,
    (data) => {
      setAnnouncement(data.data.results);
      setNumOfAnnouncement(data.data.number_of_items);
      setNumOfPages(data.data.number_of_pages);
    },
    () => { },
  );

  const { onPost, isFetching: isLoadingCreate } = useFetch(
    '/announcements/sa/add',
    (data) => {
      toast({ description: data.message });
      formik.resetForm();
      setIsEdit(false)
      setEditTenantsId([])
      setId('')
    },
    (e) => {
      const { message } = e;
      // notify
      toast({
        title: `${message} (${status})`,
        variant: 'destructive',
      });
    },
    {},
  );

  const { onPut, isFetching: isLoadingEdit } = useFetch(
    `/announcements/sa/${id}/edit`,
    (data) => {
      toast({ description: data.message });
      formik.resetForm();
      setIsEdit(false)
      setEditTenantsId([])
      setId('')
    },
    (e) => {
      const { message } = e;
      // notify
      toast({
        title: `${message} (${status})`,
        variant: 'destructive',
      });
    },
    {},
  );

  useEffect(() => {
    getEvents();
    getTenants();
  }, [isLoadingCreate, isLoadingEdit, currentPage])

  const getIdsFromTenants = (tenant_ids: ITenants[]) => {
    const tenants = []
    for (const department of tenant_ids) {
      tenants.push(department.tenant_id);
    }
    return tenants;
  }

  const handleSelect = (tenant_ids: ITenants[]) => {
    setEditTenantsId(tenant_ids)
    const tenants = getIdsFromTenants(tenant_ids)
    formik.setFieldValue('tenant_ids', tenants)
  }

  const editAnnouncement = (obj: IAnnouncements) => {
    const matchedTenants = [];
    setId(obj.id)
    setIsEdit(true);

    for (const id of obj.tenant_ids) {
      for (const tenant of tenants) {
        if (tenant.tenant_id === id) {
          matchedTenants.push(tenant);
          break;
        }
      }
    }

    setEditTenantsId(matchedTenants);

    formik.setValues({
      title: obj.title,
      description: obj.description,
      tenant_ids: obj.tenant_ids,
    })
  }

  const handlePageClick = (event: { selected: number; }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!searchValue) return;
    searchAnnouncement();
  }

  const clearSearch = () => {
    setSearchValue("");
    getEvents();
  }

  return (
    <div className=" pt-10 px-10 bg-foreground/5" style={{
      height: `calc(100vh - ${HEADER_HEIGHT}px - ${PAGINATION_HEIGHT}px)`
    }}>

      <div className="overflow-y-scroll h-full">
        <form onSubmit={handleSearch} className="relative flex items-center justify-end mb-5">
          <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[300px]' />
          <div className="absolute right-5 opacity-30">
            {
              searchValue ? <X role="button" onClick={clearSearch} /> : <Search />
            }
          </div>
        </form>
        <div className="grid grid-cols-12 gap-x-10">
          <div className="col-span-7">
            <div className="">
              <h4 className="mb-2 text-xl"> Create Announcement </h4>
              <p className="opacity-50 text-sm"> Create new announcements </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="rounded-md bg-white p-4 mt-12">
              <Input
                value={formik.values.title}
                onChange={formik.handleChange}
                name="title"
                placeholder="title here"
                divClass="mb-10"
                label="Announcement Title"
                error={formik.errors.title}
              />
              <Textarea
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                name="description"
                placeholder="details of the event here"
                label="Details"
                divClass="mb-10"
                error={formik.errors.description}
              />

              <ReactSelect
                label="Select Department"
                options={tenants}
                handleSelect={handleSelect}
                value={tenantsId}
                isMulti={true}
                optionName="name"
                optionValue="tenant_id"
                divClass="mb-10"
                error={formik.errors.tenant_ids}
              />
              <div className="flex justify-end mt-12">
                {
                  isEdit ? (
                    <Button
                      variant={`${formik.values.title === '' || formik.values.description === '' || formik.values.tenant_ids.length === 0 ? 'disabled' : 'default'}`}
                      type='submit' className="px-10">
                      {
                        isLoadingEdit ? <Loader2 className='animate-spin' /> : 'Edit'
                      }
                    </Button>
                  ) : (
                    <Button
                      variant={`${formik.values.title === '' || formik.values.description === '' || formik.values.tenant_ids.length === 0 ? 'disabled' : 'default'}`}
                      type='submit' className="px-10">
                      {
                        isLoadingCreate ? <Loader2 className='animate-spin' /> : 'Create'
                      }
                    </Button>
                  )
                }
              </div>
            </form>
          </div>

          <div className="col-span-5">
            <div className="flex justify-between mb-12">
              <div className="">
                <h4 className="mb-2 text-xl"> Recent Announcements </h4>
                <p className="opacity-50 text-sm"> {numOfAnnouncement} announcements </p>
              </div>
              <div className="">
                <Button className='flex gap-3' variant={'secondary'}>
                  Filter
                  <ListFilter />
                </Button>
              </div>
            </div>
            {
              !isLoadingAnnouncements || !isSearching ? (
                announcements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} editAnnouncement={editAnnouncement} />
                ))
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <Loader2 className="animate-spin" />
                </div>
              )
            }
          </div>
        </div>
      </div>
      <Paginate
        handlePageClick={handlePageClick}
        numOfPages={numOfPages}
      />
    </div>
  )
};

export default Announcements;
interface IAnnouncementCard {
  announcement: IAnnouncements;
  editAnnouncement: (announcement: IAnnouncements) => void
}

const AnnouncementCard = ({ announcement, editAnnouncement }: IAnnouncementCard) => {
  return (
    <div key={announcement.id} className="rounded-md bg-white p-4 mb-4 border-b border-b-foreground">
      <div className="flex justify-between overflow-hidden">
        <div className="">
          <h4 className="mb-2"> {announcement.title} </h4>
          <p className="opacity-50 text-sm"> Nafe </p>
        </div>
        <div className="">
          <Button onClick={() => editAnnouncement(announcement)} size='sm' className="px-4 flex gap-2 text-sm">
            <PencilLine size='16' />
            Edit
          </Button>
        </div>
      </div>
      <div className="py-4 text-sm"> {announcement.description} </div>
      <div className="flex justify-end text-disabled text-sm "> {format(announcement.date_created, 'p | MMM dd, yyyy')}</div>
    </div>
  )
};

