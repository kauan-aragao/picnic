
## Visão geral de Classificação e Priorização

1. **Categorizar** os 50 tickets de suporte em grupos frequentes (`src/utils/categorize.ts`).  
   • O texto completo do ticket é normalizado (minúsculo, sem acentos, sem pontuação) e comparado a palavras-chave de cada categoria.  
   • A primeira correspondência define a categoria; caso contrário, recebe **other**.
2. **Priorizar** (`src/utils/priority.ts`): soma pontos para fatores como requester recorrente, data de criação,   ausência de resposta de agente, palavras de urgência etc.  
   • O score define níveis critical, high, medium, low.

### Limitações / Próximos passos

Este método baseado em keywords é simples, mas **não escala** bem: requer manutenção manual de listas e não entende contexto.  A solução ideal seria empregar um modelo de **IA** que aprenda padrões no texto e categorize automaticamente, reduzindo esforço humano e melhorando precisão conforme o volume de tickets cresce.
Como foram apenas 50 tickets no desafio, não utilizei IA nesta etapa. Porém, com uma base de tickets mais e até para maior precisão na classificação, seria interessante utilizar IA para essa classificação.
