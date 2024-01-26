export function getGemini(apiKey: string) {
  const generateContent = async (prompt: string) => {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error generating content:: ${error}`);
    }
  };

  return {
    generateContent,
  };
}
