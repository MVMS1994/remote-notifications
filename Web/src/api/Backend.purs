module Backend where

import Prelude
import API.Types (RegisterPushToken(..))
import Axios as A
import Constants as C
import Data.Either (Either, either)
import Data.Maybe (Maybe, maybe')
import Data.Newtype (unwrap)
import Effect.Console as Console
import Effect.Exception (Error)
import Foreign.Generic (class Encode)
import Types (Free, GoogleUser)
import Utils (loadS, liftRight, liftLeft)

baseURL :: String
baseURL = "http://localhost:5000/remote-notifications-5931d/us-central1"

defaultConfig :: Array A.Config
defaultConfig =
  [ A.method A.POST
  , A.headers []
  , A.baseUrl baseURL
  ]

makeAPI :: forall req. Encode req => String -> req -> Free (Either Error Unit)
makeAPI path req = A.genericAxios path defaultConfig req



registerPushToken :: Free Unit
registerPushToken = do
  push <- fetchToken =<< loadS C.sFIREBASE_TOKEN
  user <- fetchUser <<< unwrap =<< fetchUser =<< (loadS C.sAUTH_PAYLOAD :: Free (Maybe GoogleUser))
  let request = RegisterPushToken {
    uid: user.uid,
    accessToken: user.accessToken,
    firebaseToken: push,
    signature: "veera"
  }
  resp <- makeAPI "/registerPushToken" request
  either (liftLeft <<< show) (liftRight <<< Console.log <<< show) resp

  where
    fetchToken :: Maybe String -> Free String
    fetchToken = maybe' (\_ -> liftLeft "Can't find the push token") (pure)

    fetchUser :: forall a. Maybe a -> Free a
    fetchUser  = maybe' (\_ -> liftLeft "Can't find the auth token") (pure)