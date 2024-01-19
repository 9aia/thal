import { computed } from "vue";

export function plural<N extends string, T extends string>(
  phrase: () => `${N} ${T}`
) {
  return computed(() => {
    const ph = phrase();
    const a = Number(ph.split(" ")[0]);
    const w = ph.split(" ")[1];

    const vowels = ["a", "e", "i", "o", "u"];
    const lastChar = w[w.length - 1];
    const secondLastChar = w[w.length - 2];
    const stressedVowelRegex = /[áéíóúâêîôûàèìòù]$/i;
    const stressedLastSyllable = stressedVowelRegex.test(w);

    const num = String(a) + " ";

    const endingInVowel = vowels.includes(lastChar);

    if (endingInVowel) {
      if (secondLastChar === "ã" && lastChar === "o") {
        return num + (a === 1 ? w : w.slice(0, -2) + "aẽs");
      }

      return num + (a === 1 ? w : w + "s");
    }

    if (lastChar === "m") {
      return num + (a === 1 ? w : w.slice(0, -1) + "ns");
    }

    if (lastChar === "l") {
      return num + (a === 1 ? w : w.slice(0, -1) + "is");
    }

    if (["n", "r", "z"].includes(lastChar)) {
      return num + (a === 1 ? w : w + "es");
    }

    if (lastChar === "s" && stressedLastSyllable) {
      return num + (a === 1 ? w : w + "es");
    }

    return num + (a === 1 ? w : w + "s");
  });
}
