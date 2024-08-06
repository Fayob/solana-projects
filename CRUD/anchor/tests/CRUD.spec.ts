import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {CRUD} from '../target/types/CRUD'

describe('CRUD', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.CRUD as Program<CRUD>

  const CRUDKeypair = Keypair.generate()

  it('Initialize CRUD', async () => {
    await program.methods
      .initialize()
      .accounts({
        CRUD: CRUDKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([CRUDKeypair])
      .rpc()

    const currentCount = await program.account.CRUD.fetch(CRUDKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment CRUD', async () => {
    await program.methods.increment().accounts({ CRUD: CRUDKeypair.publicKey }).rpc()

    const currentCount = await program.account.CRUD.fetch(CRUDKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment CRUD Again', async () => {
    await program.methods.increment().accounts({ CRUD: CRUDKeypair.publicKey }).rpc()

    const currentCount = await program.account.CRUD.fetch(CRUDKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement CRUD', async () => {
    await program.methods.decrement().accounts({ CRUD: CRUDKeypair.publicKey }).rpc()

    const currentCount = await program.account.CRUD.fetch(CRUDKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set CRUD value', async () => {
    await program.methods.set(42).accounts({ CRUD: CRUDKeypair.publicKey }).rpc()

    const currentCount = await program.account.CRUD.fetch(CRUDKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the CRUD account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        CRUD: CRUDKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.CRUD.fetchNullable(CRUDKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
