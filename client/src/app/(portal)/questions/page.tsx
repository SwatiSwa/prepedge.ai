import { Button } from '@/components/ui/button'
import QuestionsTable from './questions-table'
import Link from 'next/link'

export default async function Questions() {
  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Questions</h2>
          <p className='text-muted-foreground'>
            View and manage all questions in the question bank
          </p>
        </div>
        <div className='flex space-x-4'>
          <Button>Add Question</Button>
          <Button asChild>
            <Link href='/questions/copilot'>
            Question Copilot
            </Link>
          </Button>
        </div>
      </div>
      <QuestionsTable />
    </div>
  )
}