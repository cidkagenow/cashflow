import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(projects.map(p => ({
    id: p.id,
    clientName: p.client.name,
    projectName: p.name,
    totalAmount: p.totalAmount,
    paidAmount: p.paidAmount,
    status: p.status,
  })))
}

export async function POST(request: Request) {
  const body = await request.json()
  const { clientId, contactName, projectName, service, totalAmount, currency, milestones } = body

  const project = await prisma.project.create({
    data: {
      name: projectName,
      service,
      totalAmount,
      currency: currency || 'USD',
      clientId,
      milestones: {
        create: milestones.map((m: { name: string; amount: number }) => ({
          name: m.name,
          amount: m.amount,
          status: 'pendiente',
        })),
      },
    },
    include: { milestones: true, client: true },
  })

  return NextResponse.json(project, { status: 201 })
}
