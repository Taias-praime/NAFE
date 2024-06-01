import { useFormik } from "formik"
import { Input } from "../components/ui/input"
import { HEADER_HEIGHT, local } from "../lib/utils"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { useEffect, useState } from "react"
import { ListFilter, Loader2, PencilLine } from "lucide-react"
import { format } from "date-fns"
import { toast } from "../components/ui/use-toast"
import Select from 'react-select';
import useFetch from "../hooks/useFetch"

const token = local("token");

type Tenants = {
  "tenant_id": string,
  "name": string,
  "code": string,
  "total_events": number,
  "total_members": number,
  "webinars": number
}

type TAnnouncements = {
  "id": string,
  "date_created": string,
  "date_updated": string,
  "title": string,
  "tenant_ids": string[],
  "description": string
}

const Announcements = () => {
  const [announcements, setAnnouncement] = useState<TAnnouncements[]>([]);
  const [tenants, setTenants] = useState<Tenants[]>([]);
  const [editTenant, setEditTenant] = useState<Tenants[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');

  const { onFetch: getEvents, isFetching: isLoadingAnnouncements } = useFetch(
    '/announcements/sa/',
    (data) => {
      setAnnouncement(data.data.results)

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
    }, // on error
    {}, //
    {
      "Authorization": `Bearer ${token}`,
    }
  );

  const { onPut, isFetching: isLoadingEdit } = useFetch(
    `/announcements/sa/${id}/edit`,
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
    }, // on error
    {}, //
    {
      "Authorization": `Bearer ${token}`,
    }
  );

  useEffect(() => {
    getEvents();
    getTenants();
  }, [isLoadingCreate, isLoadingEdit])

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tenant_ids: [],
    },
    onSubmit: (values) => {
      if (!isEdit) {
        onPost(values)
      } else {
        onPut(values)
      }
      formik.resetForm();
      setIsEdit(false)
      setEditTenant([])
      setId('')
    }
  })

  const extract = (tenant_ids: Tenants[]) => {
    const tenants = []
    for (const person of tenant_ids) {
      tenants.push(person.tenant_id);
    }
    return tenants;
  }

  const handleEventTypeSelect = (tenant_ids: Tenants[]) => {
    setEditTenant(tenant_ids)
    const tenants = extract(tenant_ids)
    formik.setFieldValue('tenant_ids', tenants)
  }

  const editAnnouncement = (obj: TAnnouncements) => {
    const matchedTenants = [];
    setId(obj.id)

    for (const id of obj.tenant_ids) {
      for (const tenant of tenants) {
        if (tenant.tenant_id === id) {
          matchedTenants.push(tenant);
          break;
        }
      }
    }

    setEditTenant(matchedTenants);
    setIsEdit(true);
    formik.setValues({
      title: obj.title,
      description: obj.description,
      tenant_ids: obj.tenant_ids,
    })
  }

  const customStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      border: 'none',
      borderBottom: '1px solid',
      boxShadow: 'none',
      borderRadius: 'none',
      padding: '5px 0 !important',
      '&:hover': {
        borderBottom: '1px solid',
        outline: 'none',
      },
    }),
    placeholder: (styles) => ({
      ...styles,
      color: '#CECECE',
    }),
  };

  return (
    <div className="overflow-y-auto pb-5 pt-10 px-10 bg-foreground/5" style={{
      height: `calc(100vh - ${HEADER_HEIGHT}px)`
    }}>
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

            <label className="block pb-3"> Select Department </label>
            <Select isMulti options={tenants} onChange={handleEventTypeSelect}
              getOptionLabel={(tenants) => tenants.name}
              getOptionValue={(tenants) => tenants.tenant_id}
              value={isEdit ? editTenant : undefined}
              styles={customStyles}
              placeholder='select department'
            >
            </Select>
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
          <div className="flex justify-between">
            <div className="">
              <h4 className="mb-2 text-xl"> Recent Announcements </h4>
              <p className="opacity-50 text-sm"> 10 announcements </p>
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
    </div >
  )
}

export default Announcements

const AnnouncementCard = ({ announcement, editAnnouncement }: any) => {
  return (
    <div key={announcement.id} className="rounded-md bg-white p-4 my-4 border-b border-b-foreground">
      <div className="flex justify-between">
        <div className="">
          <h4 className="mb-2"> {announcement.title} </h4>
          <p className="opacity-50 text-sm"> Nafe </p>
        </div>
        <div className="">
          <Button onClick={() => editAnnouncement(announcement)} className="px-5 flex gap-2">
            <PencilLine />
            Edit
          </Button>
        </div>
      </div>
      <div className="py-4"> {announcement.description} </div>
      <div className="flex justify-end text-disabled text-sm "> {format(announcement.date_created, 'p | MMM dd, yyyy')}</div>
    </div>
  )
}

