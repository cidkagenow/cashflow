import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const rules = await prisma.automationRule.findMany({
    include: { template: true },
  })
  return NextResponse.json(rules.map(r => ({
    id: r.id,
    status: r.status,
    days: r.days,
    channel: r.channel,
    active: r.active,
    templateId: r.templateId,
    templateName: r.template.name,
  })))
}

export async function POST(request: Request) {
  const body = await request.json()
  const rule = await prisma.automationRule.create({
    data: body,
    include: { template: true },
  })
  return NextResponse.json({ ...rule, templateName: rule.template.name }, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...data } = body
  const rule = await prisma.automationRule.update({
    where: { id },
    data,
    include: { template: true },
  })
  return NextResponse.json({ ...rule, templateName: rule.template.name })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await prisma.automationRule.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
