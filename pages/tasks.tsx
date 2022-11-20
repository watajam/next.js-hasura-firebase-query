import { VFC } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useLogout } from '../hooks/useLogout'
import { Layout } from '../components/Layout'
import { ChevronDoubleLeftIcon, LogoutIcon } from '@heroicons/react/solid'
import firebase from '../firebaseConfig'
import { NewsListMemo } from '../components/NewsList'
import { NewsEditMemo } from '../components/NewsEdit'
import { TaskListMemo } from '../components/TaskList'
import { TaskEditMemo } from '../components/TaskEdit'

const Tasks: VFC = () => {
  const router = useRouter()
  const { logout } = useLogout()
  const user = firebase.auth().currentUser

  return (
    <Layout title="tasks">
      <p className="my-3">{user?.email}</p>
      <LogoutIcon
        className="my-3 h-5 w-5 cursor-pointer text-blue-500"
        onClick={() => {
          logout()
          router.push('/')
        }}
      />
      <p className="mt-10 mb-5 text-xl font-bold text-blue-500">News Edit</p>
      <div className="grid grid-cols-2 gap-40">
        <NewsListMemo />
        <NewsEditMemo />
      </div>
      <p className="mt-20 mb-5 text-xl font-bold text-blue-500">Tasks Edit</p>
      <div className="grid grid-cols-2 gap-40">
        <TaskListMemo />
        <TaskEditMemo />
      </div>

      <Link href="/">
        <div className="mt-20 flex cursor-pointer items-center">
          <ChevronDoubleLeftIcon className="mx-1 h-5 w-5 text-blue-500" />
          <span>Back to main page</span>
        </div>
      </Link>
    </Layout>
  )
}

export default Tasks
