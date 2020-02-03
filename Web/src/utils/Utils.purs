module Utils where

import Prelude
import Control.Monad.Except (runExcept, throwError)
import Data.Maybe (Maybe(..), maybe)
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Aff (Fiber, runAff_, forkAff)
import Effect.Class (liftEffect)
import Effect.Console as Console
import Effect.Exception (error, throw)
import Foreign (F, Foreign)
import Foreign.Generic (class Decode, decodeJSON)
import Foreign.Generic.Class (encode)
import Types (Free)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (getItem, setItem, removeItem)

foreign import _foreignRead :: forall a. Foreign -> String -> (a -> Maybe a) -> Maybe a -> Maybe a
foreign import logAny :: forall a. a -> Unit

liftLeft :: forall a. String -> Free a
liftLeft = throwError <<< error

liftRight :: forall a. Effect a -> Free a
liftRight a = liftEffect a

hoistEff :: forall a. F a -> Effect a
hoistEff a = do
  case (runExcept a) of
    Left err  -> throw $ show err
    Right val -> pure val

saveS :: forall a. Show a => String -> a -> Free Unit
saveS key value = liftRight $ saveSEff key value

saveSEff :: forall a. Show a => String -> a -> Effect Unit
saveSEff key value = setItem key (show value) =<< localStorage =<< window

loadS :: forall a. Decode a => String -> Free (Maybe a)
loadS = liftRight <<< loadSEff

loadSEff :: forall a. Decode a => String -> Effect (Maybe a)
loadSEff key = do
  window >>= localStorage
  >>= getItem key
  >>= maybe (pure Nothing) (hoistEff <<< decodeJSON)

deleteS :: String -> Free Unit
deleteS = liftRight <<< deleteSEff

deleteSEff :: String -> Effect Unit
deleteSEff key = removeItem key =<< localStorage =<< window

foreignRead :: String -> Foreign -> Foreign
foreignRead k f = do
  let res = _foreignRead f k (Just) (Nothing)
  case res of
    Nothing -> encode {}
    Just a  -> a

runFree_ :: forall a. Show a => Free a -> Effect Unit
runFree_ = runAff_ (\result ->
  case result of
    Left e  -> Console.error $ show e
    Right r -> Console.log $ show r
)

forkFree :: forall a. Free a -> Free (Fiber a)
forkFree = forkAff
