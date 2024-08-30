import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor} from "anchor-bankrun"

const IDL = require("../target/idl/votingdapp.json")

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('votingdapp', () => {
  let context;
  let provider;
  anchor.setProvider(anchor.AnchorProvider.env())
  // let votingProgram = anchor.workspace.Votingdapp as Program<Votingdapp>
  let votingProgram: any;

  beforeAll(async () => {
    context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], [])
    provider = new BankrunProvider(context)

    votingProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );
  })

  it('Initialize Poll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "Vote for your preffered candidate",
      new anchor.BN(0),
      new anchor.BN(1734429239),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    );

    const poll = await votingProgram.account.votingdapp.fetch(pollAddress);

    console.log(poll);
    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
    expect(poll.candidateTotal.toNumber()).toEqual(0);
  })
})
