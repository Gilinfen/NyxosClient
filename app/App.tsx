import { Outlet } from 'react-router'
import Login from './login'
import { useEffect, useState, type ReactNode } from 'react'
import LayoutConents from './Layout'

const TOKEN_STATUS = ['isToken', 'isTokerSuccess', 'isToktonErr'] as const

export type TOKEN_STATUS_KEYS = (typeof TOKEN_STATUS)[number]

export function HydrateFallback() {
  return (
    <div id="loading-splash">
      <div id="loading-splash-spinner" />
      <p>Loading, please wait...</p>
    </div>
  )
}

const TokenStatusCom: {
  [key in TOKEN_STATUS_KEYS]: ReactNode
} = {
  isToktonErr: <Login />,
  isTokerSuccess: (
    <LayoutConents>
      <Outlet />
    </LayoutConents>
  ),
  isToken: <HydrateFallback />
}

export type User = {
  id: number
  username: string
  password: string
  status: TOKEN_STATUS_KEYS
}

export default function App() {
  const [isToken, setisToken] = useState<TOKEN_STATUS_KEYS>('isTokerSuccess')
  async function getUsers() {
    try {
      // const db = await Database.load('sqlite:test.db')
      // const dbUsers = await db.select<User[]>('SELECT * FROM users')
      // if (dbUsers.some(e => e.status === 'isTokerSuccess')) {
      //   setisToken('isTokerSuccess')
      // } else {
      //   setisToken('isToktonErr')
      // }
    } catch (error) {
      console.log(error)
      setisToken('isTokerSuccess')
    }
  }
  useEffect(() => {
    getUsers()
  }, [])

  return (
    <>
      <div id="detail">{TokenStatusCom[isToken]}</div>
    </>
  )
}
