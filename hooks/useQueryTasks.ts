import { useEffect } from 'react'
import { GraphQLClient } from 'graphql-request'
import { useQuery } from 'react-query'
import { Task } from '../types/types'
import { GET_TASKS } from '../queries/queries'
import Cookie from 'universal-cookie'

const cookie = new Cookie()
const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT
let graphQLClient: GraphQLClient

interface TasksRes {
  tasks: Task[]
}

const fetchTasks = async () => {
    //JWTトークンのヘッダーを付与したい場合はgraphQLClient.requestを使う
  const { tasks: data } = await graphQLClient.request<TasksRes>(GET_TASKS)
  return data
}

export const useQueryTasks = () => {
//
  useEffect(() => {
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        //付与したいヘッダーの内容（クッキーに保存されているJWTトークンを付与)
        Authorization: `Bearer ${cookie.get('token')}`,
      },
    })
    //ユーザーが切り替わると更新され新しいgraphQLClientが生成される
  }, [cookie.get('token')])
  
  return useQuery<Task[], Error>({
    queryKey: 'tasks',
    queryFn: fetchTasks,
    staleTime: 0,
  })
}