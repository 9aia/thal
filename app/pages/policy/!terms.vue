<script setup lang="ts">
import { useLocale } from '@psitta/vue'

const locale = useLocale()

definePageMeta({
  layout: 'site',
})
</script>

<template>
  <div>
    <template v-if="locale === 'pt'">
      <h1>Termos de Serviço</h1>
      <p>
        Estes Termos de Serviço delineiam as regras para o uso
        do nosso aplicativo.
      </p>

      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao acessar ou usar o Thal, você concorda em cumprir estes Termos de
        Serviço. Se você não concordar com qualquer parte destes termos, você não
        poderá acessar o aplicativo.
      </p>

      <h2>2. Uso do Aplicativo</h2>
      <p>
        Nosso aplicativo fornece recursos e ferramentas para aprender inglês. Você
        pode usar o aplicativo apenas para fins pessoais ou educacionais. É
        proibido usar o aplicativo para qualquer finalidade ilegal ou não
        autorizada.
      </p>

      <h2>3. Contas de Usuário</h2>
      <p>
        Para acessar determinados recursos do Thal, você deve criar uma conta. Ao criar uma conta, você concorda
        em:
      </p>
      <ul>
        <li>
          <strong>Confidencialidade:</strong> Você é responsável por manter a confidencialidade de sua conta e senha.
          Não compartilhe suas credenciais de login com outras pessoas e tome as medidas adequadas para impedir o acesso
          não autorizado à sua conta.
        </li>
        <li>
          <strong>Exclusão de conta:</strong> Você tem o direito de excluir sua conta Thal e informações pessoais
          associadas. Para iniciar o processo de exclusão da conta, siga as instruções fornecidas nas <a
            href="/settings/account"
          >configurações do aplicativo</a>.
        </li>
        <li>
          <strong>Precisão dos dados:</strong> Você é responsável por manter seus dados pessoais atualizados e precisos.
          Certifique-se de que as informações da sua conta permaneçam atualizadas e reflitam sua verdadeira identidade.
        </li>
      </ul>
      <p>
        Ao usar o Thal, você concorda em aceitar a responsabilidade por todas as atividades que ocorrem em sua
        conta.
      </p>

      <h2>4. Conteúdo</h2>
      <p>
        O conteúdo fornecido no aplicativo, incluindo, mas não se limitando a
        texto, imagens, vídeos e áudio, é apenas para fins educacionais. Não
        garantimos a precisão, integridade ou utilidade de nenhum conteúdo. Você
        usa o conteúdo por sua própria conta e risco.
      </p>

      <h2>5. Propriedade Intelectual</h2>
      <p>
        Todo o conteúdo do aplicativo, incluindo, entre outros, texto, imagens e
        materiais audiovisuais, está disponível gratuitamente para uso, distribuição, modificação e
        reprodução.
      </p>

      <h2>6. Privacidade</h2>
      <p>
        Sua privacidade é importante para nós. Por favor, reveja nossa
        <A href="/privacy">Política de Privacidade</A>, que explica como
        coletamos, usamos e divulgamos informações sobre você quando você usa o
        aplicativo.
      </p>

      <h2>7. Termos de Terceiros</h2>
      <p>
        Nosso aplicativo utiliza a API do Gemini para aprimorar a experiência de aprendizado
        e fornecer conteúdo personalizado. Ao usar a API do Gemini, você concorda em
        cumprir os Termos de Serviço do Gemini, além da nossa Política de Privacidade.
      </p>
      <p>
        Recomendamos que você revise os
        <A
          href="https://support.google.com/gemini/answer/13594961?visit_id=638434421225288685-621180296&p=privacy_notice&rd=1#tos"
        >Termos
          de Serviço da Gemini</A>
        para entender seus direitos e obrigações ao usar a API do Gemini.
      </p>

      <h2>8. Rescisão</h2>
      <p>
        Reservamos o direito de rescindir ou suspender seu acesso ao aplicativo a qualquer
        momento, sem aviso prévio ou responsabilidade, por qualquer motivo, inclusive, sem
        limitação, se você violar estes Termos de Serviço.
      </p>

      <h2>9. Alterações nos Termos</h2>
      <p>
        Reservamos o direito de modificar ou substituir estes Termos de Serviço a qualquer
        momento. Seu uso contínuo do aplicativo após quaisquer alterações constitui sua
        aceitação dos novos termos.
      </p>

      <hr class="border-base-200 mb-4 mt-12">
      <p>
        Se você tiver alguma dúvida sobre estes Termos de Serviço, entre em
        contato conosco em
        <a href="mailto:suporte@thal.app">suporte@thal.app</a>.
      </p>
    </template>
    <template v-else>
      <h1>Terms of Service</h1>
      <p>
        These Terms of Service outline the rules for the use of
        our application.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the Thal, you agree to comply with these Terms
        of Service. If you do not agree with any part of these terms, you may not
        access the application.
      </p>

      <h2>2. Use of the App</h2>
      <p>
        Our application provides resources and tools for learning English. You may
        use the app for personal or educational purposes only. You are prohibited
        from using the app for any illegal or unauthorized purpose.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        To access certain features of Thal, you must create an account. By creating an account, you agree to:
      </p>
      <ul>
        <li>
          <strong>Confidentiality:</strong> You are responsible for maintaining the confidentiality of your account and
          password. Do not share your login credentials with others, and take appropriate measures to prevent
          unauthorized access to your account.
        </li>
        <li>
          <strong>Account Deletion:</strong> You have the right to delete your Thal account and associated
          personal information. To initiate the account deletion process, please follow the instructions provided in the
          <a href="/settings/account">app settings</a>.
        </li>
        <li>
          <strong>Data Accuracy:</strong> You are responsible for keeping your personal data up to date and accurate.
          Please ensure that the information in your account remains current and reflects your true identity.
        </li>
      </ul>
      <p>
        By using Thal, you agree to accept responsibility for all activities that occur under your account.
      </p>

      <h2>4. Content</h2>
      <p>
        The content provided in the app, including but not limited to text,
        images, videos, and audio, is for educational purposes only. We do not
        guarantee the accuracy, completeness, or usefulness of any content. You
        use the content at your own risk.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content within the app, including but not limited to text, images, and
        audiovisual materials, are freely available for use, distribution, modification, and
        reproduction.
      </p>

      <h2>6. Privacy</h2>
      <p>
        Your privacy is important to us. Please review our
        <A href="/privacy">Privacy Policy</A>, which explains how we collect, use,
        and disclose information about you when you use the app.
      </p>

      <h2>7. Third-Party Terms</h2>
      <p>
        Our application utilizes the Gemini API to enhance the learning experience
        and provide personalized content. When using the Gemini API, you agree to
        abide by Gemini's Terms of Service in addition to our Privacy Policy.
      </p>
      <p>
        We encourage you to review
        <a
          href="https://support.google.com/gemini/answer/13594961?visit_id=638434421225288685-621180296&p=privacy_notice&rd=1#tos"
        >Gemini's
          Terms of Service</a>
        to understand your rights and obligations when using the Gemini API.
      </p>

      <h2>8. Termination</h2>
      <p>
        We reserve the right to terminate or suspend your access to the app at any
        time, without prior notice or liability, for any reason whatsoever,
        including without limitation if you breach these Terms of Service.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We reserve the right to modify or replace these Terms of Service at any
        time. Your continued use of the app after any such changes constitutes
        your acceptance of the new terms.
      </p>

      <hr class="border-base-200 mb-4 mt-12">
      <p>
        If you have any questions about these Terms of Service, please contact us
        at
        <a href="mailto:support@thal.app">support@thal.app</a>.
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
