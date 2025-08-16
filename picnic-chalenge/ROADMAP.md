# 📋 Roadmap / Roteiro

> Todas as tarefas estão descritas em Português seguidas da tradução em Inglês.
> _All tasks are described in Portuguese followed by their English translation._

## 🎯 Objetivo / Goal

- Criar uma aplicação full-stack simples e escalável que categorize 50 tickets de suporte em categorias frequentes, permitindo ao gerente de suporte priorizar problemas para o time de engenharia.  
  _Build a simple yet scalable full-stack application that categorizes 50 support tickets into frequent categories, enabling the support manager to prioritise issues for the engineering team._

---

## ✅ Checklist Geral / Master Checklist

### 1. Planejamento & Organização / Planning & Organisation
- [x] Definir categorias iniciais e critérios de classificação.  
      _Define initial categories and classification criteria._

### 2. Back-End (API) / Back-End (API)
- [x] Criar/validar rota GET `/api/tickets` que lê `src/data/tickets.json` e retorna tickets categorizados.  
      _Create/validate GET `/api/tickets` route that reads `src/data/tickets.json` and returns categorised tickets._
- [x] Extrair lógica de categorização para módulo dedicado reutilizável.  
      _Extract categorisation logic into dedicated reusable module._
- [x] Garantir tratamento de erros e respostas HTTP consistentes.  
      _Ensure error handling and consistent HTTP responses._

### 3. Front-End (UI) / Front-End (UI)
- [x] Listar tickets em tabela responsiva com paginação.  
      _List tickets in a responsive table with pagination._
- [x] Implementar filtro por categoria (multi-select).  
      _Implement category filter (multi-select)._ 
- [x] Implementar busca textual por assunto, solicitante ou comentário.  
      _Implement text search by subject, requester or comment._
- [x] Exibir modal/detalhes ao clicar no ticket.  
      _Show modal/details when a ticket is clicked._
- [x] Manter UI minimalista usando componentes reutilizáveis (`ui/*`).  
      _Keep UI minimal using reusable components (`ui/*`)._ 

## 🔄 Próximos Passos Rápidos / Quick Next Steps
- [ ] Revisar JSON de tickets e validar campos necessários.  
      _Review ticket JSON and validate required fields._
- [ ] Ajustar função de categorização para cobrir palavras-chave faltantes.  
      _Adjust categorisation function to cover missing keywords._
---

> Marque as caixas conforme concluir as tarefas.  
> _Check the boxes as you complete the tasks._
