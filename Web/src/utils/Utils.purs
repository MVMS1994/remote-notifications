module Utils where

import Prelude
import Control.Monad.Except (runExcept, throwError)
import Data.Maybe (Maybe(..), maybe)
import Data.Either (Either(..), hush)
import Effect (Effect)
import Effect.Aff (Fiber, runAff_, forkAff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Console as Console
import Effect.Exception (error, throw)
import Foreign (F, Foreign)
import Foreign.Generic (class Decode, class Encode, decode, encode)
import Localforage as DB
import Types (Free, Notification)

foreign import _windowWrite :: String -> Foreign -> Effect Unit
foreign import _windowRead :: forall a. String -> (a -> Maybe a) -> Maybe a -> Effect (Maybe a)
foreign import _backfillMD5 :: forall a. Array a -> Effect (Array a)
foreign import downloadFile :: String -> String -> Effect Unit
foreign import _loadFile :: EffectFnAff (Array Notification)
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

getDBInstance :: String -> Free DB.Localforage
getDBInstance dbName = liftRight $ DB.createInstance (DB.defaultLocalforageConfig { name=dbName })

saveS :: forall a. Encode a => String -> String -> a -> Free Unit
saveS dbName key value = do
  db <- maybe (liftLeft "Can't find DB") pure =<< windowRead dbName
  void $ DB.setItem db key $ encode value

loadS :: forall a. Decode a => String -> String -> Free (Maybe a)
loadS dbName key = do
  db <- maybe (liftLeft "Can't find DB") (pure) =<< windowRead dbName
  item <- hush <$> DB.getItem db key
  maybe (pure Nothing) (liftRight <<< hoistEff <<< decode) item


deleteS :: String -> String -> Free Unit
deleteS dbName key = do
  conn <- maybe (liftLeft "Can't find DB") (pure) =<< windowRead dbName
  _    <- DB.removeItem conn key
  pure unit

windowWrite :: forall a. Encode a => String -> a -> Free Unit
windowWrite k = liftRight <<< _windowWrite k <<< encode

windowRead :: forall a. String -> Free (Maybe a)
windowRead k = liftRight $ _windowRead k (Just) (Nothing)

runFree_ :: forall a. Show a => Free a -> Effect Unit
runFree_ = runAff_ (\result ->
  case result of
    Left e  -> Console.error $ show e
    Right r -> Console.log $ show r
)

forkFree :: forall a. Free a -> Free (Fiber a)
forkFree = forkAff

backfillMD5 :: forall a. Array a -> Free (Array a)
backfillMD5 = liftRight <<< _backfillMD5

importNotifications :: Free (Array Notification)
importNotifications = fromEffectFnAff $ _loadFile
