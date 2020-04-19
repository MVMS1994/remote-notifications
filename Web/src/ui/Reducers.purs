module Reducers where

import Prelude
import Auth (_signOut)
import Constants as C
import Data.Array (concat)
import Data.Maybe (Maybe, maybe)
import Effect (Effect)
import Effect.Console as Console
import Foreign (Foreign, isNull, isUndefined)
import Foreign.Generic (decode)
import Types (AppUIState, AppAction, AppReducers, Free, Notification)
import Utils (hoistEff, downloadFile, importNotifications, loadS, saveS, runFree_)
import RN.UI (updateFilters, displayNotifications)

initialUIState :: AppUIState
initialUIState = {
  isLoading: true,
  isSignedIn: false,
  userName: "",
  notifications: [],
  filters: {
    sources: [{
      source: "_all",
      count: 0,
      name: "Notifications"  
    }]
  }
}

uiHandler :: AppUIState -> (forall a. AppAction a) -> Effect AppUIState
uiHandler state action = do
  case action.type of
    "SIGNED_IN"   -> pure state { isLoading=false, isSignedIn=true, userName=action.userName }
    "SIGNED_OUT"  -> pure state { isLoading=false, isSignedIn=false, userName="", notifications=[] }
    "DO_SIGN_OUT" -> Console.log "signing out" *> _signOut *> pure state { isLoading=true }
    "NEW_TAB"     -> (Console.log $ "new tab: " <> action.tab) *> pure state

    "DISP_NOTIF"  -> do
      newFilters <- updateFilters action.notifications initialUIState.filters
      pure state { notifications=action.notifications, filters=newFilters }

    "EXPORT_DB"   -> do
      downloadFile (show state.notifications) "Remote Notifications.json"
      pure state

    "IMPORT_DB"   -> (runFree_ importAndDisplay) *> pure state

    _ -> pure state


toState :: AppUIState -> Foreign -> Effect AppUIState
toState default f = do
  case (isNull f || isUndefined f) of
    true  -> pure default
    false -> hoistEff $ decode f


rootReducer :: AppReducers
rootReducer = {
  "ui-state": (\s a -> do
    state <- toState initialUIState s
    uiHandler state a
  )
}

importAndDisplay :: Free Unit
importAndDisplay = do
  loadedNotif   <- importNotifications
  existingNotif <- fetchNotifications =<< loadS C.sDB_NAME C.sNOTIFICATIONS
  let mergedNotif = concat [loadedNotif, existingNotif]
  saveS C.sDB_NAME C.sNOTIFICATIONS mergedNotif
  displayNotifications mergedNotif

  where
    fetchNotifications :: Maybe (Array Notification) -> Free (Array Notification)
    fetchNotifications = pure <<< maybe [] identity