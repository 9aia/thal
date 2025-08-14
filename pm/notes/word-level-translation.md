## **Feature Proposal: Word-level In-Chat Translation**

### **Context**

We already provide a **message-level translation feature**, which effectively translates entire bot responses for a user's full comprehension. However, this is not optimal for every situation. When a learner encounters a **single unfamiliar word or phrase**, using the message-level feature is inefficient. It forces them to translate an entire message to understand just one part, which feels clunky and can be distracting.

To address this, learners have a few non-ideal options. They could use the existing message-level translation feature, but this is a tedious process of translating the entire message just to find a single word. They might also interrupt the conversation by asking the AI character for a definition, which feels **out of character** and **breaks the conversational flow**. Or, they could leave the app to use an external tool, which breaks immersion entirely. This creates a critical learning gap where the most common vocabulary questions are the hardest to answer seamlessly.

### **Feature Overview: Interactive Word & Phrase Translation**

This feature **enhances the existing translation system** with a new, granular layer for **instant, in-context definition and translation**. By simply clicking on a word or a selected phrase in an AI character's message, a non-intrusive modal appears, providing immediate and granular learning tools.

This approach complements the existing message-level translation by offering a more targeted and fluid way for users to resolve micro-questions, ensuring the conversational flow and learning experience remain uninterrupted.

### **Key Behaviors**

1. **Word Click Event**
   * Every word in an AI-generated message becomes a discreetly clickable element.
   * Upon clicking, a small, elegant modal appears, presenting information about the selected word or phrase.
2. **Dictionary & Context Mode**
   * The modal serves as a mini-dictionary, providing several tools to understand the selected text:
     * **Instant Translation**: A quick, single-word translation to the user's native language.
     * **Word Definition**: A dictionary-style definition that explains the meaning of the selected word very succinctly.
     * **Synonyms & Antonyms**: Lists alternative words to enrich vocabulary and provide deeper contextual understanding.
     * **Pronunciation**: An audio button to hear the correct pronunciation of the selected word.
     * **Examples**: Generates on-demand additional example sentences to demonstrate the word's usage in different contexts.
3. **User Report Generation**
   * Each time a user interacts with this feature, the word and its details are logged.
   * This data is used to automatically generate a custom vocabulary list, which can then be used to create personalized chats, reports or presend-hints.

### **Why This Matters**

* **Closes a Critical Learning Gap**: It provides a perfect solution for the most common language learning pain point: not knowing a single word.
* **Maintains Flow & Immersion**: By offering an in-app, in-line solution, the user never has to leave the conversation or break character.
* **Empowers Organic Learning**: Learners acquire new vocabulary at the exact moment they need it, reinforcing retention through immediate, contextual use.
* **Enhances User Experience**: This smooth, intuitive interaction makes the app feel more responsive and intelligent, setting Thal apart as a proactive, modern learning tool.

### **Implementation Outline**

1. **Frontend UI**: Modify the chat message rendering to wrap each word in a \<span\> or similar element with an onClick handler. This allows each word to be a distinct, clickable target.
2. **Modal Component**: Develop a reusable modal component to display the translation results, including the original word, translation(s), and pronunciation button.
3. **API Integration**: Create a new API endpoint that accepts a word and/or sentence and returns its translation, synonyms, and other data from an integrated translation service. The API should be smart enough to handle user-specific target languages.
4. **State Management**: Implement a simple state management system to handle the visibility of the modal and the data it displays.
5. **Logging**: Log the clicked words and their translations in the user's data store for future use, such as for the personalized vocabulary list.

### **Impact on the User**

* **Before**: The user encounters a new word, gets confused, and has to manually seek a translation, potentially losing focus on the conversation.
* **After**: The user sees an unfamiliar word, clicks on it, gets an immediate, comprehensive translation in a sleek modal, and can continue their conversation seamlessly, having learned something new without any interruption.
