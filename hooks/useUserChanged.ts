import { useEffect } from 'react'
import firebase from '../firebaseConfig'
import { useRouter } from 'next/router'
import Cookie from 'universal-cookie'

//onAuthStateChangedを停止するために必要
//cloudfunctionsのCustomUserClaimsを設定された事を検知した際に実行する
//ログアウトする際にアンサブスクライブする際に使う
export let unSubMeta: () => void

//firebaseのユーザーが変わった際に実行される関数
export const useUserChanged = () => {
  //JWTトークンをクッキーに格納したいのでクッキーを使う
  const cookie = new Cookie()
  const router = useRouter()

  //取得したJWTトークンの中にHausraのCustomUserClaisが含まれているか評価する際にcloudfunctionsで設定したcustomClaimsのurlがJWTトークンにふくまれているか判断できる
  const HASURA_TOKEN_KEY = 'https://hasura.io/jwt/claims'

  useEffect(() => {
    //ユーザーが変わる度によびだされる
    const unSubUser = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        //新規ユーザーに対応するトークンとTokenResultを取得
        const token = await user.getIdToken(true)
        const idTokenResult = await user.getIdTokenResult()
        //Hasura対応したCustomUserClaisが含まれているか評価するためにidTokenResult.claimsにアクセスしてHASURA_TOKEN_KEYに対応するデータを取得する
        //含まれている処理はcloud functions（setCustomUserClaims）で実行されている
        const hasuraClaims = idTokenResult.claims[HASURA_TOKEN_KEY]
        //firebaseのcloudfunctionsのカスタムクレイムで設定した内容でこの3つ(hasuraClaims)が存在したらhasura用のカスタムクレイムの追加が成功しているので、そのJWTトークンをクッキーに格納してメインページに遷移
        if (hasuraClaims) {
          cookie.set('token', token, { path: '/' })
          router.push('/tasks')
        } else {
          //hasuraClaimsが存在しない場合は「cloud functionsで実行している  await admin.auth().setCustomUserClaims(user.uid, customClaims」の実行完了のばらつきがるので、
          //タイミングによってはhasuraClaimsがない場合がああるので処理を追加
          //処理の内容としてはsetCustomUserClaimsが終わった際に、firestoreのドキュメントにuser_metaコレクション配下のデータがあるか変化を検知して検知があったら、上でやった内容と同じ事をする
          const userRef = firebase
            .firestore()
            .collection('user_meta')
            .doc(user.uid)
          //データの変更を検知
          unSubMeta = userRef.onSnapshot(async () => {
            //そのときの最新のトークンとTokenResultを取得
            const tokenSnap = await user.getIdToken(true)
            const idTokenResultSnap = await user.getIdTokenResult()
            const hasuraClaimsSnap = idTokenResultSnap.claims[HASURA_TOKEN_KEY]
            if (hasuraClaimsSnap) {
              cookie.set('token', tokenSnap, { path: '/' })
              router.push('/tasks')
            }
          })
        }
      }
    })
    //subscriptionの停止
    return () => {
      unSubUser()
    }
  }, [])
  return {}
}
