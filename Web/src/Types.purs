module Types where

import Control.Monad.Except (ExceptT)
import Effect.Aff (Aff)

type Free a = ExceptT String Aff a