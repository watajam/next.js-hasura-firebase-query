import Cookie from 'universal-cookie'
import firebase from '../firebaseConfig'
import { unSubMeta } from './useUserChanged'
import { useQueryClient } from 'react-query'
import { useDispatch } from 'react-redux'
import { resetEditedTask, resetEditedNews } from '../slices/uiSlice'

const cookie = new Cookie()

export const useLogout = () => {
  //状態のリセット
  const dispatch = useDispatch()
  //キャッシュの削除
  const queryClient = useQueryClient()
  const logout = async () => {
    //ログアウト実行時、subscriptionを停止する関数がある場合はアンサブスクライブを実行し停止する(onSnapshotの関数)
    if (unSubMeta) {
      unSubMeta()
    }
    dispatch(resetEditedTask())
    dispatch(resetEditedNews())
    await firebase.auth().signOut()
    queryClient.removeQueries('tasks')
    queryClient.removeQueries('news')
    //クッキーに保存されているJWTトークン削除
    cookie.remove('token')
  }

  return { logout }
}