import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"

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
