import { useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { GraphQLClient } from 'graphql-request'
import Cookie from 'universal-cookie'
import {
  CREATE_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  CREATE_NEWS,
  DELETE_NEWS,
  UPDATE_NEWS,
} from '../queries/queries'
import { Task, EditTask, News, EditNews } from '../types/types'
import { useDispatch } from 'react-redux'
import { resetEditedTask, resetEditedNews } from '../slices/uiSlice'

const cookie = new Cookie()
const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT
let graphQLClient: GraphQLClient

export const useAppMutate = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  //トークンが切り替わる為に再生性させる
  useEffect(() => {
    graphQLClient = new GraphQLClient(endpoint, {
      //JWTトークンをクッキーから取得して割り当てる
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
    })
  }, [cookie.get('token')])

  //タスクの新規作成
  const createTaskMutation = useMutation(
    (title: string) => graphQLClient.request(CREATE_TASK, { title: title }),
    {
      //新規作成の通信の処理が成功した場合キャッシュに追加
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData('tasks', [
            ...previousTodos,
            res.insert_tasks_one,
          ])
        }
        //キャッシュの更新が終わったら、状態を初期化(入力フォームのstate)
        dispatch(resetEditedTask())
      },
      onError: () => {
        dispatch(resetEditedTask())
      },
    }
  )
  //タスクの更新
  const updateTaskMutation = useMutation(
    (task: EditTask) => graphQLClient.request(UPDATE_TASK, task),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            //IDと一致したモノを更新する
            previousTodos.map((task) =>
              task.id === variables.id ? res.update_tasks_by_pk : task
            )
          )
        }
        dispatch(resetEditedTask())
      },
      onError: () => {
        dispatch(resetEditedTask())
      },
    }
  )

  //タスクの削除
  const deleteTaskMutation = useMutation(
    (id: string) => graphQLClient.request(DELETE_TASK, { id: id }),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
            //今削除したタスク以外を取り出す
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        dispatch(resetEditedTask())
      },
    }
  )

  //ニュースを新規作成
  const createNewsMutation = useMutation(
    (content: string) =>
      graphQLClient.request(CREATE_NEWS, { content: content }),
    {
      onSuccess: (res) => {
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          queryClient.setQueryData('news', [
            ...previousNews,
            res.insert_news_one,
          ])
        }
        dispatch(resetEditedNews())
      },
      onError: () => {
        dispatch(resetEditedNews())
      },
    }
  )

  //ニュースのアップデート
  const updateNewsMutation = useMutation(
    (news: EditNews) => graphQLClient.request(UPDATE_NEWS, news),
    {
      onSuccess: (res, variables) => {
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          queryClient.setQueryData<News[]>(
            'news',
            previousNews.map((news) =>
              news.id === variables.id ? res.update_news_by_pk : news
            )
          )
        }
        dispatch(resetEditedNews())
      },
      onError: () => {
        dispatch(resetEditedNews())
      },
    }
  )

  //ニュースの削除
  const deleteNewsMutation = useMutation(
    (id: string) => graphQLClient.request(DELETE_NEWS, { id: id }),
    {
      onSuccess: (res, variables) => {
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          queryClient.setQueryData<News[]>(
            'news',
            previousNews.filter((news) => news.id !== variables)
          )
        }
        dispatch(resetEditedNews())
      },
    }
  )
  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    createNewsMutation,
    updateNewsMutation,
    deleteNewsMutation,
  }
}
