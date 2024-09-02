import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {Votingdapp} from "@/../anchor/target/types/votingdapp"
import { BN, Program } from "@coral-xyz/anchor";

const IDL = require("@/../anchor/target/idl/votingdapp.json")

export async function GET(request: Request) {
    const actionMetData: ActionGetResponse = {
        icon: "https://media.istockphoto.com/id/1040823912/vector/red-circle-ballot-box-icon.jpg?s=612x612&w=0&k=20&c=GuZnjiOcSA363lglNtS2H9DLgA6z0-yHRMZoesuBN_k=",
        title: "Presidency",
        description: "Vote for your preferred candidate",
        label: "Vote",
        links: {
            actions: [
            {
                label: "Vote for Trump",
                href: "/api/vote?candidate=Crunchy",
                type: "post"
            },
            {
                label: "Vote for Harris",
                href: "/api/vote?candidate=Smooth",
                type: "post"
            },
            ]
        }
    }
    return Response.json(actionMetData, { headers: ACTIONS_CORS_HEADERS});
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate")

    if (candidate != "trump" && candidate != "harris") {
        return new Response("Invalid candidate", { status: 400, headers: ACTIONS_CORS_HEADERS })
    }

    const connection = new Connection("http://127.0.0.1:8899", "confirmed")
    const program: Program<Votingdapp> = new Program(IDL, {connection})

    const body: ActionPostRequest = await request.json()
    let voter 
    try {
       voter = new PublicKey(body.account)
    } catch (error) {
        return new Response("Invalid account", {status: 400, headers: ACTIONS_CORS_HEADERS})
    }

    const instruction = program.methods.vote(candidate, new BN(1)).accounts({
        signer: voter,
    })
    .instruction();

    const blockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction({
        feePayer: voter,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add(instruction)

    const response = await createPostResponse({
        fields: {
            transaction: transaction,
            type: "transaction"
        }
    })

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS })
}
