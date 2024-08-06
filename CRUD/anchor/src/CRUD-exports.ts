// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CRUDIDL from '../target/idl/CRUD.json'
import type { CRUD } from '../target/types/CRUD'

// Re-export the generated IDL and type
export { CRUD, CRUDIDL }

// The programId is imported from the program IDL.
export const CRUD_PROGRAM_ID = new PublicKey(CRUDIDL.address)

// This is a helper function to get the CRUD Anchor program.
export function getCRUDProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...CRUDIDL, address: address ? address.toBase58() : CRUDIDL.address } as CRUD, provider)
}

// This is a helper function to get the program ID for the CRUD program depending on the cluster.
export function getCRUDProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the CRUD program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return CRUD_PROGRAM_ID
  }
}
