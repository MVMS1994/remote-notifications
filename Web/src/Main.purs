module Main where

import Prelude
import Constants (sFIREBASE_TOKEN)
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Aff (runAff_)
import Effect.Console (log, error)
import Firebase (initMessaging, onTokenRefresh, requestPermission, saveToken, saveTokenEff, onMessage)
import Types (Free, FIREBASE, FIREBASE_PERMISSION(..))
import Utils (liftLeft, loadS)

initFirebase :: Free FIREBASE
initFirebase = do
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
  token <- loadS sFIREBASE_TOKEN "NOT FOUND"
  onMessage messaging (log <<< show)


main :: Effect Unit
main = runAff_ (\result ->
  case result of
    Left e  -> error $ show e
    Right r -> log "done"
) start
