module Backend where

import Prelude
import API.Types (DeRegisterPushTokenReq(..), RegisterPushTokenReq(..))
import Axios as A
import Constants as C
import Data.Either (Either, either)
import Data.Maybe (Maybe, maybe', maybe)
import Data.Newtype (unwrap)
import Effect.Console as Console
import Effect.Exception (Error)
import Foreign.Generic (class Encode)
import Types (Free, GoogleUser)
import Utils (loadS, liftRight, liftLeft, saveS)

baseURL :: String
baseURL = "https://us-central1-remote-notifications-5931d.cloudfunctions.net"
-- baseURL = "http://localhost:5000/remote-notifications-5931d/us-central1"

defaultConfig :: A.Method -> Array A.Config
defaultConfig a =
  [ A.method a
  , A.headers []
  , A.baseUrl baseURL
  ]

makeAPI :: forall req resp. Encode req => A.Method -> String -> req -> Free Unit
makeAPI a path req = A.genericAxios path (defaultConfig a) req >>= either (liftLeft <<< show) (pure)



registerPushToken :: Free Unit
registerPushToken = do
  sentToServer <- maybe false identity <$> loadS C.sDB_NAME C.sSENT_TO_SERVER
  case sentToServer of
    true -> pure unit
    false -> do
      push <- fetchToken =<< loadS C.sDB_NAME C.sFIREBASE_TOKEN
      user <- fetchUser <<< unwrap =<< fetchUser =<< (loadS C.sDB_NAME C.sAUTH_PAYLOAD :: Free (Maybe GoogleUser))
      let request = RegisterPushTokenReq {
        uid: user.uid,
        accessToken: user.accessToken,
        firebaseToken: push,
        signature: "veera"
      }
      resp <- makeAPI A.POST "/notifications/v0/registerPushToken" request
      liftRight $ Console.log $ show resp

  where
    fetchToken :: Maybe String -> Free String
    fetchToken = maybe' (\_ -> liftLeft "Can't find the push token") (pure)

    fetchUser :: forall a. Maybe a -> Free a
    fetchUser  = maybe' (\_ -> liftLeft "Can't find the auth token") (pure)


deregisterPushToken :: Free Unit
deregisterPushToken = do
  push <- fetchToken =<< loadS C.sDB_NAME C.sFIREBASE_TOKEN
  let request = DeRegisterPushTokenReq {
    firebaseToken: push
  }
  resp <- makeAPI A.DELETE "/notifications/v0/deletePushToken" request
  liftRight $ Console.log $ show resp

  where
    fetchToken :: Maybe String -> Free String
    fetchToken = maybe' (\_ -> liftLeft "Can't find the push token") (pure)
