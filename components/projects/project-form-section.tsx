import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface ProjectData {
  clientId: string
  contactName: string
  projectName: string
  service: string
  totalAmount: number
  currency: string
}

interface ProjectFormSectionProps {
  data: ProjectData
  onChange: (data: ProjectData) => void
}

const clients = [
  { id: 'client-1', name: 'TechCorp Solutions' },
  { id: 'client-2', name: 'FinServ Consulting' },
  { id: 'client-3', name: 'RetailPro Ltda' },
  { id: 'client-4', name: 'ConsultPro Int\'l' },
  { id: 'client-5', name: 'AgriTech Innovations' },
]

const services = [
  { value: 'consulta', label: 'Consultoría' },
  { value: 'desarrollo', label: 'Desarrollo de Software' },
  { value: 'design', label: 'Diseño UX/UI' },
  { value: 'marketing', label: 'Marketing Digital' },
  { value: 'implementacion', label: 'Implementación' },
  { value: 'auditoria', label: 'Auditoría' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
]

const currencies = [
  { value: 'USD', label: 'USD - Dólar' },
  { value: 'CLP', label: 'CLP - Peso Chileno' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'ARS', label: 'ARS - Peso Argentino' },
]

export function ProjectFormSection({
  data,
  onChange,
}: ProjectFormSectionProps) {
  return (
    <Card className="p-6 border-0 shadow-none bg-transparent">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold mb-1">Datos del Proyecto</h2>
          <p className="text-sm text-muted-foreground">
            Complete la información básica del proyecto y del cliente.
          </p>
        </div>

        {/* Grid Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Cliente */}
          <div>
            <Label htmlFor="client" className="text-sm font-medium mb-2">
              Cliente *
            </Label>
            <Select
              value={data.clientId}
              onValueChange={(value) =>
                onChange({ ...data, clientId: value })
              }
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contacto */}
          <div>
            <Label htmlFor="contact" className="text-sm font-medium mb-2">
              Nombre de Contacto *
            </Label>
            <Input
              id="contact"
              placeholder="Juan Pérez"
              value={data.contactName}
              onChange={(e) =>
                onChange({ ...data, contactName: e.target.value })
              }
            />
          </div>

          {/* Nombre del Proyecto */}
          <div className="sm:col-span-2">
            <Label htmlFor="project-name" className="text-sm font-medium mb-2">
              Nombre del Proyecto *
            </Label>
            <Input
              id="project-name"
              placeholder="Ej: Transformación Digital de Infraestructura"
              value={data.projectName}
              onChange={(e) =>
                onChange({ ...data, projectName: e.target.value })
              }
            />
          </div>

          {/* Servicio */}
          <div>
            <Label htmlFor="service" className="text-sm font-medium mb-2">
              Tipo de Servicio *
            </Label>
            <Select
              value={data.service}
              onValueChange={(value) =>
                onChange({ ...data, service: value })
              }
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Monto Total */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2">
              Monto Total del Proyecto *
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={data.totalAmount}
              onChange={(e) =>
                onChange({
                  ...data,
                  totalAmount: parseFloat(e.target.value) || 0,
                })
              }
              step="1000"
            />
          </div>

          {/* Moneda */}
          <div>
            <Label htmlFor="currency" className="text-sm font-medium mb-2">
              Moneda *
            </Label>
            <Select
              value={data.currency}
              onValueChange={(value) =>
                onChange({ ...data, currency: value })
              }
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Selecciona moneda" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  )
}
