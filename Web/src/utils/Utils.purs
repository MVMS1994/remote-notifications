module Utils where

import Prelude
import Control.Monad.Except (runExcept, throwError)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Exception (error, throw)
import Foreign (F, Foreign)
import Foreign.Generic.Class (encode)
import Types (Free)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (getItem, setItem, removeItem)

foreign import _foreignRead :: forall a. Foreign -> String -> (a -> Maybe a) -> Maybe a -> Maybe a
foreign import logAny :: forall a. a -> Unit

infixl 8 foreignRead as .^.

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
saveS key value = liftRight $ saveSEff key value

saveSEff :: String -> String -> Effect Unit
saveSEff key value = (setItem key value) =<< (localStorage =<< window)

loadS :: String -> String -> Free String
loadS key defaultValue = do
  s <- liftRight do (localStorage =<< window)
  liftRight $ fromMaybe defaultValue <$> getItem key s

deleteS :: String -> Free Unit
deleteS = liftRight <<< deleteSEff

deleteSEff :: String -> Effect Unit
deleteSEff key = (removeItem key) =<< localStorage =<< window

foreignRead :: String -> Foreign -> Foreign
foreignRead k f = do
  let res = _foreignRead f k (Just) (Nothing)
  case res of
    Nothing -> encode {}
    Just a  -> a