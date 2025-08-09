## **Feature Proposal: Vocabulary Hint Mode**

### **Context**

Our current error detection system works well for:

* **Grammar mistakes** (e.g., “I have 24 years old” instead of “I am 24 years old”)
* **Spelling errors** (e.g., “responsable” → “responsible”)
  These are marked with a **red wavy underline**, and clicking them opens the message analysis modal explaining the mistake and its correction.

However, this system does **not** address *false cognates* and other vocabulary pitfalls common for Brazilian learners of English.
Example:

* **"Parents"** in English → *mother and father*
* **"Parentes"** in Portuguese → *relatives* (different meaning)

These errors are *not grammatical or spelling mistakes* but can still cause significant misunderstandings.

---

### **Feature Overview: Vocabulary Hint Mode**

A **new detection and feedback mode** to highlight tricky vocabulary or expressions that:

* Are correct grammatically and in spelling
* But may be misunderstood due to cross-linguistic interference (false cognates, idioms, unusual usage)

**Key behavior:**

1. **Detection** – The model identifies parts with high potential for confusion (e.g., false cognates, cultural idioms).
2. **Highlighting** – Instead of red, these are **orange/yellow underlined** to indicate a “hint” rather than an error.
3. **User Interaction** – Clicking opens the message analysis modal in *Hint Mode*, explaining:

   * The meaning in English
   * How it differs from the false friend in Portuguese
   * Example sentences to reinforce understanding as usual
4. **Feedback Loop** – The user can confirm "Understood" or "Already knew" to signal comprehension, learning, and allowing adaptation over time.

---

### **Why This Matters**

* **Bridges a gap** in current detection: it goes beyond easily understood grammar/spelling from context to deeper semantic understanding due to much more complex cross-linguistic interference.
* **Mimics a private tutor** who proactively warns students about tricky words.
* **Increases retention** by pairing detection with immediate, contextual learning.
* **Adds value** to the product’s AI-powered language guidance, making it more personal and culturally aware.

---

### **Implementation Outline**

1. **Trigger Words List + Model Guidance**

   * Maintain a small, growing set of known false cognates/idiomatic pitfalls for Brazilian learners of English to provide as examples, improving the model accuracy.
   * Use the model to scan messages and mark these with XML/structured tags.
2. **Highlight Rendering**

   * Frontend renders **orange/yellow underline** for tagged words.
3. **Hint Modal**

   * Reuses existing message analysis modal UI, but with the problematic word highlighted in orange/yellow and the hint explanation.
4. **User Feedback**

   * "Understood" or "Already knew" button to record user understanding and avoid over-repetition or cluttering the UI.
5. **Progress Tracking**

   * Store user confirmations to personalize hint frequency and statistics.

---

### **Impact on the User**

* **Before**: Users only get notified of clear-cut grammar/spelling errors.
* **After**: Users also get gentle, contextual nudges for vocabulary that could mislead them, boosting both comprehension and confidence.
