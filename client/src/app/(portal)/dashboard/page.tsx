import { Button } from '@/components/ui/button'

export default async function Dashboard() {
  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
          <p className='text-muted-foreground'>
            View and manage all your data
          </p>
        </div>
        <div className='flex space-x-4'>
          <Button variant={"outline"}>Filters</Button>
        </div>
      </div>
 
    </div>
  )
}