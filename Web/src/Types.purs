module Types where

import Control.Monad.Except (ExceptT)
import Effect.Aff (Aff)

type Free a = ExceptT String Aff a

foreign import data FIREBASE :: Type
data FIREBASE_PERMISSION = GRANTED | DENIED