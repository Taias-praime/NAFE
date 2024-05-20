import { Loader2 } from 'lucide-react'

const FullScreenLoader = () => {
  return (
    <div className="absolute z-20 w-svw h-svh bg-white flex items-center justify-center">
        <Loader2 className='animate-spin' />
    </div>
  )
}

export default FullScreenLoader;