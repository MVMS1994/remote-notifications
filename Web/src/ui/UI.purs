module RN.UI where

import Prelude
import Effect (Effect)
import Types (AppReducers, FilterTypes, Free, Notification, ReactStore)
import Utils (liftRight)

foreign import _initUI  :: AppReducers -> Effect Unit
foreign import getStore :: Effect ReactStore
foreign import updateFilters :: Array Notification -> FilterTypes -> Effect FilterTypes

initUI :: AppReducers -> Array Notification -> Free Unit
initUI reducer messages = do
  liftRight $ _initUI reducer
  displayNotifications messages

updateSignInStatus :: String -> String -> Free Unit
updateSignInStatus _type userName = liftRight $ do
  store <- getStore
  store.dispatch {"type": _type, userName}

displayNotifications :: Array Notification -> Free Unit
displayNotifications notifications = liftRight $ do
  store <- getStore
  store.dispatch {"type": "DISP_NOTIF", notifications}
