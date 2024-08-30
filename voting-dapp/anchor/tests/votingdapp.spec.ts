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

  it("initialize candidate", async () => {
    await votingProgram.methods.initilizeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();
    
    await votingProgram.methods.initilizeCandidate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingAddress
    );
    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchyCandidate);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress
    );
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothCandidate);
    
    expect(crunchyCandidate.candidateName).toEqual("Crunchy");
    expect(crunchyCandidate.candidateVote.toNumber()).toEqual(0);
    expect(smoothCandidate.candidateName).toEqual("Smooth");
    expect(smoothCandidate.candidateVote.toNumber()).toEqual(0);
  })

  it("vote", async () => {
    await votingProgram.methods.vote("Smooth", new anchor.BN(1)).rpc()

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress,
    )
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    console.log(smoothAddress);
    expect(smoothCandidate.candidateVote.toNumber()).toEqual(1);
  })
})
