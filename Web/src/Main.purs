module Main where

import Prelude
import Constants (sFIREBASE_TOKEN)
import Control.Monad.Except (runExceptT)
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Aff (launchAff_, launchAff, joinFiber)
import Effect.Class (liftEffect)
import Effect.Console (log, error)
import Firebase (initializeApp, initMessaging, onTokenRefresh, requestPermission, saveToken, saveTokenEff, onMessage)
import Types (Free, FIREBASE, FIREBASE_PERMISSION(..))
import Utils (liftLeft, liftRight, loadS)

initFirebase :: Free FIREBASE
initFirebase = do
  initializeApp
  result <- requestPermission
  case result of
    GRANTED -> do
      msg <- initMessaging
      saveToken msg
      onTokenRefresh msg (saveTokenEff msg)
      pure msg
    DENIED  -> liftLeft "Sorry no permission. no webpage."


start :: Free Unit
start = do
  messaging <- initFirebase
  token <- loadS sFIREBASE_TOKEN ""
  onMessage messaging log
  liftRight $ log token


main :: Effect Unit
main = launchAff_ $ do
  fiber  <- liftEffect $ launchAff $ runExceptT start
  result <- joinFiber fiber
  case result of
    Left e  -> liftEffect $ error e
    Right r -> pure unit


