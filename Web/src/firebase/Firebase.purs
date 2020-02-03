module Firebase where

import Prelude
import Constants as C
import Data.Either(Either(..))
import Effect (Effect)
import Effect.Aff (makeAff, nonCanceler)
import Effect.Exception (error)
import Foreign (Foreign)
import Foreign.Generic (decode)
import Types (Free, FIREBASE, FIREBASE_PERMISSION(..), Notification)
import Utils (liftRight, saveS, hoistEff)

foreign import _initMessaging      :: Effect FIREBASE
foreign import _requestPermission  :: (FIREBASE_PERMISSION -> Effect Unit) -> FIREBASE_PERMISSION -> FIREBASE_PERMISSION -> Effect FIREBASE_PERMISSION
foreign import _onTokenRefresh     :: (Effect Unit) -> FIREBASE -> Effect Unit
foreign import _onMessage          :: (Foreign -> Effect Unit) -> FIREBASE -> Effect Unit
foreign import _getToken           :: (String -> Effect Unit) -> (String -> Effect Unit) -> FIREBASE -> Effect Unit

requestPermission :: Free FIREBASE_PERMISSION
requestPermission = makeAff (\cb -> _requestPermission (Right >>> cb) GRANTED DENIED *> pure nonCanceler)

initMessaging :: Free FIREBASE
initMessaging = liftRight $ _initMessaging

getToken :: FIREBASE -> Free String
getToken messaging = makeAff (\cb -> _getToken (Right >>> cb) (error >>> Left >>> cb) messaging *> pure nonCanceler)

onTokenRefresh :: FIREBASE -> Effect Unit -> Free Unit
onTokenRefresh messaging cb = liftRight $ _onTokenRefresh cb messaging

onMessage :: FIREBASE -> (Notification -> Effect Unit) -> Free Unit
onMessage messaging cb = liftRight $ _onMessage (\f -> cb =<< (hoistEff $ decode f)) messaging

saveToken :: FIREBASE -> Free Unit
saveToken messaging = do
  token <- getToken messaging
  saveS C.sFIREBASE_TOKEN token