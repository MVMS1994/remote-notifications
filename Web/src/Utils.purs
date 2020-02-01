module Utils where

import Prelude
import Control.Monad.Except (runExcept, throwError)
import Data.Maybe (fromMaybe)
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Exception (error, throw)
import Foreign (F)
import Types (Free)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (getItem, setItem)


liftLeft :: forall a. String -> Free a
liftLeft = throwError <<< error

liftRight :: forall a. Effect a -> Free a
liftRight a = liftEffect a

hoistEff :: forall a. F a -> Effect a
hoistEff a = do
  case (runExcept a) of
    Left err  -> throw $ show err
    Right val -> pure val

saveS :: String -> String -> Free Unit
saveS key value = do
  s <- liftRight do (localStorage =<< window)
  liftRight $ setItem key value s

loadS :: String -> String -> Free String
loadS key defaultValue = do
  s <- liftRight do (localStorage =<< window)
  liftRight $ fromMaybe defaultValue <$> getItem key s