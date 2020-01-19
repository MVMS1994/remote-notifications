module Utils where

import Prelude
import Control.Monad.Except (ExceptT(..))
import Data.Either (Either(..))
import Data.Maybe (fromMaybe)
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Types (Free)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (getItem, setItem)


liftLeft :: forall a. String -> Free a
liftLeft = ExceptT <<< pure <<< Left

liftRight :: forall a. Effect a -> Free a
liftRight a = ExceptT $ liftEffect $ Right <$> a

liftRightAff :: forall a. Aff a -> Free a
liftRightAff a = ExceptT $ Right <$> a


saveS :: String -> String -> Free Unit
saveS key value = do
  s <- liftRight do (localStorage =<< window)
  liftRight $ setItem key value s

loadS :: String -> String -> Free String
loadS key defaultValue = do
  s <- liftRight do (localStorage =<< window)
  liftRight $ fromMaybe defaultValue <$> getItem key s