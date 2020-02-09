module Main where

import Prelude
import Auth (initAuthListener, initSignIn)
import Backend as API
import Constants as C
import Data.Array (snoc)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Traversable (traverse)
import Effect (Effect)
import Effect.Console as Console
import Firebase (initMessaging, onTokenRefresh, requestPermission, saveToken, onMessage)
import RN.UI as UI
import Reducers (rootReducer)
import Types (Free, FIREBASE, FIREBASE_PERMISSION(..), GoogleUser(..), Notification)
import Utils (liftLeft, liftRight, loadS, deleteS, getDBInstance, windowWrite, saveS, runFree_, forkFree)

--==================================== LISTENERS ====================================--

authListener :: FIREBASE -> GoogleUser -> Effect Unit
authListener messaging u@(GoogleUser _user) = runFree_ do
  case _user of
    Nothing   -> cleanUPFlow
    Just user -> initFlow messaging u

onNewMessage :: Notification -> Effect Unit
onNewMessage message = runFree_ do
  liftRight $ Console.log $ show message
  savedMsgs <- fetchNotifications =<< loadS C.sDB_NAME C.sNOTIFICATIONS
  let allMsgs = snoc savedMsgs message
  saveS C.sDB_NAME C.sNOTIFICATIONS allMsgs
  UI.displayNotifications allMsgs

  where
    fetchNotifications :: Maybe (Array Notification) -> Free (Array Notification)
    fetchNotifications = pure <<< maybe [] identity


--==================================== =========== ====================================--

cleanUPFlow :: Free Unit
cleanUPFlow = do
  saveS C.sDB_NAME C.sSENT_TO_SERVER false
  _ <- forkFree $ API.deregisterPushToken
  void $ traverse (deleteS C.sDB_NAME) [C.sNOTIFICATIONS, C.sAUTH_PAYLOAD]
  UI.updateSignInStatus "SIGNED_OUT" ""
  initSignIn


initFlow :: FIREBASE -> GoogleUser -> Free Unit
initFlow messaging user = do
  let name = maybe "" _.displayName (unwrap user)
  UI.updateSignInStatus "SIGNED_IN" name
  saveS C.sDB_NAME C.sAUTH_PAYLOAD user
  onMessage messaging onNewMessage
  API.registerPushToken
  saveS C.sDB_NAME C.sSENT_TO_SERVER true


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
  getDBInstance C.sDB_NAME >>= windowWrite C.sDB_NAME
  savedMsgs <- fetchNotifications =<< loadS C.sDB_NAME C.sNOTIFICATIONS
  UI.initUI (rootReducer savedMsgs)
  messaging <- initFirebase
  initAuthListener $ authListener messaging

  where
    fetchNotifications :: Maybe (Array Notification) -> Free (Array Notification)
    fetchNotifications = pure <<< maybe [] identity


main :: Effect Unit
main = runFree_ start
