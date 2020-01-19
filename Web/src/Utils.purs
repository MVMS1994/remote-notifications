module Utils where

import Prelude
import Control.Monad.Except (ExceptT(..))
import Effect (Effect)
import Effect.Class (liftEffect)
import Data.Either (Either(..))
import Types (Free)

liftLeft :: forall a. String -> Free a
liftLeft = ExceptT <<< pure <<< Left

liftRight :: forall a. Effect a -> Free a
liftRight a = ExceptT $ liftEffect $ Right <$> a
