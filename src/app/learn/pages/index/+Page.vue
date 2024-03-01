<script setup lang="ts">
import Btn from '#lib/daisy/components/action/Btn.vue'
import Modal from '#lib/daisy/components/action/Modal.vue'
import Icon from '#lib/daisy/components/display/Icon.vue'
import { useConfetti } from '#lib/daisy/composables/useConfetti'
import { t } from '#lib/i18n'
import A from '#lib/vike/components/A.vue'
import { ref, watch } from 'vue'

const isCorrectModalOpen = ref(false)
const isMapOpen = ref(false)
const confetti = useConfetti()
let confettiTimer: any

function answer() {
  isCorrectModalOpen.value = true

  confetti.make()

  confettiTimer = setTimeout(() => confetti.clear(), 3000)
}

function openMap() {
  isMapOpen.value = true
}

watch(isCorrectModalOpen, () => {
  if (confettiTimer)
    clearTimeout(confettiTimer)

  if (!isCorrectModalOpen.value) {
    confetti.clear()
    console.log('c')
  }
})
</script>

<template>
  <div class="grid grid-cols-7 h-screen">
    <div class="relative bg-base-100 flex flex-col col-span-2">
      <header class="flex justify-between p-4">
        <A href="/app/explore" class="flex items-center gap-1">
          <Icon>arrow_back</Icon>
          <span>Maratongue</span>
        </A>
        <div>
          <Btn class="btn-outline" @click="openMap">
            <Icon>view_timeline</Icon>
            Map
          </Btn>
        </div>
      </header>

      <aside class="h-full">
        <template v-if="isMapOpen">
          <div class="border-b border-gray-400 px-4 pb-4">
            <small class="uppercase font-bold text-gray-500 block mb-2">
              In Progress
            </small>

            <h2 class="text-xl font-bold">
              Plurals
            </h2>
          </div>
        </template>
        <template v-else>
          <div class="px-4 pb-4">
            <small class="uppercase font-bold text-gray-500 block mb-2">Workshop</small>

            <h1 class="text-teal-900 text-2xl mb-4 font-bold">
              Flip a Coin Again
            </h1>

            <progress class="progress progress-success" value="10" max="100" />

            <p class="text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur molestiae iure nostrum, eveniet nobis voluptatibus!
            </p>

            <h2 class="text-teal-900 text-sm font-bold uppercase mb-4 mt-4">
              Instructions
            </h2>

            <ul class="list list-disc ml-4 pl-8 mb-4">
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, asperiores?</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing.</li>
            </ul>

            <div>
              <Btn class="">
                <Icon>lightbulb</Icon>
                Hint
              </Btn>
            </div>
          </div>
        </template>
      </aside>

      <footer class="self-end w-full flex gap-4 p-4 border-t border-gray-500">
        <A href="https://forms.gle/5ePvXjrebyWGUrM26" :localize="false" class="flex items-center gap-1 link link-warning">
          Give us feedback
        </A>
        <A href="https://forms.gle/ANMv7qnwTHva1k7L8" :localize="false" class="flex items-center gap-1 link link-warning">
          Report a issue
        </A>
      </footer>
    </div>

    <div class="col-span-3 flex flex-col bg-white">
      <header class="flex justify-between p-2 px-4 border-b border-gray-300">
        <A href="/app/explore" class="flex items-center gap-1">
          <Icon>directions_run</Icon>
        </A>
        <div>
          <Btn class="btn-ghost p-0">
            <Icon>more_vert</Icon>
          </Btn>
        </div>
      </header>

      <main class="p-4 h-full flex items-center justify-center">
        <h1>Maratongue</h1>
      </main>

      <div class="border-t border-gray-300">
        <div class="flex justify-between p-4 border-b border-gray-500">
          <Btn class="btn-primary" @click="answer">
            Answer
          </Btn>
        </div>
        <div class="bg-white h-40">
          <div class="border-b border-gray-400 p-4">
            <h3 class="text-gray-700 text-sm font-bold uppercase">
              Your keys
            </h3>
          </div>

          <div class="flex gap-2 flex-wrap p-4">
            <div v-for="(item, i) in ['My', 'John', 'name', 'is']" :key="i" class="bg-purple-500/50 text-purple-900 cursor-pointer font-bold border-purple-900 border-b-2 h-fit rounded-t-md py-0 px-4">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-teal-900/10 col-span-2 flex flex-col h-screen">
      <section class="px-8 py-4 h-1/2 overflow-auto">
        <h2 class="text-teal-900 font-bold text-sm uppercase mb-4">
          {{ t("Example Translation") }}
        </h2>

        <p class="text-gray-600">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id exercitationem adipisci accusamus minima, alias amet in ipsum? Ratione, voluptatum? Unde iusto ipsa cum recusandae accusantium saepe enim, ut dolorem fuga?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima minus officiis tempore aliquam reprehenderit hic, modi nemo cum. Possimus et, similique ipsum odit iste itaque sequi aspernatur deserunt, magnam dolorum ullam quisquam fuga magni omnis officia libero numquam soluta officiis autem architecto! Provident voluptatibus ea quia nobis eligendi itaque quas quaerat! Aperiam nemo cumque ducimus laudantium magni blanditiis magnam cupiditate, harum consequuntur expedita nulla, rem minus delectus ipsam, itaque earum iure suscipit! Molestiae optio officiis exercitationem enim quas tenetur magni temporibus obcaecati. Dolorum quis adipisci, ex velit molestias repellat amet harum quos, tenetur illum quasi nulla vel libero cum debitis praesentium temporibus cumque assumenda nesciunt? Vitae, animi officia iste aperiam distinctio soluta error est! Magni ex iure necessitatibus, maxime error mollitia vel? Dolorem ipsam non necessitatibus nobis quibusdam delectus eaque! Rerum laboriosam perspiciatis quaerat deleniti dolor. Ipsam expedita beatae, perspiciatis tenetur doloremque vitae et aspernatur optio repellat laudantium, enim voluptates, sint accusamus cupiditate. Dolorem molestias veniam fugit eligendi autem, non qui, voluptatem accusamus eaque nam optio commodi officiis tenetur debitis, sunt sequi. Deserunt excepturi sequi incidunt distinctio modi nesciunt minima laboriosam, nisi optio nam beatae illum doloribus! Labore, nihil. Cumque dignissimos aut ex doloribus officiis dicta facere harum inventore illo?
        </p>
      </section>

      <section class="px-8 py-4 h-1/2 border-t border-teal-600 overflow-auto">
        <h2 class="text-teal-900 font-bold text-sm uppercase mb-4">
          {{ t("Your Translation") }}
        </h2>

        <p class="text-gray-600">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id exercitationem adipisci accusamus minima, alias amet in ipsum? Ratione, voluptatum? Unde iusto ipsa cum recusandae accusantium saepe enim, ut dolorem fuga?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem ipsum officiis voluptas, doloribus eveniet accusamus quidem esse! Mollitia provident, dicta quam pariatur a voluptate quod ipsam voluptatibus dolores vero facilis earum laudantium harum, minus culpa doloremque unde? Hic dolor saepe tenetur aut fugiat voluptas numquam exercitationem porro nostrum minima commodi quam provident quos ullam pariatur officiis est, iste dolores consequatur. Soluta, debitis saepe placeat, voluptatem aliquam minima ullam, corrupti officiis doloribus quo nobis nam quaerat. Exercitationem nostrum provident eius repellendus ab libero recusandae voluptas reprehenderit quo, maiores soluta, esse atque praesentium voluptatum molestias et consequatur asperiores neque, error facilis doloremque.
        </p>
      </section>
    </div>

    <Modal v-model="isCorrectModalOpen" :confirm-text="t('Continue')">
      <h1 class="text-center text-xl font-bold mb-4">
        Correct!
      </h1>

      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto, voluptates!</p>
    </Modal>
  </div>
</template>
