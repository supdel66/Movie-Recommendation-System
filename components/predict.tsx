"use client"

import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

const Predict = () => {
  const [title, setTitle] = useState("")
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePredict = async () => {
    if (!title.trim()) {
      setError("Please enter a movie title")
      return
    }

    setIsLoading(true)
    setError(null)
    setRecommendations([])

    try {
      // Call our Next.js API route instead of the external API directly
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      const data = await response.json()

      if (response.ok) {
        // Check if data.data exists and is an array
        if (data.data && Array.isArray(data.data)) {
          setRecommendations(data.data)
        } else {
          setRecommendations([])
          setError("Invalid response format from server")
        }
      } else {
        setError(data.error || "Failed to fetch recommendations")
      }
    } catch (err) {
      console.error(err)
      setError("Unable to connect to the server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>🎬 Movie Recommendation</h1>
      <p>Enter a movie name to get similar recommendations</p>

      <div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Inception" />
        <button onClick={handlePredict} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 /> Loading...
            </>
          ) : (
            "Get Recommendations"
          )}
        </button>
      </div>

      {error && (
        <div>
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h2>Recommended Movies:</h2>
          <ul>
            {recommendations.map((movie, idx) => (
              <li key={idx}>{movie}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Predict
