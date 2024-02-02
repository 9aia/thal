export function mergeTranslations(requestTranslations, currentTranslations) {
  const mergedTranslations = { ...currentTranslations };

  Object.keys(requestTranslations).forEach((text) => {
    const translations = requestTranslations[text];

    Object.keys(translations).forEach((locale) => {
      if (!mergedTranslations[text]) {
        mergedTranslations[text] = {};
      }

      if (requestTranslations[text][locale] !== "") {
        mergedTranslations[text][locale] = requestTranslations[text][locale];
      } else {
        console.log("skipping", text);
      }
    });
  });

  console.log(mergedTranslations);

  return mergedTranslations;
}
