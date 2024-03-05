<script setup lang="ts">
import useLocale from '~/lib/psitta/vue/composables/useLocale'

const locale = useLocale()

definePageMeta({
  layout: 'center',
})
</script>

<template>
  <div>
    <template v-if="locale === 'pt'">
      <h1>Política de Privacidade</h1>
      <p>
        Esta Política de Privacidade explica como coletamos, usamos e divulgamos
        informações pessoais quando você utiliza o aplicativo Maratongue.
      </p>

      <h2>1. Informações que Coletamos</h2>
      <p>
        Ao criar uma conta no Maratongue, podemos coletar as seguintes informações
        pessoais:
      </p>
      <ul>
        <li>Nome (opcional)</li>
        <li>Sobrenome (opcional)</li>
        <li>Idade</li>
        <li>Gênero</li>
        <li>Pronomes</li>
        <li>Nome de usuário</li>
      </ul>
      <p>Além das informações pessoais, também podemos coletar:</p>
      <ul>
        <li>Data e horário do cadastro</li>
        <li>Profissão</li>
        <li>Hobbies/Esportes</li>
        <li>Metas de Aprendizado</li>
        <li>Observação Extra</li>
      </ul>

      <h2>2. Como Usamos Suas Informações</h2>
      <p>
        Coletamos informações pessoais para personalizar a experiência de
        aprendizado com o uso de inteligência artificial. Essas informações são
        fornecidas à IA para gerar conteúdo personalizado para uma experiência
        envolvente. Por padrão, não usamos seu nome e sobrenome para personalizar
        o conteúdo.
      </p>

      <h2>3. Divulgação de Suas Informações</h2>
      <p>
        Podemos divulgar suas informações pessoais a prestadores de serviços
        terceirizados que nos auxiliam na prestação e melhoria do aplicativo
        Maratongue. Não vendemos nem alugamos suas informações pessoais para
        terceiros.
      </p>

      <h2>4. Serviços de Terceiros</h2>
      <p>
        Nosso aplicativo utiliza a API Gemini para aprimorar a experiência de
        aprendizado e fornecer conteúdo personalizado. Ao usar a API Gemini,
        algumas informações pessoais podem ser compartilhadas com a Gemini.
        Recomendamos que você revise a
        <a
          href="https://support.google.com/gemini/answer/13594961?visit_id=638434421225288685-621180296&p=privacy_notice&rd=1#privacy_notice"
        >Política de Privacidade da Gemini</a>
        para entender como eles coletam, usam e divulgam suas informações.
      </p>

      <h2>5. Segurança</h2>
      <p>
        Tomamos medidas razoáveis para proteger suas informações pessoais contra
        acesso, uso ou divulgação não autorizados. No entanto, nenhum método de
        transmissão pela internet ou armazenamento eletrônico é 100% seguro.
      </p>

      <h2>6. Privacidade de Crianças</h2>
      <p>
        O Maratongue não é destinado a crianças menores de 13 anos. Não coletamos
        intencionalmente informações pessoais de crianças menores de 13 anos. Se
        você acredita que coletamos informações pessoais de uma criança menor de
        13 anos, entre em contato conosco imediatamente.
      </p>

      <h2>7. Alterações a esta Política de Privacidade</h2>
      <p>
        Reservamos o direito de atualizar ou alterar nossa Política de Privacidade
        a qualquer momento. Seu uso contínuo do aplicativo Maratongue após
        postarmos quaisquer modificações nesta página constituirá seu
        reconhecimento das modificações e seu consentimento em cumprir e ficar
        vinculado à Política de Privacidade modificada.
      </p>

      <hr class="border-gray-400 mb-4 mt-12">
      <p>
        Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em
        contato conosco em
        <a href="mailto:suporte@maratongue.com">suporte@maratongue.com</a>.
      </p>
    </template>
    <template v-else>
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy explains how we collect, use, and disclose personal
        information when you use the Maratongue application.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        When you create an account on Maratongue, we may collect the following
        personal information:
      </p>
      <ul>
        <li>Name (optional)</li>
        <li>Last Name (optional)</li>
        <li>Age</li>
        <li>Gender</li>
        <li>Pronouns</li>
        <li>Username</li>
      </ul>
      <p>In addition to personal information, we may also collect:</p>
      <ul>
        <li>Registration date and time</li>
        <li>Profession</li>
        <li>Hobbies/Sports</li>
        <li>Learning Goals</li>
        <li>Extra Observation</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We collect personal information to personalize the learning experience
        powered by AI. This information is provided to the AI to generate
        personalized content for an engaging experience. By default, we do not use
        your name and last name to personalize the content.
      </p>

      <h2>3. Disclosure of Your Information</h2>
      <p>
        We may disclose your personal information to third-party service providers
        who assist us in providing and improving the Maratongue application. We do
        not sell or rent your personal information to third parties.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        Our application utilizes the Gemini API to enhance the learning experience
        and provide personalized content. When using the Gemini API, certain
        personal information may be shared with Gemini. We encourage you to review
        <a
          href="https://support.google.com/gemini/answer/13594961?visit_id=638434421225288685-621180296&p=privacy_notice&rd=1#privacy_notice"
        >Gemini's Privacy Policy</a>
        to understand how they collect, use, and disclose your information.
      </p>

      <h2>5. Security</h2>
      <p>
        We take reasonable measures to protect your personal information from
        unauthorized access, use, or disclosure. However, no method of
        transmission over the internet or electronic storage is 100% secure.
      </p>

      <h2>6. Children's Privacy</h2>
      <p>
        Maratongue is not intended for children under the age of 13. We do not
        knowingly collect personal information from children under 13. If you
        believe that we have collected personal information from a child under 13,
        please contact us immediately.
      </p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>
        We reserve the right to update or change our Privacy Policy at any time.
        Your continued use of the Maratongue application after we post any
        modifications to the Privacy Policy on this page will constitute your
        acknowledgment of the modifications and your consent to abide and be bound
        by the modified Privacy Policy.
      </p>

      <hr class="border-gray-400 mb-4 mt-12">
      <p>
        If you have any questions about this Privacy Policy, please contact us at
        <a href="mailto:support@maratongue.com">support@maratongue.com</a>.
      </p>
    </template>
  </div>
</template>

<style scoped>
h1 {
  @apply text-4xl mb-4 font-bold;
}

h2 {
  @apply text-xl mt-6 mb-4 font-bold;
}

p {
  @apply text-base mb-4;
}

a {
  @apply text-teal-600 font-bold underline;
}

a:hover {
  @apply text-teal-700;
}

ul {
  @apply list-disc ml-6 mb-4;
}

ul li {
  @apply ml-4;
}
</style>
