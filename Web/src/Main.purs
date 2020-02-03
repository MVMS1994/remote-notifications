module Main where

import Prelude
import Auth (initAuthListener, _initSignIn)
import Constants (sAUTH_PAYLOAD)
import Data.Maybe (Maybe(..))
import Data.Either (Either(..))
import Data.Traversable (traverse)
import Effect (Effect)
import Effect.Aff (runAff_)
import Effect.Console (log, error)
import Firebase (initMessaging, onTokenRefresh, requestPermission, saveToken, saveTokenEff, onMessage)
import RN.UI as UI
import Reducers (rootReducer)
import Types (Free, FIREBASE, FIREBASE_PERMISSION(..), GoogleUser(..), GoogleUserProfile, Notification)
import Utils (liftLeft, deleteSEff, saveSEff)

--==================================== LISTENERS ====================================--

authListener :: FIREBASE -> GoogleUser -> Effect Unit
authListener messaging (GoogleUser _user) = do
  case _user of
    Nothing   -> cleanUPFlow
    Just user -> initFlow messaging user


cleanUPFlow :: Effect Unit
cleanUPFlow = do
  UI.updateSignInStatus "SIGNED_OUT" ""
  _ <- traverse deleteSEff [sAUTH_PAYLOAD]
  _initSignIn


initFlow :: FIREBASE -> GoogleUserProfile -> Effect Unit
initFlow messaging user = do
  UI.updateSignInStatus "SIGNED_IN" user.displayName
  saveSEff sAUTH_PAYLOAD $ show user
  onMessage messaging onNewMessage


onNewMessage :: Notification -> Effect Unit
onNewMessage = log <<< show


--==================================== =========== ====================================--

initFirebase :: Free FIREBASE
initFirebase = do
  result <- requestPermission
  case result of
    GRANTED -> do
      msg <- initMessaging
      saveToken msg
      onTokenRefresh msg (saveTokenEff msg)
      pure msg
    DENIED  -> liftLeft "Sorry no permission. no webpage."

start :: Free Unit
start = do
  UI.initUI rootReducer
  messaging <- initFirebase
  initAuthListener $ authListener messaging

main :: Effect Unit
main = runAff_ (\result ->
  case result of
    Left e  -> error $ show e
    Right r -> log "done"
) start
