module Auth where

import Prelude
import Effect (Effect)
import Effect.Exception (throw)
import Foreign (Foreign)
import Foreign.Generic (decode)
import Types (Free, GoogleUser)
import Utils (liftRight, hoistEff)

foreign import _signOut :: Effect Unit
foreign import _initSignIn :: Effect Unit
foreign import _initAuthListener :: (Foreign -> Effect Unit) -> (String -> Effect Unit) -> Effect Unit

initSignIn :: Free Unit
initSignIn = liftRight $ _initSignIn

initAuthListener :: (GoogleUser -> Effect Unit) -> Free Unit
initAuthListener cb = liftRight $ _initAuthListener (\f -> (hoistEff $ decode f) >>= cb) throw

signOut :: Free Unit
signOut = liftRight $ _signOut