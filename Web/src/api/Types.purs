module API.Types where

import Prelude
import Data.Generic.Rep (class Generic)
import Data.Newtype (class Newtype)
import Foreign.Generic (class Decode, class Encode, genericEncode, genericDecode, defaultOptions, encodeJSON)

newtype RegisterPushTokenReq = RegisterPushTokenReq
  { "uid" :: String
  , "accessToken" :: String
  , "firebaseToken" :: String
  , "signature" :: String
  }

derive instance newtypeRegisterPushTokenReq :: Newtype RegisterPushTokenReq _
derive instance genericRegisterPushTokenReq :: Generic RegisterPushTokenReq _
instance encodeRegisterPushTokenReq :: Encode RegisterPushTokenReq where
  encode = genericEncode (defaultOptions {unwrapSingleConstructors = true})
instance decodeRegisterPushTokenReq :: Decode RegisterPushTokenReq where
  decode = genericDecode (defaultOptions {unwrapSingleConstructors = true})
instance showRegisterPushTokenReq :: Show RegisterPushTokenReq where
  show = encodeJSON


newtype DeRegisterPushTokenReq = DeRegisterPushTokenReq
  { "firebaseToken" :: String
  }
derive instance newtypeDeRegisterPushTokenReq :: Newtype DeRegisterPushTokenReq _
derive instance genericDeRegisterPushTokenReq :: Generic DeRegisterPushTokenReq _
instance encodeDeRegisterPushTokenReq :: Encode DeRegisterPushTokenReq where
  encode = genericEncode (defaultOptions {unwrapSingleConstructors = true})
instance decodeDeRegisterPushTokenReq :: Decode DeRegisterPushTokenReq where
  decode = genericDecode (defaultOptions {unwrapSingleConstructors = true})
instance showDeRegisterPushTokenReq :: Show DeRegisterPushTokenReq where
  show = encodeJSON
