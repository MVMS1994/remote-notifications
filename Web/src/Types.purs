module Types where

import Prelude
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Effect (Effect)
import Effect.Aff (Aff)
import Foreign (Foreign)
import Foreign.Generic (class Decode, class Encode, genericEncode, genericDecode, defaultOptions, encodeJSON)

foreign import _foreignRead :: forall a. (a -> Maybe a) -> Maybe a -> String -> Foreign -> Maybe a

foreignRead :: forall a. String -> Foreign -> Maybe a
foreignRead = _foreignRead (Just) (Nothing)

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
instance eqNotifications :: Eq Notification where
  eq (Notification a) (Notification b) = do
    let aHash = (foreignRead "hash" a) :: Maybe String
    let bHash = (foreignRead "hash" b) :: Maybe String
    eq bHash aHash
instance ordNotifications :: Ord Notification where
  compare (Notification a) (Notification b) = do
    let aHash = (foreignRead "hash" a) :: Maybe String
    let bHash = (foreignRead "hash" b) :: Maybe String
    compare bHash aHash


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
  userName :: String,
  notifications :: Array Notification,
  filters :: FilterTypes
}

type FilterTypes = {
  sources :: Array Source
}

type Source = {
  source :: String,
  count :: Int,
  name :: String
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