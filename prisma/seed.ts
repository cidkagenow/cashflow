import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean all tables
  await prisma.user.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.automationRule.deleteMany()
  await prisma.automationTemplate.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.document.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.deliverable.deleteMany()
  await prisma.project.deleteMany()
  await prisma.analyst.deleteMany()
  await prisma.client.deleteMany()

  // ─── Users ────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'admin@payflow.com',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Admin PayFlow',
      role: 'admin',
    },
  })
  await prisma.user.create({
    data: {
      email: 'maria@iassat.com',
      password: bcrypt.hashSync('maria123', 10),
      name: 'María López',
      role: 'analyst',
    },
  })

  // ─── Analysts ─────────────────────────────────────────────────────
  const maria = await prisma.analyst.create({ data: { id: 'analyst-1', name: 'María López', initials: 'ML', email: 'maria@iassat.com' } })
  const carlos = await prisma.analyst.create({ data: { id: 'analyst-2', name: 'Carlos Ruiz', initials: 'CR', email: 'carlos@iassat.com' } })
  const ana = await prisma.analyst.create({ data: { id: 'analyst-3', name: 'Ana González', initials: 'AG', email: 'ana@iassat.com' } })
  const juan = await prisma.analyst.create({ data: { id: 'analyst-4', name: 'Juan Pérez', initials: 'JP', email: 'juan@iassat.com' } })
  const laura = await prisma.analyst.create({ data: { id: 'analyst-5', name: 'Laura Martín', initials: 'LM', email: 'laura@iassat.com' } })

  // ─── Clients ──────────────────────────────────────────────────────
  const techcorp = await prisma.client.create({ data: { id: 'client-1', name: 'TechCorp Solutions', contact: 'Roberto Méndez', email: 'roberto@techcorp.com' } })
  const finserv = await prisma.client.create({ data: { id: 'client-2', name: 'FinServ International', contact: 'Carolina Vega', email: 'carolina@finserv.com' } })
  const retailcorp = await prisma.client.create({ data: { id: 'client-3', name: 'RetailCorp', contact: 'Pedro Salinas', email: 'pedro@retailcorp.com' } })
  const grupoXyz = await prisma.client.create({ data: { id: 'client-4', name: 'Grupo Industrial XYZ', contact: 'Fernando Torres', email: 'fernando@grupoxyz.com' } })
  const cadenaAbc = await prisma.client.create({ data: { id: 'client-5', name: 'Cadena Retail ABC', contact: 'Lucía Ramos', email: 'lucia@cadenaabc.com' } })
  const consumo = await prisma.client.create({ data: { id: 'client-6', name: 'Compañía de Consumo Masivo', contact: 'Miguel Ángel', email: 'miguel@consumo.com' } })
  const bancoSur = await prisma.client.create({ data: { id: 'client-7', name: 'Banco Regional Sur', contact: 'Sandra López', email: 'sandra@bancosur.com' } })
  const crmClient = await prisma.client.create({ data: { id: 'client-8', name: 'Empresa CRM Corp', contact: 'Diego Fernández', email: 'diego@crmcorp.com' } })
  const identidad = await prisma.client.create({ data: { id: 'client-9', name: 'Corporación Identidad', contact: 'Valeria Ruiz', email: 'valeria@identidad.com' } })
  const manufactura = await prisma.client.create({ data: { id: 'client-10', name: 'Manufactura Global', contact: 'Andrés Castillo', email: 'andres@manufactura.com' } })
  const talento = await prisma.client.create({ data: { id: 'client-11', name: 'Gestión Talento SA', contact: 'Patricia Moreno', email: 'patricia@talento.com' } })
  const portalB2B = await prisma.client.create({ data: { id: 'client-12', name: 'Portal B2B Solutions', contact: 'Raúl Jiménez', email: 'raul@portalb2b.com' } })

  // ─── Project 1: TechCorp (EnCurso, with deliverables) ─────────────
  const proj1 = await prisma.project.create({
    data: { id: 'proj-1', name: 'Transformación Digital - Fase 1', service: 'Consultoría Tecnológica', totalAmount: 450000, paidAmount: 225000, currency: 'USD', status: 'EnCurso', clientId: techcorp.id },
  })
  // Deliverables for proj1
  const del1 = await prisma.deliverable.create({ data: { id: 'del-1', name: 'Informe de Discovery', technicalStatus: 'Aprobado', projectId: proj1.id, responsibleId: maria.id } })
  const del2 = await prisma.deliverable.create({ data: { id: 'del-2', name: 'Documento de Arquitectura', technicalStatus: 'Aprobado', projectId: proj1.id, responsibleId: maria.id } })
  const del3 = await prisma.deliverable.create({ data: { id: 'del-3', name: 'MVP Funcional', technicalStatus: 'EnCurso', projectId: proj1.id, responsibleId: carlos.id } })
  const del4 = await prisma.deliverable.create({ data: { id: 'del-4', name: 'Plan de Testing', technicalStatus: 'Pendiente', projectId: proj1.id, responsibleId: ana.id } })

  // Milestones for proj1 — showing multiple financial states
  await prisma.milestone.create({ data: { id: 'ms-1', name: 'Discovery y Análisis', amount: 112500, financialStatus: 'Conciliado', activationType: 'entregable', daysActive: 45, paidAmount: 112500, pendingAmount: 0, projectId: proj1.id, analystId: maria.id, deliverableId: del1.id, activatedAt: new Date('2024-01-10'), lastAction: 'Pago conciliado', lastActionDate: new Date('2024-01-25') } })
  await prisma.milestone.create({ data: { id: 'ms-2', name: 'Arquitectura Técnica', amount: 112500, financialStatus: 'Conciliado', activationType: 'entregable', daysActive: 38, paidAmount: 112500, pendingAmount: 0, projectId: proj1.id, analystId: maria.id, deliverableId: del2.id, activatedAt: new Date('2024-02-01'), lastAction: 'Pago conciliado', lastActionDate: new Date('2024-02-28') } })
  await prisma.milestone.create({ data: { id: 'ms-3', name: 'Desarrollo MVP', amount: 112500, financialStatus: 'Bloqueado', activationType: 'entregable', daysActive: 12, paidAmount: 0, pendingAmount: 112500, projectId: proj1.id, analystId: maria.id, deliverableId: del3.id, lastAction: 'Esperando entregable', lastActionDate: new Date('2024-04-20') } })
  await prisma.milestone.create({ data: { id: 'ms-4', name: 'Testing e Implementación', amount: 112500, financialStatus: 'Suspendido', activationType: 'entregable', daysActive: 30, daysOverdue: 5, paidAmount: 0, pendingAmount: 112500, projectId: proj1.id, analystId: maria.id, deliverableId: del4.id, suspensionReason: 'Retraso interno en desarrollo del MVP', suspensionDate: new Date('2024-04-28'), suspendedBy: 'María López', lastAction: 'Suspendido por retraso interno', lastActionDate: new Date('2024-04-28') } })

  // ─── Project 2: FinServ (EnCurso) ─────────────────────────────────
  const proj2 = await prisma.project.create({
    data: { id: 'proj-2', name: 'Plataforma de Pagos - Integración', service: 'Desarrollo de Software', totalAmount: 320000, paidAmount: 80000, currency: 'USD', status: 'EnCurso', clientId: finserv.id },
  })
  await prisma.milestone.create({ data: { id: 'ms-5', name: 'Análisis de Requerimientos', amount: 80000, financialStatus: 'Conciliado', activationType: 'adelanto', daysActive: 30, paidAmount: 80000, pendingAmount: 0, projectId: proj2.id, analystId: carlos.id, activatedAt: new Date('2024-01-15'), lastAction: 'Pago conciliado', lastActionDate: new Date('2024-02-15') } })
  await prisma.milestone.create({ data: { id: 'ms-6', name: 'Desarrollo Core', amount: 80000, financialStatus: 'Notificado', activationType: 'fecha', daysActive: 20, paidAmount: 0, pendingAmount: 80000, projectId: proj2.id, analystId: carlos.id, activatedAt: new Date('2024-03-20'), dueDate: new Date('2024-04-20'), lastAction: 'Notificación enviada', lastActionDate: new Date('2024-04-10') } })
  await prisma.milestone.create({ data: { id: 'ms-7', name: 'Integración Pasarela', amount: 80000, financialStatus: 'PagoEnRevision', activationType: 'aprobacion_cliente', daysActive: 10, paidAmount: 0, pendingAmount: 80000, projectId: proj2.id, analystId: carlos.id, lastAction: 'Pago registrado, en revisión', lastActionDate: new Date('2024-04-25') } })
  await prisma.milestone.create({ data: { id: 'ms-8', name: 'Go Live', amount: 80000, financialStatus: 'Configurado', activationType: 'manual', paidAmount: 0, pendingAmount: 80000, projectId: proj2.id, analystId: carlos.id } })

  // ─── Project 3: RetailCorp (Finalizado) ───────────────────────────
  const proj3 = await prisma.project.create({
    data: { id: 'proj-3', name: 'Sistema de Inventario', service: 'Desarrollo de Software', totalAmount: 280000, paidAmount: 280000, currency: 'USD', status: 'Finalizado', clientId: retailcorp.id },
  })
  await prisma.milestone.create({ data: { id: 'ms-9', name: 'Implementación Completa', amount: 280000, financialStatus: 'Conciliado', activationType: 'firma', daysActive: 60, paidAmount: 280000, pendingAmount: 0, projectId: proj3.id, analystId: ana.id, activatedAt: new Date('2024-01-01'), lastAction: 'Proyecto completado', lastActionDate: new Date('2024-03-15') } })

  // ─── Project 4: SAP (EnCurso, overdue milestone) ──────────────────
  const proj4 = await prisma.project.create({
    data: { id: 'proj-4', name: 'Proyecto SAP Implementation', service: 'Implementación ERP', totalAmount: 500000, paidAmount: 125000, currency: 'USD', status: 'EnCurso', clientId: grupoXyz.id },
  })
  const del5 = await prisma.deliverable.create({ data: { id: 'del-5', name: 'Levantamiento de Procesos', technicalStatus: 'Aprobado', projectId: proj4.id, responsibleId: ana.id } })
  const del6 = await prisma.deliverable.create({ data: { id: 'del-6', name: 'Configuración de Módulos SAP', technicalStatus: 'Terminado', projectId: proj4.id, responsibleId: ana.id } })

  await prisma.milestone.create({ data: { id: 'ms-10', name: 'Fase 1: Levantamiento', amount: 125000, financialStatus: 'Conciliado', activationType: 'entregable', daysActive: 60, paidAmount: 125000, pendingAmount: 0, projectId: proj4.id, analystId: ana.id, deliverableId: del5.id, activatedAt: new Date('2023-12-01'), lastAction: 'Conciliado', lastActionDate: new Date('2024-01-10') } })
  await prisma.milestone.create({ data: { id: 'ms-11', name: 'Fase 2: Configuración de Módulos', amount: 125000, financialStatus: 'EnMora', activationType: 'entregable', daysActive: 45, daysOverdue: 14, paidAmount: 0, pendingAmount: 125000, projectId: proj4.id, analystId: ana.id, deliverableId: del6.id, activatedAt: new Date('2024-03-01'), dueDate: new Date('2024-04-15'), lastAction: 'Escalamiento', lastActionDate: new Date('2024-04-20') } })
  await prisma.milestone.create({ data: { id: 'ms-12', name: 'Fase 3: Testing', amount: 125000, financialStatus: 'Bloqueado', activationType: 'entregable', paidAmount: 0, pendingAmount: 125000, projectId: proj4.id, analystId: ana.id } })
  await prisma.milestone.create({ data: { id: 'ms-13', name: 'Fase 4: Go Live', amount: 125000, financialStatus: 'Configurado', activationType: 'manual', paidAmount: 0, pendingAmount: 125000, projectId: proj4.id, analystId: ana.id } })

  // ─── Project 5: Retail Digital (EnCurso, with commitment) ─────────
  const proj5 = await prisma.project.create({
    data: { id: 'proj-5', name: 'Transformación Digital Retail', service: 'Transformación Digital', totalAmount: 340000, paidAmount: 85000, currency: 'USD', status: 'EnCurso', clientId: cadenaAbc.id },
  })
  await prisma.milestone.create({ data: { id: 'ms-14', name: 'Hito 1: Diagnóstico', amount: 85000, financialStatus: 'Conciliado', activationType: 'adelanto', daysActive: 30, paidAmount: 85000, pendingAmount: 0, projectId: proj5.id, analystId: juan.id, activatedAt: new Date('2024-01-15'), lastAction: 'Conciliado', lastActionDate: new Date('2024-02-01') } })
  await prisma.milestone.create({ data: { id: 'ms-15', name: 'Hito 2: Diseño de Solución', amount: 85000, financialStatus: 'CompromisoPago', activationType: 'aprobacion_cliente', daysActive: 25, paidAmount: 0, pendingAmount: 85000, projectId: proj5.id, analystId: juan.id, commitmentDate: new Date('2024-05-15'), commitmentAmount: 85000, lastAction: 'Compromiso de pago 15/05', lastActionDate: new Date('2024-04-15') } })
  await prisma.milestone.create({ data: { id: 'ms-16', name: 'Hito 3: Integración de Sistemas', amount: 85000, financialStatus: 'EnMora', activationType: 'fecha', daysActive: 35, daysOverdue: 7, paidAmount: 0, pendingAmount: 85000, projectId: proj5.id, analystId: juan.id, activatedAt: new Date('2024-03-20'), dueDate: new Date('2024-04-20'), lastAction: 'Seguimiento telefónico', lastActionDate: new Date('2024-04-27') } })
  await prisma.milestone.create({ data: { id: 'ms-17', name: 'Hito 4: Despliegue', amount: 85000, financialStatus: 'Bloqueado', activationType: 'entregable', paidAmount: 0, pendingAmount: 85000, projectId: proj5.id, analystId: juan.id } })

  // ─── Project 6: FMCG (EnCurso, exigible) ─────────────────────────
  const proj6 = await prisma.project.create({
    data: { id: 'proj-6', name: 'Consultoría Estratégica FMCG', service: 'Consultoría Estratégica', totalAmount: 380000, paidAmount: 190000, currency: 'USD', status: 'EnCurso', clientId: consumo.id },
  })
  await prisma.milestone.create({ data: { id: 'ms-18', name: 'Diagnóstico Estratégico', amount: 95000, financialStatus: 'Conciliado', activationType: 'adelanto', daysActive: 40, paidAmount: 95000, pendingAmount: 0, projectId: proj6.id, analystId: laura.id, activatedAt: new Date('2024-01-01'), lastAction: 'Conciliado', lastActionDate: new Date('2024-01-30') } })
  await prisma.milestone.create({ data: { id: 'ms-19', name: 'Plan de Acción', amount: 95000, financialStatus: 'Conciliado', activationType: 'entregable', daysActive: 35, paidAmount: 95000, pendingAmount: 0, projectId: proj6.id, analystId: laura.id, activatedAt: new Date('2024-02-01'), lastAction: 'Conciliado', lastActionDate: new Date('2024-03-05') } })
  await prisma.milestone.create({ data: { id: 'ms-20', name: 'Entrega Final', amount: 95000, financialStatus: 'Exigible', activationType: 'aprobacion_cliente', daysActive: 15, paidAmount: 0, pendingAmount: 95000, projectId: proj6.id, analystId: laura.id, activatedAt: new Date('2024-04-05'), dueDate: new Date('2024-05-05'), lastAction: 'Notificación enviada', lastActionDate: new Date('2024-04-18') } })
  await prisma.milestone.create({ data: { id: 'ms-21', name: 'Seguimiento Post', amount: 95000, financialStatus: 'Configurado', activationType: 'manual', paidAmount: 0, pendingAmount: 95000, projectId: proj6.id, analystId: laura.id } })

  // ─── Project 7: Auditoría (EnCurso, with partial payment) ─────────
  const proj7 = await prisma.project.create({
    data: { id: 'proj-7', name: 'Auditoría Financiera Integral', service: 'Auditoría', totalAmount: 442000, paidAmount: 145500, currency: 'USD', status: 'EnCurso', clientId: bancoSur.id },
  })
  await prisma.milestone.create({ data: { id: 'ms-22', name: 'Auditoría Preliminar', amount: 110500, financialStatus: 'Conciliado', activationType: 'firma', daysActive: 50, paidAmount: 110500, pendingAmount: 0, projectId: proj7.id, analystId: maria.id, activatedAt: new Date('2023-12-15'), lastAction: 'Conciliado', lastActionDate: new Date('2024-02-10') } })
  await prisma.milestone.create({ data: { id: 'ms-23', name: 'Auditoría de Procesos', amount: 110500, financialStatus: 'PagadoParcial', activationType: 'entregable', daysActive: 18, paidAmount: 35000, pendingAmount: 75500, projectId: proj7.id, analystId: maria.id, activatedAt: new Date('2024-04-01'), lastAction: 'Pago parcial recibido - $35,000', lastActionDate: new Date('2024-04-22') } })
  await prisma.milestone.create({ data: { id: 'ms-24', name: 'Informe Final', amount: 110500, financialStatus: 'Bloqueado', activationType: 'entregable', paidAmount: 0, pendingAmount: 110500, projectId: proj7.id, analystId: maria.id } })
  await prisma.milestone.create({ data: { id: 'ms-25', name: 'Presentación a Directorio', amount: 110500, financialStatus: 'Configurado', activationType: 'aprobacion_entidad', paidAmount: 0, pendingAmount: 110500, projectId: proj7.id, analystId: maria.id } })

  // ─── Projects 8-12 (various states) ───────────────────────────────
  const proj8 = await prisma.project.create({ data: { id: 'proj-8', name: 'Sistema CRM Enterprise', service: 'Desarrollo de Software', totalAmount: 600000, paidAmount: 300000, currency: 'USD', status: 'EnCurso', clientId: crmClient.id } })
  await prisma.milestone.create({ data: { id: 'ms-26', name: 'Implementación Fase 1', amount: 150000, financialStatus: 'Conciliado', activationType: 'adelanto', daysActive: 40, paidAmount: 150000, pendingAmount: 0, projectId: proj8.id, analystId: carlos.id, lastAction: 'Conciliado', lastActionDate: new Date('2024-05-04') } })
  await prisma.milestone.create({ data: { id: 'ms-27', name: 'Implementación Fase 2', amount: 150000, financialStatus: 'Conciliado', activationType: 'entregable', daysActive: 30, paidAmount: 150000, pendingAmount: 0, projectId: proj8.id, analystId: carlos.id, lastAction: 'Conciliado', lastActionDate: new Date('2024-05-04') } })
  await prisma.milestone.create({ data: { id: 'ms-28', name: 'Migración de Datos', amount: 150000, financialStatus: 'Exigible', activationType: 'fecha', daysActive: 22, paidAmount: 0, pendingAmount: 150000, projectId: proj8.id, analystId: juan.id, activatedAt: new Date('2024-04-10'), dueDate: new Date('2024-05-10'), lastAction: 'Llamada de cobro', lastActionDate: new Date('2024-04-21') } })
  await prisma.milestone.create({ data: { id: 'ms-29', name: 'Capacitación', amount: 150000, financialStatus: 'Configurado', activationType: 'manual', paidAmount: 0, pendingAmount: 150000, projectId: proj8.id, analystId: juan.id } })

  const proj9 = await prisma.project.create({ data: { id: 'proj-9', name: 'Renovación Identidad Corporativa', service: 'Branding', totalAmount: 260000, paidAmount: 130000, currency: 'USD', status: 'EnCurso', clientId: identidad.id } })
  await prisma.milestone.create({ data: { id: 'ms-30', name: 'Diseño Ejecutivo', amount: 130000, financialStatus: 'Conciliado', activationType: 'adelanto', daysActive: 25, paidAmount: 130000, pendingAmount: 0, projectId: proj9.id, analystId: ana.id, lastAction: 'Conciliado', lastActionDate: new Date('2024-05-02') } })
  await prisma.milestone.create({ data: { id: 'ms-31', name: 'Implementación de Marca', amount: 130000, financialStatus: 'Notificado', activationType: 'aprobacion_cliente', daysActive: 12, paidAmount: 0, pendingAmount: 130000, projectId: proj9.id, analystId: ana.id, activatedAt: new Date('2024-04-20'), lastAction: 'Notificación enviada', lastActionDate: new Date('2024-04-27') } })

  const proj10 = await prisma.project.create({ data: { id: 'proj-10', name: 'Optimización de Procesos Manufactura', service: 'Consultoría Operacional', totalAmount: 340000, paidAmount: 170000, currency: 'USD', status: 'EnCurso', clientId: manufactura.id } })
  await prisma.milestone.create({ data: { id: 'ms-32', name: 'Diagnóstico Inicial', amount: 170000, financialStatus: 'Conciliado', activationType: 'firma', daysActive: 30, paidAmount: 170000, pendingAmount: 0, projectId: proj10.id, analystId: juan.id, lastAction: 'Conciliado', lastActionDate: new Date('2024-04-30') } })
  await prisma.milestone.create({ data: { id: 'ms-33', name: 'Plan de Mejora', amount: 170000, financialStatus: 'PagoObservado', activationType: 'entregable', daysActive: 15, paidAmount: 0, pendingAmount: 170000, projectId: proj10.id, analystId: laura.id, activatedAt: new Date('2024-04-15'), lastAction: 'Pago observado - comprobante ilegible', lastActionDate: new Date('2024-04-28') } })

  const proj11 = await prisma.project.create({ data: { id: 'proj-11', name: 'Consultoría en Gestión Talento', service: 'RRHH', totalAmount: 220000, paidAmount: 55000, currency: 'USD', status: 'PendienteAdelanto', clientId: talento.id } })
  await prisma.milestone.create({ data: { id: 'ms-34', name: 'Evaluación de Competencias', amount: 55000, financialStatus: 'Conciliado', activationType: 'adelanto', daysActive: 20, paidAmount: 55000, pendingAmount: 0, projectId: proj11.id, analystId: laura.id, lastAction: 'Conciliado', lastActionDate: new Date('2024-04-28') } })
  await prisma.milestone.create({ data: { id: 'ms-35', name: 'Plan de Desarrollo', amount: 55000, financialStatus: 'Exigible', activationType: 'fecha', daysActive: 8, paidAmount: 0, pendingAmount: 55000, projectId: proj11.id, analystId: laura.id, activatedAt: new Date('2024-04-25'), dueDate: new Date('2024-05-25'), lastAction: 'Factura emitida', lastActionDate: new Date('2024-04-28') } })
  await prisma.milestone.create({ data: { id: 'ms-36', name: 'Implementación', amount: 55000, financialStatus: 'Bloqueado', activationType: 'aprobacion_cliente', paidAmount: 0, pendingAmount: 55000, projectId: proj11.id, analystId: laura.id } })
  await prisma.milestone.create({ data: { id: 'ms-37', name: 'Seguimiento', amount: 55000, financialStatus: 'Configurado', activationType: 'manual', paidAmount: 0, pendingAmount: 55000, projectId: proj11.id, analystId: laura.id } })

  const proj12 = await prisma.project.create({ data: { id: 'proj-12', name: 'Desarrollo Portal Web B2B', service: 'Desarrollo Web', totalAmount: 480000, paidAmount: 240000, currency: 'USD', status: 'EnCurso', clientId: portalB2B.id } })
  await prisma.milestone.create({ data: { id: 'ms-38', name: 'Backend y APIs', amount: 240000, financialStatus: 'Conciliado', activationType: 'entregable', daysActive: 35, paidAmount: 240000, pendingAmount: 0, projectId: proj12.id, analystId: maria.id, lastAction: 'Conciliado', lastActionDate: new Date('2024-04-25') } })
  await prisma.milestone.create({ data: { id: 'ms-39', name: 'Frontend y Deploy', amount: 240000, financialStatus: 'Exigible', activationType: 'entregable', daysActive: 10, paidAmount: 0, pendingAmount: 240000, projectId: proj12.id, analystId: maria.id, activatedAt: new Date('2024-04-25'), dueDate: new Date('2024-05-25'), lastAction: 'Hito activado', lastActionDate: new Date('2024-04-25') } })

  // ─── Payments ─────────────────────────────────────────────────────
  // Completed/reconciled payments
  await prisma.payment.create({ data: { id: 'pay-1', amount: 112500, expectedAmount: 112500, method: 'transfer', reference: 'TRF-001-2024', status: 'reconciled', date: new Date('2024-01-25'), projectId: proj1.id, milestoneId: 'ms-1', reconciledBy: 'Contabilidad' } })
  await prisma.payment.create({ data: { id: 'pay-2', amount: 112500, expectedAmount: 112500, method: 'transfer', reference: 'TRF-002-2024', status: 'reconciled', date: new Date('2024-02-28'), projectId: proj1.id, milestoneId: 'ms-2', reconciledBy: 'Contabilidad' } })

  // PagoEnRevision payment (for ms-7)
  await prisma.payment.create({ data: { id: 'pay-3', amount: 75000, expectedAmount: 80000, method: 'transfer', reference: 'TRF-2024-0895', status: 'reviewing', date: new Date('2024-05-01'), projectId: proj2.id, milestoneId: 'ms-7', voucherImage: '/placeholder.jpg' } })

  // Partial payment (for ms-23 Auditoría de Procesos)
  await prisma.payment.create({ data: { id: 'pay-4', amount: 35000, expectedAmount: 110500, method: 'transfer', reference: 'TRF-2024-0870', status: 'reconciled', isPartial: true, date: new Date('2024-04-22'), projectId: proj7.id, milestoneId: 'ms-23', reconciledBy: 'Contabilidad' } })

  // Pending reconciliation payments
  await prisma.payment.create({ data: { id: 'pay-5', amount: 150000, expectedAmount: 150000, method: 'transfer', reference: 'TRF-2024-0891', status: 'pending', date: new Date('2024-05-03'), projectId: proj8.id, milestoneId: 'ms-28', voucherImage: '/placeholder.jpg' } })
  await prisma.payment.create({ data: { id: 'pay-6', amount: 130000, expectedAmount: 130000, method: 'yape', reference: 'YAPE-789012', status: 'pending', date: new Date('2024-05-03'), projectId: proj9.id, milestoneId: 'ms-31', voucherImage: '/placeholder.jpg' } })
  await prisma.payment.create({ data: { id: 'pay-7', amount: 240000, expectedAmount: 240000, method: 'transfer', reference: 'TRF-2024-0899', status: 'pending', date: new Date('2024-05-02'), projectId: proj12.id, milestoneId: 'ms-39', voucherImage: '/placeholder.jpg' } })

  // Observed payment (for ms-33)
  await prisma.payment.create({ data: { id: 'pay-8', amount: 170000, expectedAmount: 170000, method: 'check', reference: 'CHQ-005430', status: 'observed', date: new Date('2024-04-29'), projectId: proj10.id, milestoneId: 'ms-33', voucherImage: '/placeholder.jpg', observedReason: 'Comprobante ilegible' } })

  // Rejected payment
  await prisma.payment.create({ data: { id: 'pay-9', amount: 55000, expectedAmount: 55000, method: 'cash', reference: 'CASH-00123', status: 'rejected', date: new Date('2024-04-27'), projectId: proj11.id, milestoneId: 'ms-35', voucherImage: '/placeholder.jpg', observedReason: 'Monto no coincide con recibo' } })

  // Reconciled payments for dashboard
  await prisma.payment.create({ data: { id: 'pay-10', amount: 150000, expectedAmount: 150000, method: 'transfer', reference: 'TRF-2024-0850', status: 'reconciled', date: new Date('2024-05-04'), projectId: proj8.id, milestoneId: 'ms-26', reconciledBy: 'Contabilidad' } })
  await prisma.payment.create({ data: { id: 'pay-11', amount: 150000, expectedAmount: 150000, method: 'transfer', reference: 'TRF-2024-0851', status: 'reconciled', date: new Date('2024-05-04'), projectId: proj8.id, milestoneId: 'ms-27', reconciledBy: 'Contabilidad' } })

  // ─── Documents ────────────────────────────────────────────────────
  await prisma.document.createMany({ data: [
    { id: 'doc-1', name: 'Factura PRO-2024-001', type: 'invoice', date: '2024-01-15', projectId: proj1.id },
    { id: 'doc-2', name: 'Factura PRO-2024-002', type: 'invoice', date: '2024-02-20', projectId: proj1.id },
    { id: 'doc-3', name: 'Informe de Avance', type: 'report', date: '2024-03-01', projectId: proj1.id },
  ] })

  // ─── Activities ───────────────────────────────────────────────────
  await prisma.activity.createMany({ data: [
    { id: 'act-1', userName: 'María López', userInitials: 'ML', action: 'call', actionLabel: 'Llamada de seguimiento', comment: 'Se contactó al cliente para confirmar recepción de factura.', tags: 'seguimiento,facturación', timestamp: 'Hace 2 horas', projectId: proj1.id },
    { id: 'act-2', userName: 'Carlos Ruiz', userInitials: 'CR', action: 'message', actionLabel: 'WhatsApp enviado', comment: 'Recordatorio de pago pendiente para Hito 3.', tags: 'recordatorio,hito-3', timestamp: 'Hace 1 día', projectId: proj1.id },
    { id: 'act-3', userName: 'Sistema', userInitials: 'SY', action: 'payment', actionLabel: 'Pago recibido', comment: 'Pago de $112,500 recibido por transferencia. Ref: TRF-002-2024', tags: 'pago,completado', timestamp: 'Hace 3 días', projectId: proj1.id },
    { id: 'act-4', userName: 'Ana González', userInitials: 'AG', action: 'suspension', actionLabel: 'Hito suspendido', comment: 'Testing e Implementación suspendido por retraso en MVP.', tags: 'suspensión,retraso', timestamp: 'Hace 5 días', projectId: proj1.id },
  ] })

  // ─── Automation Templates ─────────────────────────────────────────
  await prisma.automationTemplate.create({ data: { id: 'tmpl-1', name: 'Recordatorio Suave', channel: 'whatsapp', content: 'Hola {{nombre_cliente}}, le recordamos que el hito "{{hito}}" del proyecto {{proyecto}} por {{monto_hito}} está por cobrar. Fecha límite: {{fecha_vencimiento}}. Gracias.' } })
  await prisma.automationTemplate.create({ data: { id: 'tmpl-2', name: 'Recordatorio Urgente', channel: 'whatsapp', content: '{{nombre_cliente}}, el pago del hito {{hito}} ({{monto_hito}}) vence hoy. Por favor efectúe la transferencia a la brevedad. Ref: {{numero_referencia}}' } })
  await prisma.automationTemplate.create({ data: { id: 'tmpl-3', name: 'Escalada - Seguimiento Formal', channel: 'email', content: 'Estimado {{nombre_cliente}},\n\nLe comunicamos que el hito {{hito}} del proyecto {{proyecto}} se encuentra en mora por {{dias_mora}}. Monto pendiente: {{monto_hito}}.\n\nSolicitamos regularizar inmediatamente.\n\nContacto: {{email_contacto}}' } })
  await prisma.automationTemplate.create({ data: { id: 'tmpl-4', name: 'Último Recordatorio', channel: 'email', content: '{{nombre_cliente}}, es la última notificación. El hito {{hito}} está vencido por {{dias_mora}}. Si no recibimos pago en 48h, procederemos con acciones legales.' } })

  // ─── Automation Rules ─────────────────────────────────────────────
  await prisma.automationRule.createMany({ data: [
    { id: 'rule-1', status: 'Exigible', days: 1, channel: 'whatsapp', active: true, templateId: 'tmpl-1' },
    { id: 'rule-2', status: 'Exigible', days: 5, channel: 'whatsapp', active: true, templateId: 'tmpl-2' },
    { id: 'rule-3', status: 'EnMora', days: 3, channel: 'email', active: true, templateId: 'tmpl-3' },
    { id: 'rule-4', status: 'EnMora', days: 10, channel: 'email', active: false, templateId: 'tmpl-4' },
  ] })

  // ─── Initial Audit Logs ───────────────────────────────────────────
  await prisma.auditLog.createMany({ data: [
    { entityType: 'milestone', entityId: 'ms-4', action: 'status_change', previousState: 'Bloqueado', newState: 'Suspendido', reason: 'Retraso interno en desarrollo del MVP', userName: 'María López', projectId: proj1.id, milestoneId: 'ms-4', createdAt: new Date('2024-04-28') },
    { entityType: 'milestone', entityId: 'ms-23', action: 'partial_payment', previousState: 'Exigible', newState: 'PagadoParcial', reason: 'Pago parcial de $35,000 recibido', userName: 'Sistema', projectId: proj7.id, milestoneId: 'ms-23', createdAt: new Date('2024-04-22') },
    { entityType: 'milestone', entityId: 'ms-7', action: 'payment_registered', previousState: 'Notificado', newState: 'PagoEnRevision', reason: 'Cliente registró pago de $75,000', userName: 'Carlos Ruiz', projectId: proj2.id, milestoneId: 'ms-7', createdAt: new Date('2024-04-25') },
  ] })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
