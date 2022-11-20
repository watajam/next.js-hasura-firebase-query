import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// ユーザーが新規で登録した際に実行される物
// firebaseのauthでユーザーが新規で作成される時にJWTトークンを発行したものをHasuraエンドポイントに必
// 要な情報をこのJWTトークンの内容に埋め込む
export const setCustomClaims = functions.auth.user().onCreate(async (user) => {
  // hasuraのエンドポイントように新しく追加で埋め込みたい情報を定義 (customClaims)
  // hasuraのエンドポイントを認証する為に追加で必要になってくる情報
  const customClaims = {
    "https://hasura.io/jwt/claims": {
      // hasuraのroleの値はクライアントからアクセスする際にheaderの情報としてrol
      // eの値を上書きができ、上書きの指定がない場合にデフォルトで定義するモノをroleの値を指定できる（Permissionで指定した内容）
      "x-hasura-default-role": "staff",
      // 存在するrole一覧を配列で指定できる
      "x-hasura-allowed-roles": ["staff"],
      // firebaseのユーザーIDを埋め込む
      // どのユーザーが追加したかを判別するために必要
      "x-hasura-user-id": user.uid,
    },
  };
  try {
    // customClaimsを追加し設定する
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    // ユーザーが新規で登録した際に実行された際にcustomClaimsが付与されるまでにユーザーによって時間のば
    // らつきがありcustomClaimsの設定が完了した事をreact側に通知する仕組みを実装
    // 設定が終わったあと、firestoreにユーザーのmeta情報を書き込む
    // のちにonSnapshotを使い"user_meta"に更新があるか監視をして書き込まれたタイミングを検知し同期化
    await admin.firestore().collection("user_meta").doc(user.uid).create({
      // 設定完了した時間を格納
      refreshTime: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.log(e);
  }
});
