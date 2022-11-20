import { VFC } from 'react'
import Link from 'next/link'
import {
  ChevronDoubleRightIcon,
  CreditCardIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/solid'
import { useFirebaseAuth } from '../hooks/useFirebaseAuth'
import firebase from '../firebaseConfig'

export const Auth: VFC = () => {
  //現在ログインしているユーザー
  const user = firebase.auth().currentUser
  const {
    isLogin,
    email,
    password,
    emailChange,
    pwChange,
    authUser,
    toggleMode,
  } = useFirebaseAuth()

  return (
    <>
      <form
        onSubmit={authUser}
        className="mt-8 flex flex-col items-center justify-center"
      >
        <label>Email:</label>
        <input
          className="my-3 border border-gray-300 px-3 py-1"
          placeholder="email ?"
          type="text"
          value={email}
          onChange={emailChange}
        />

        <label>Password:</label>
        <input
          className="my-3 border border-gray-300 px-3 py-1"
          placeholder="password ?"
          type="password"
          value={password}
          onChange={pwChange}
        />
        <button
          disabled={!email || !password}
          type="submit"
          className="mt-5 rounded bg-indigo-600 py-1 px-3 text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-40"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
   

      <div
        className="my-5  cursor-pointer text-blue-500 block"
        onClick={toggleMode}
      >トグル</div>
      {user && (
        <Link href="/tasks">
          <div className="my-3 flex cursor-pointer items-center">
            <div className="mx-1 text-blue-500">タスクページ</div>
            <span>to tasks page</span>
          </div>
        </Link>
      )}
    </>
  )
}
