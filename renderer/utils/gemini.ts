export function getGemini(apiKey: string) {
  const generateContent = async (prompt: string) => {
    const input = clearLeadingSpaces(prompt);

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    const body = {
      contents: [
        {
          parts: [
            {
              text: input,
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

export function clearLeadingSpaces(prompt: string) {
  return prompt.replace(/^\s+/gm, "");
}

type Question = {
  type: "question",
  text: string;
  answers: string[],
  correctIndex: number,
}
type Narration = {
  type: "narration",
  text: string;
}
type Reply = {
  type: "reply",
  text: string;
}
type Quote = {
  type: "quote",
  text: string;
}
type StoryItems = Question | Narration | Quote | Reply;
type Story = {
  title: string;
  content: StoryItems[],
}
/*
title: "Bad Painting"
---

Oscar and his friend, Lucy, are sitting in the park.

Oscar is paiting lucy.

- Oscar: OK, you can look at the painting now! Do you like it?

Oscar shows Lucy the painting.

(Q) O oscar está mostrando a foto de um peixe à Lucy.

- [ ] Sim, isso mesmo.
- [x] Não, não é isso.

- Lucy: And, wry is my head so big?

> Oscar: I don't know. Ask your parents.

(Q) O Oscar disse à Lucy para...

- [x] ...perguntar aos pais por que a cabeça dela é grande.
- [ ] ...fazer um retrado dele.
- [ ] ...pintar o cabelo dela de azul.

- Lucy: My nose doesn't look like that.
- Oscar: Yes, it does! You have a nice nose.
- Lucy: Yes, I do have a ______

- [ ] do have
- [ ] I
- [ ] Yes
- [ ] a
- [x] nice nose

- Lucy: But it doesn't look nice in the painting.
- Oscar: Do you want the painting or not?
- Lucy: Sorry, but no, I don't want it.

A man stops and looks at the painting.

- John: That's really hood! Can I buy it for one hundred ____?

- [ ] paintings
- [ ] noses
- [x] dollars

Lucy takes thje painting.

- Lucy: It's my painting, and it's two hundred dollars.

(Q) Toque nos pares

- doláres - dollars
- você gosta dela - do you like it
- pega - take
- azul - blue
- pergunte - ask
*/

/*
title: "Bad Painting"
---

Oscar and his friend, Lucy, are sitting in the park.

Oscar is paiting lucy.

- Oscar: OK, you can look at the painting now! Do you like it?

Oscar shows Lucy the painting.

- Lucy: And, wry is my head so big?

- Oscar: I don't know. Ask your parents.

- Lucy: My nose doesn't look like that.
- Oscar: Yes, it does! You have a nice nose.
- Lucy: Yes, I do have a nice nose.

- Lucy: But it doesn't look nice in the painting.
- Oscar: Do you want the painting or not?
- Lucy: Sorry, but no, I don't want it.

A man stops and looks at the painting.

- John: That's really hood! Can I buy it for one hundred dollars?

Lucy takes thje painting.

- Lucy: It's my painting, and it's two hundred dollars.
*/

/* const story: Story = {
  "title": "Bad Painting",
  "content": [
    { "type": "quote", "text": "" },
    { "type": "question", "text": "O oscar está mostrando a foto de um peixe à Lucy.", "alternatives": [ "Sim, isso mesmo.", "Não, não é isso." ], correctIndex: 0 },

    { "quote": "And why is my head so big?" },
    { "quote": "I don't know. Ask your parents." },
    { "quote": "I don't know. Ask your parents." },
  ],
} */

