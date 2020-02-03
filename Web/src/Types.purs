module Types where

import Prelude
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Effect (Effect)
import Effect.Aff (Aff)
import Foreign (Foreign)
import Foreign.Generic (class Decode, class Encode, genericEncode, genericDecode, defaultOptions, encodeJSON)

type Free a = Aff a

foreign import data FIREBASE :: Type
data FIREBASE_PERMISSION = GRANTED | DENIED

newtype Notification = Notification Foreign
derive instance newtypeNotification :: Newtype Notification _
derive instance genericNotification :: Generic Notification _
instance encodeNotification :: Encode Notification where
  encode = genericEncode (defaultOptions {unwrapSingleConstructors = true})
instance decodeNotification :: Decode Notification where
  decode = genericDecode (defaultOptions {unwrapSingleConstructors = true})
instance showNotification :: Show Notification where
  show = encodeJSON


type GoogleUserProfile = {
  uid :: String,
  email :: String,
  photoURL :: String,
  accessToken :: String,
  displayName :: String,
  emailVerified :: Boolean
}

newtype GoogleUser = GoogleUser (Maybe GoogleUserProfile)
derive instance newtypeGoogleUser :: Newtype GoogleUser _
derive instance genericGoogleUser :: Generic GoogleUser _
instance encodeGoogleUser :: Encode GoogleUser where
  encode = genericEncode (defaultOptions {unwrapSingleConstructors = true})
instance decodeGoogleUser :: Decode GoogleUser where
  decode = genericDecode (defaultOptions {unwrapSingleConstructors = true})
instance showGoogleUser :: Show GoogleUser where
  show = encodeJSON




type AppUIState = {
  isLoading :: Boolean,
  isSignedIn :: Boolean,
  userName :: String
}

type AppAction a =
  { "type" :: String
  | a
  }

type AppReducers = {
  "ui-state" :: Foreign -> (forall a. AppAction a) -> Effect AppUIState
}

type ReactStore = {
  getState :: Effect AppUIState,
  dispatch :: forall a. (AppAction a) -> Effect Unit
}