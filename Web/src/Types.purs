module Types where

import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Show (class Show)
import Effect.Aff (Aff)
import Foreign.Generic (class Decode, class Encode, genericEncode, genericDecode, defaultOptions, encodeJSON)

type Free a = Aff a

foreign import data FIREBASE :: Type
data FIREBASE_PERMISSION = GRANTED | DENIED

newtype Notification = Notification {
  "title" :: Maybe String,
  "body" :: Maybe String,
  "priority" :: String,
  "tag" :: Maybe String,
  "image" :: Maybe String
}

derive instance newtypeNotification :: Newtype Notification _
derive instance genericNotification :: Generic Notification _
instance encodeNotification :: Encode Notification where
  encode = genericEncode (defaultOptions {unwrapSingleConstructors = true})
instance decodeNotification :: Decode Notification where
  decode = genericDecode (defaultOptions {unwrapSingleConstructors = true})
instance showNotification :: Show Notification where
  show = encodeJSON