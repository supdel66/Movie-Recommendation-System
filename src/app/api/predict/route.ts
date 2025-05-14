import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const body = await request.json()
    const { title } = body

    if (!title) {
      return NextResponse.json({ error: "Movie title is required" }, { status: 400 })
    }

    // Make the request to your local Python API
    const response = await fetch("http://127.0.0.1:2000/predict", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || `Server responded with status ${response.status}` },
        { status: response.status },
      )
    }

    // Parse and return the successful response
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in predict API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
