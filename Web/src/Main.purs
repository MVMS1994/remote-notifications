module Main where

import Prelude
import Control.Monad.Except (runExceptT)
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Aff (launchAff_, launchAff, joinFiber)
import Effect.Class (liftEffect)
import Effect.Console (log, error)
import Types (Free)
import Utils (liftLeft, liftRight)

start :: Free Unit
start = liftRight $ log "Hello sailor!"

main :: Effect Unit
main = launchAff_ $ do
  fiber  <- liftEffect $ launchAff $ runExceptT start
  result <- joinFiber fiber
  case result of
    Left e  -> liftEffect $ error e
    Right r -> pure unit
