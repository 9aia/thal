<script setup lang="ts">
import Modal from "#lib/daisy/components/action/Modal.vue";
import Timeline from "#lib/daisy/components/display/Timeline.vue";
import { TimelineItem } from "#lib/daisy/components/display/types";
import { t } from "#lib/i18n";

const course = {
  name: "English Grammar",
  description:
    "English grammar is a set of rules that govern the composition and structure of the English language. It helps us to speak, read and write English language properly.",
  sections: [
    {
      name: "Nouns",
      nodes: [
        {
          name: "Proper nouns",
          icon: "person",
        },
        {
          name: "Common nouns",
          icon: "person",
        },
        {
          name: "Possessive nouns",
          icon: "person",
        },
        {
          name: "Collective nouns",
          icon: "person",
        },
        {
          name: "Abstract nouns",
          icon: "person",
        },
        {
          name: "Compound nouns",
          icon: "person",
        },
        {
          name: "Countable nouns",
          icon: "person",
        },
        {
          name: "Uncountable nouns",
          icon: "person",
        },
        {
          name: "Material nouns",
          icon: "person",
        },
      ],
    },
    {
      name: "Pronouns",
      nodes: [
        {
          name: "Reflexive pronouns",
          icon: "person",
        },
        {
          name: "Relative pronouns",
          icon: "person",
        },
        {
          name: "Demonstrative pronouns",
          icon: "person",
        },
        {
          name: "Possessive pronouns",
          icon: "person",
        },
        {
          name: "Indefinite pronouns",
          icon: "person",
        },
        {
          name: "Personal pronouns",
          icon: "person",
        },
        {
          name: "Interrogative pronouns",
          icon: "person",
        },
        {
          name: "Reciprocal pronouns",
          icon: "person",
        },
      ],
    },
    {
      name: "Verbs",
      nodes: [
        {
          name: "Verb forms",
          icon: "person",
        },
        {
          name: "Main verbs",
          icon: "person",
        },
        {
          name: "Helping verbs",
          icon: "person",
        },
        {
          name: "Auxiliary verbs",
          icon: "person",
        },
        {
          name: "Irregular verbs",
          icon: "person",
        },
        {
          name: "Modal verbs",
          icon: "person",
        },
        {
          name: "Gerunds",
          icon: "person",
        },
      ],
    },
    {
      name: "Adjectives",
      nodes: [
        {
          name: "Proper adjectives",
          icon: "person",
        },
        {
          name: "Possessive adjectives",
          icon: "person",
        },
        {
          name: "Interrogative adjectives",
          icon: "person",
        },
      ],
    },
    {
      name: "Adverbs",
      nodes: [
        {
          name: "Conjunctive adverbs",
          icon: "person",
        },
        {
          name: "Adverbs of time",
          icon: "person",
        },
        {
          name: "Adverbs of frequency",
          icon: "person",
        },
        {
          name: "Adverbs of place",
          icon: "person",
        },
        {
          name: "Adverbs of degree",
          icon: "person",
        },
        {
          name: "Adverbs of manner",
          icon: "person",
        },
      ],
    },
    {
      name: "Determiners",
      nodes: [
        {
          name: "Articles",
          icon: "person",
        },
        {
          name: "Numerals",
          icon: "person",
        },
        {
          name: "Quantifiers",
          icon: "person",
        },
        {
          name: "Demonstratives",
          icon: "person",
        },
      ],
    },
    {
      name: "Conjunctions",
      nodes: [
        {
          name: "Conjunctions",
          icon: "person",
        },
        {
          name: "Subordinating conjunctions",
          icon: "person",
        },
      ],
    },
    {
      name: "Prepositions",
      nodes: [
        {
          name: "Prepositions",
          icon: "person",
        },
      ],
    },
    {
      name: "Interjections",
      nodes: [
        {
          name: "Interjections",
          icon: "person",
        },
      ],
    },
  ],
};

type Course = typeof course;
type Node = Course['sections'][number]["nodes"][number];

const getTimelineItems = (nodes: Node[], i = 0) => {
  return nodes.map<TimelineItem>((node, j) => {
    const isEven = Boolean(j % 2);

    return {
      id: String(j),
      name: node.name,
      icon: "check",
      position: !isEven ? "start" : "end",
      active: j < i,
    };
  });
};
</script>

<template>
  <div class="max-w-lg mx-auto mb-6 px-4 mt-6">
    <h2 class="text-2xl mb-1">{{ t(course.name) }}</h2>

    <p class="text-base text-gray-700 mb-4">
      {{ t(course.description) }}
    </p>
  </div>

  <section v-for="section in course.sections">
    <h3 class="font-bold bg-white py-2 mb-4 mt-4">
      <span class="block max-w-lg mx-auto px-4">{{ t(section.name) }}</span>
    </h3>

    <Modal>
      <h1>{{ t("Nouns") }}</h1>
      <p>{{ t("Nouns are names to things, places or ideas.") }}</p>
    </Modal>

    <Timeline :items="getTimelineItems(section.nodes)" />
  </section>
</template>
