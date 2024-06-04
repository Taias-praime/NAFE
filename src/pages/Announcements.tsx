import { useFormik } from "formik";
import { Input } from "../components/ui/input";
import { HEADER_HEIGHT, local } from "../lib/utils";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { ListFilter, Loader2, PencilLine } from "lucide-react";
import { format } from "date-fns"
import { toast } from "../components/ui/use-toast";
import { IAnnouncements, ITenants } from "../models/interfaces";
import useFetch from "../hooks/useFetch";
import MultiSelect from "../components/ui/multi-select";
import Paginate from "../components/ui/paginate";

const token = local("token");
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

  const { onPost, isFetching: isLoadingCreate } = useFetch(
    '/announcements/sa/add',
    (data) => {
      toast({ description: data.message });
    }, // on success
    (e) => {
      const { message, ...err } = e;
      // notify
      toast({
        title: `${message} (${status})`,
        description: err.errors.error_message,
        variant: 'destructive',
      });
    },
    {},
    {
      "Authorization": `Bearer ${token}`,
    }
  );

  const { onPut, isFetching: isLoadingEdit } = useFetch(
    `/announcements/sa/${id}/edit`,
    (data) => {
      toast({ description: data.message });
    },
    (e) => {
      const { message, ...err } = e;
      // notify
      toast({
        title: `${message} (${status})`,
        description: err.errors.error_message,
        variant: 'destructive',
      });
    },
    {},
    {
      "Authorization": `Bearer ${token}`,
    }
  );

  useEffect(() => {
    getEvents();
    getTenants();
  }, [isLoadingCreate, isLoadingEdit, currentPage])

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tenant_ids: [] as string[],
    },
    onSubmit: (values) => {
      if (!isEdit) {
        onPost(values)
      } else {
        onPut(values)
      }
      formik.resetForm();
      setIsEdit(false)
      setEditTenantsId([])
      setId('')
    }
  })

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

  return (
    <div className=" pt-10 px-10 bg-foreground/5" style={{
      height: `calc(100vh - ${HEADER_HEIGHT}px - ${PAGINATION_HEIGHT}px)`
    }}>
      <div className="grid grid-cols-12 gap-x-10 overflow-y-scroll h-full">
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
              className="mb-10"
              label="Announcement Title"
            />

            <Textarea
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              name="description"
              placeholder="details of the event here"
              className="mb-10"
              label="Details"
            />

            <MultiSelect
              label="Select Department"
              options={tenants}
              handleSelect={handleSelect}
              value={tenantsId}
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
            !isLoadingAnnouncements ? (
              announcements.map((announcement) => (
                <AnnouncementCard announcement={announcement} editAnnouncement={editAnnouncement} />
              ))
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <Loader2 className="animate-spin" />
              </div>
            )
          }
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

