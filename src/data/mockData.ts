import { PostIt } from '@/types/mural';

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();

function d(day: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const ts = now.toISOString();

export const mockPostIts: PostIt[] = [
  { id: '1', title: 'Solicitar demandas do mês', body: 'Encaminhar ofício para todas as secretarias solicitando demandas de contratação.', color: 'yellow', status: 'doing', type: 'process', secretaria: 'Administração', tags: ['urgente', 'ofício'], start_date: d(3), created_by: 'user-1', created_at: ts, updated_at: ts },
  { id: '2', title: 'ETP - Serviços de TI', body: 'Elaborar estudo técnico preliminar.', color: 'blue', status: 'idea', type: 'process', secretaria: 'Tecnologia', tags: ['ETP', 'TI'], start_date: d(5), created_by: 'user-2', created_at: ts, updated_at: ts },
  { id: '3', title: 'TR - Material de escritório', body: 'Revisar termo de referência para aquisição.', color: 'orange', status: 'doing', type: 'process', secretaria: 'Administração', tags: ['TR'], start_date: d(5), created_by: 'user-1', created_at: ts, updated_at: ts },
  { id: '4', title: 'Pesquisa de preços - Mobiliário', body: 'Coletar 3 orçamentos de fornecedores.', color: 'pink', status: 'idea', type: 'process', secretaria: 'Infraestrutura', tags: ['pesquisa'], start_date: d(7), created_by: 'user-3', created_at: ts, updated_at: ts },
  { id: '5', title: 'Reunião de alinhamento', body: 'Definir prioridades de contratação do trimestre.', color: 'green', status: 'done', type: 'event', secretaria: 'Planejamento', tags: ['reunião'], start_date: d(2), created_by: 'user-1', created_at: ts, updated_at: ts },
  { id: '6', title: 'Publicar edital - Limpeza', body: 'Publicar edital no PNCP e Diário Oficial.', color: 'green', status: 'doing', type: 'event', tags: ['PNCP', 'publicação'], start_date: d(10), created_by: 'user-2', created_at: ts, updated_at: ts },
  { id: '7', title: 'Parecer jurídico - Veículos', body: 'Aguardando análise da procuradoria.', color: 'pink', status: 'idea', type: 'process', secretaria: 'Jurídico', tags: ['parecer'], start_date: d(10), created_by: 'user-3', created_at: ts, updated_at: ts },
  { id: '8', title: 'DFD - Equipamentos lab', body: 'Formalizar demanda para equipamentos de laboratório.', color: 'yellow', status: 'doing', type: 'process', secretaria: 'Saúde', tags: ['DFD'], start_date: d(12), created_by: 'user-1', created_at: ts, updated_at: ts },
  { id: '9', title: 'Sessão pública - Pregão 15/2026', body: 'Sessão de lances e habilitação.', color: 'green', status: 'idea', type: 'event', tags: ['pregão', 'sessão'], start_date: d(15), created_by: 'user-2', created_at: ts, updated_at: ts },
  { id: '10', title: 'Homologação - Manutenção predial', body: 'Homologar resultado e adjudicar.', color: 'blue', status: 'idea', type: 'process', secretaria: 'Infraestrutura', tags: ['homologação'], start_date: d(15), created_by: 'user-3', created_at: ts, updated_at: ts },
  { id: '11', title: 'Contrato - Segurança patrimonial', body: 'Elaborar minuta contratual.', color: 'orange', status: 'doing', type: 'process', tags: ['contrato'], start_date: d(17), created_by: 'user-1', created_at: ts, updated_at: ts },
  { id: '12', title: 'ARP - Combustíveis', body: 'Adesão à ata de registro de preços vigente.', color: 'yellow', status: 'done', type: 'process', secretaria: 'Transporte', tags: ['ARP'], start_date: d(8), created_by: 'user-2', created_at: ts, updated_at: ts },
  { id: '13', title: 'Nota: Prazo PNCP', body: 'Lembrar: publicações devem ser feitas com 8 dias de antecedência.', color: 'pink', status: 'idea', type: 'note', tags: ['lembrete'], start_date: d(20), created_by: 'user-1', created_at: ts, updated_at: ts },
  { id: '14', title: 'ETP - Merenda escolar', body: 'Estudo técnico para aquisição de gêneros alimentícios.', color: 'blue', status: 'doing', type: 'process', secretaria: 'Educação', tags: ['ETP', 'merenda'], start_date: d(20), created_by: 'user-3', created_at: ts, updated_at: ts },
  { id: '15', title: 'TR - Serviços gráficos', body: 'Especificações para impressão de material institucional.', color: 'orange', status: 'idea', type: 'process', secretaria: 'Comunicação', tags: ['TR'], start_date: d(22), created_by: 'user-1', created_at: ts, updated_at: ts },
  { id: '16', title: 'Abertura de licitação - Software', body: 'Iniciar processo licitatório para sistema ERP.', color: 'yellow', status: 'idea', type: 'event', secretaria: 'Tecnologia', tags: ['licitação', 'ERP'], start_date: d(24), created_by: 'user-2', created_at: ts, updated_at: ts },
  { id: '17', title: 'Revisão de atas', body: 'Revisar atas de reuniões do comitê de contratações.', color: 'pink', status: 'done', type: 'note', tags: ['ata'], start_date: d(18), created_by: 'user-3', created_at: ts, updated_at: ts },
  { id: '18', title: 'Pesquisa de preços - Uniformes', body: 'Cotar uniformes para guarda municipal.', color: 'green', status: 'doing', type: 'process', secretaria: 'Segurança', tags: ['pesquisa', 'uniformes'], start_date: d(25), created_by: 'user-1', created_at: ts, updated_at: ts },
  { id: '19', title: 'Nota: Capacitação equipe', body: 'Agendar treinamento sobre nova lei de licitações.', color: 'yellow', status: 'idea', type: 'note', tags: ['capacitação'], start_date: d(27), created_by: 'user-2', created_at: ts, updated_at: ts },
  { id: '20', title: 'Consolidar relatório mensal', body: 'Reunir dados de todas as contratações do mês para relatório à gestão.', color: 'blue', status: 'idea', type: 'process', secretaria: 'Planejamento', tags: ['relatório'], start_date: d(28), created_by: 'user-1', created_at: ts, updated_at: ts },
];
