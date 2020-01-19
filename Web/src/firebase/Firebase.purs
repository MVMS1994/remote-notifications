module Firebase where

import Prelude
import Constants (sFIREBASE_TOKEN)
import Data.Either(Either(..))
import Effect (Effect)
import Effect.Aff (Aff, makeAff, nonCanceler, runAff_)
import Effect.Console (error) as Console
import Effect.Exception (error)
import Types (Free, FIREBASE, FIREBASE_PERMISSION(..))
import Utils (liftRight, liftRightAff)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (setItem)

foreign import _initializeApp      :: Effect Unit
foreign import _initMessaging      :: Effect FIREBASE
foreign import _requestPermission :: (FIREBASE_PERMISSION -> Effect Unit) -> FIREBASE_PERMISSION -> FIREBASE_PERMISSION -> Effect FIREBASE_PERMISSION
foreign import _onTokenRefresh    :: (Effect Unit) -> FIREBASE -> Effect Unit
foreign import _onMessage         :: (String -> Effect Unit) -> FIREBASE -> Effect Unit
foreign import _getToken          :: (String -> Effect Unit) -> (String -> Effect Unit) -> FIREBASE -> Effect Unit

requestPermission :: Free FIREBASE_PERMISSION
requestPermission = liftRightAff $ makeAff (\cb -> _requestPermission (Right >>> cb) GRANTED DENIED *> pure nonCanceler)

initializeApp :: Free Unit
initializeApp = liftRight $ _initializeApp

initMessaging :: Free FIREBASE
initMessaging = liftRight $ _initMessaging

getToken :: FIREBASE -> Aff String
getToken messaging = makeAff (\cb -> _getToken (Right >>> cb) (error >>> Left >>> cb) messaging *> pure nonCanceler)

onTokenRefresh :: FIREBASE -> Effect Unit -> Free Unit
onTokenRefresh messaging cb = liftRight $ _onTokenRefresh cb messaging

onMessage :: FIREBASE -> (String -> Effect Unit) -> Free Unit
onMessage messaging cb = liftRight $ _onMessage cb messaging


saveTokenEff :: FIREBASE -> Effect Unit
saveTokenEff messaging = do
  s <- localStorage =<< window
  runAff_ (\result -> do
    case result of
      Right resp -> setItem sFIREBASE_TOKEN resp s
      Left error -> Console.error $ show error
  ) (getToken messaging)

saveToken :: FIREBASE -> Free Unit
saveToken = liftRight <<< saveTokenEff