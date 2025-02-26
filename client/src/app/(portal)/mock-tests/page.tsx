import { Button } from '@/components/ui/button'
import MockTestList from './mock-test-list'
import Link from 'next/link'

export default async function MockTests() {
  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Mock Tests</h2>
          <p className='text-muted-foreground'>
            View and manage all your mock tests
          </p>
        </div>
        <div className='flex space-x-4'>
          <Button asChild>
            <Link href='/mock-tests/create'>
            Add Mock Test
            </Link>
          </Button>
        </div>
      </div>
      <MockTestList />
    </div>
  )
}