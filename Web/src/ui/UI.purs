module RN.UI where

import Prelude
import Effect (Effect)
import Types (ReactStore, AppReducers, Free, Notification)
import Utils (liftRight)

foreign import _initUI  :: AppReducers -> Effect Unit
foreign import getStore :: Effect ReactStore

initUI :: AppReducers -> Free Unit
initUI = liftRight <<< _initUI

updateSignInStatus :: String -> String -> Free Unit
updateSignInStatus _type userName = liftRight $ do
  store <- getStore
  store.dispatch {"type": _type, userName}

displayNotifications :: Array Notification -> Free Unit
displayNotifications notifications = liftRight $ do
  store <- getStore
  store.dispatch {"type": "DISP_NOTIF", notifications}