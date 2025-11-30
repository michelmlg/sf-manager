<template>
  <section class="container py-12 animate-fade-in">
    <h2 class="text-3xl font-heading font-bold text-ong-text mb-8">Nossa História</h2>

    <div class="space-y-4 text-lg leading-relaxed">
      <p>
        A ONG São Francisco nasceu da paixão e do compromisso de um grupo de protetores independentes que, por muito tempo,
        dedicaram-se ao resgate de cães e outros animais em situação de rua. Entre eles, destacam-se <strong>Silmara</strong> e <strong>Mariane</strong>.
        Após acumularem valiosa experiência trabalhando para outras ONGs, elas sentiram a necessidade de criar a própria organização
        para implementar seus métodos e visão de cuidado animal de forma integral.
      </p>

      <p>
        Somos uma entidade completamente independente, sem nenhum vínculo com instituições governamentais.
        Nossa manutenção e o bem-estar dos nossos animais são garantidos graças ao apoio fundamental de parceiros como
        <a href="https://www.petz.com.br" target="_blank" class="text-ong-primary underline hover:text-ong-accent">Petz</a>,
        Kahu e diversos veterinários locais, que nos fornecem desde medicamentos essenciais até rações de qualidade.
        Essa rede de solidariedade nos permite continuar nossa missão de transformar vidas.
      </p>
    </div>

    <!-- Imagem ilustrativa -->
    <div class="mt-10 w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg">
      <img
        src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=80"
        alt="Cachorro resgatado"
        class="w-full h-64 sm:h-96 object-cover"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHead } from '@vueuse/head'

useHead({
  title: "Nossa História — ONG São Francisco",
  meta: [
    {
      name: "description",
      content:
        "Conheça a história da ONG São Francisco, fundada por protetores independentes dedicados ao resgate, cuidado e proteção de animais em situação de rua."
    },
    { name: "robots", content: "index,follow" },

    // Open Graph
    { property: "og:title", content: "Nossa História — ONG São Francisco" },
    {
      property: "og:description",
      content:
        "A trajetória da ONG São Francisco: como nasceu, quem fundou e como se tornou uma referência no cuidado e resgate de animais."
    },
    { property: "og:type", content: "article" },
    {
      property: "og:url",
      content: "https://ongsfrancisco.com.br/nossa-historia"
    },
    {
      property: "og:image",
      content: "https://ongsfrancisco.com.br/default-historia.jpg"
    },

  ],
  link: [
    {
      rel: "canonical",
      href: "https://ongsfrancisco.com.br/nossa-historia"
    }
  ]
})

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

</script>
