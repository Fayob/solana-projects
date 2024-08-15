'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useCRUDProgram } from './CRUD-data-access'
import { CRUDCreate, CRUDList } from './CRUD-ui'

export default function CRUDFeature() {
  const { publicKey } = useWallet()
  const { programId } = useCRUDProgram()

  return publicKey ? (
    <div>
      <AppHero
        title="CRUD"
        subtitle={
          'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <CRUDCreate />
      </AppHero>
      <CRUDList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
