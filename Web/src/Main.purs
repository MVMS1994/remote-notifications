module Main where

import Prelude
import Auth (initAuthListener, initSignIn)
import Backend as API
import Constants as C
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Effect (Effect)
import Effect.Console as Console
import Firebase (initMessaging, onTokenRefresh, requestPermission, saveToken, onMessage)
import RN.UI as UI
import Reducers (rootReducer)
import Types (Free, FIREBASE, FIREBASE_PERMISSION(..), GoogleUser(..), Notification)
import Utils (liftLeft, liftRight, deleteS, saveS, runFree_, forkFree)

--==================================== LISTENERS ====================================--

authListener :: FIREBASE -> GoogleUser -> Effect Unit
authListener messaging u@(GoogleUser _user) = runFree_ do
  case _user of
    Nothing   -> cleanUPFlow
    Just user -> initFlow messaging u

onNewMessage :: Notification -> Effect Unit
onNewMessage = runFree_ <<< liftRight <<< Console.log <<< show

--==================================== =========== ====================================--

cleanUPFlow :: Free Unit
cleanUPFlow = do
  UI.updateSignInStatus "SIGNED_OUT" ""
  deleteS C.sAUTH_PAYLOAD
  initSignIn


initFlow :: FIREBASE -> GoogleUser -> Free Unit
initFlow messaging user = do
  let name = maybe "" _.displayName (unwrap user)
  UI.updateSignInStatus "SIGNED_IN" name
  saveS C.sAUTH_PAYLOAD user
  onMessage messaging onNewMessage
  API.registerPushToken


initFirebase :: Free FIREBASE
initFirebase = do
  result <- requestPermission
  case result of
    GRANTED -> do
      msg <- initMessaging
      _   <- forkFree $ saveToken msg
      onTokenRefresh msg (runFree_ $ saveToken msg)
      pure msg
    DENIED  -> liftLeft "Sorry no permission. no webpage."


start :: Free Unit
start = do
  UI.initUI rootReducer
  messaging <- initFirebase
  initAuthListener $ authListener messaging


main :: Effect Unit
main = runFree_ start
