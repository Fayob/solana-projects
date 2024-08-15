'use client'

import { getCRUDProgram, getCRUDProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

interface CreateEntryArgs {
  title: string,
  message: string,
  owner: PublicKey
}

export function useCRUDProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCRUDProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCRUDProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['CRUD', 'all', { cluster }],
    queryFn: () => program.account.CRUD.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  // const createEntry = useMutation<string, Error, CreateEntryArgs> {
  //   mutationKey: [`journalEntry`, `create`, { cluster }],
  //   mutationFn: async ({title, message, owner}: any) => {
  //     return program.methods.createJournalEntry(title, message).rpc();
  //   }
  // }

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
  }
}

export function useCRUDProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCRUDProgram()

  const accountQuery = useQuery({
    queryKey: ['CRUD', 'fetch', { cluster, account }],
    queryFn: () => program.account.CRUD.fetch(account),
  })

  // const createEntry = useMutation<string, Error, CreateEntryArgs>
  

  return {
    accountQuery,
  }
}
