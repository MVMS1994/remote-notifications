module API.Types where

import Prelude
import Data.Generic.Rep (class Generic)
import Data.Newtype (class Newtype)
import Foreign.Generic (class Decode, class Encode, genericEncode, genericDecode, defaultOptions, encodeJSON)

newtype RegisterPushToken = RegisterPushToken
  { "uid" :: String
  , "accessToken" :: String
  , "firebaseToken" :: String
  , "signature" :: String
  }

derive instance newtypeRegisterPushToken :: Newtype RegisterPushToken _
derive instance genericRegisterPushToken :: Generic RegisterPushToken _
instance encodeRegisterPushToken :: Encode RegisterPushToken where
  encode = genericEncode (defaultOptions {unwrapSingleConstructors = true})
instance decodeRegisterPushToken :: Decode RegisterPushToken where
  decode = genericDecode (defaultOptions {unwrapSingleConstructors = true})
instance showRegisterPushToken :: Show RegisterPushToken where
  show = encodeJSON
