import { useFormik } from "formik"
import { Input } from "../components/ui/input"
import { HEADER_HEIGHT } from "../lib/utils"
import { Textarea } from "../components/ui/textarea"

const Announcements = () => {

  const formik = useFormik({
    initialValues: {
      announcementTitle: ''
    },
    onSubmit: () => {

    }
  })

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

          <div className="rounded-md bg-white p-4 mt-12">
            <Input
              value={''}
              onChange={formik.handleChange}
              name="announcementTitle"
              placeholder=""
              className="mb-10"
              label="Announcement Title"
            />

            <Textarea
              rows={4}
              value={formik.values.announcementTitle}
              onChange={formik.handleChange}
              name="announcementTitle"
              placeholder=""
              className="mb-10"
              label="Announcement Title"
            />

          </div>
        </div>

        <div className="col-span-5">
          <div className="flex justify-between">
            <div className="">
              <h4 className="mb-2 text-xl"> Recent Announcements </h4>
              <p className="opacity-50 text-sm"> 10 announcements </p>
            </div>
          </div>

          <div className="rounded-md bg-white p-4 mt-12">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum similique distinctio odit perferendis? Error, fugiat? Non nam aliquid nemo suscipit recusandae, placeat cupiditate vitae quas libero aperiam minus mollitia iste!
          </div>
        </div>
      </div>
    </div>
  )
}

export default Announcements