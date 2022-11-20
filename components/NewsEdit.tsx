import { VFC, memo, FormEvent } from 'react'
import { useAppMutate } from '../hooks/useAppMutate'
import { useSelector, useDispatch } from 'react-redux'
import { setEditedNews, selectNews } from '../slices/uiSlice'

const NewsEdit: VFC = () => {
  const dispatch = useDispatch()
  const editedNews = useSelector(selectNews)
  const { createNewsMutation, updateNewsMutation } = useAppMutate()

  //新規作成か更新かIDで判定できる
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedNews.id === '') {
      createNewsMutation.mutate(editedNews.content)
    } else {
      //中身はIDとcontent
      updateNewsMutation.mutate(editedNews)
    }
  }

  if (createNewsMutation.error || updateNewsMutation.error) {
    return <div>{'Error'}</div>
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          className="mb-3 border border-gray-300 px-3 py-2"
          placeholder="new news ?"
          type="text"
          //状態管理されているデータが格納
          value={editedNews.content}
          //ユーザーが入力した文字列で状態を置き換える
          onChange={(e) =>
            dispatch(setEditedNews({ ...editedNews, content: e.target.value }))
          }
        />
        <button
          className="my-3 mx-3 rounded bg-indigo-600 py-2 px-3 text-white hover:bg-indigo-700 disabled:opacity-40"
          disabled={!editedNews.content}
        >
          {editedNews.id === '' ? 'Create' : 'Update'}
        </button>
      </form>
    </div>
  )
}
export const NewsEditMemo = memo(NewsEdit)
