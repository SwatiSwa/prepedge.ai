
import { Button } from '@/components/ui/button'
import QuestionsTable from '../questions/questions-table'

export default async function MockTestAttempts() {
  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Mock Test Attempts</h2>
          <p className='text-muted-foreground'>
            View and manage all your mock test attempts
          </p>
        </div>
        <div className='flex space-x-4'>
          <Button>New Attempt</Button>
        </div>
      </div>
      <QuestionsTable />
    </div>
  )
}