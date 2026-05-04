'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle, Upload, X } from 'lucide-react';
import Image from 'next/image';

export interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestoneId: string;
  clientName: string;
  milestoneName: string;
  expectedAmount: number;
}

const paymentMethods = ['Transferencia', 'Yape', 'Cheque', 'Efectivo', 'Otro'];

export function PaymentModal({
  open,
  onOpenChange,
  milestoneId,
  clientName,
  milestoneName,
  expectedAmount,
}: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [depositDate, setDepositDate] = useState('');
  const [method, setMethod] = useState('Transferencia');
  const [reference, setReference] = useState('');
  const [voucher, setVoucher] = useState<File | null>(null);
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const isPartialPayment = amountNum > 0 && amountNum < expectedAmount;
  const isExcessPayment = amountNum > expectedAmount;
  const remainingAmount = Math.max(0, expectedAmount - amountNum);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo no debe exceder 5MB');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se aceptan PNG, JPG y PDF');
      return;
    }

    setVoucher(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVoucherPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVoucherPreview(null);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      processFile(files[0]);
    }
  };

  const handleSave = () => {
    if (!amount || !depositDate || !method) {
      alert('Por favor completa Monto, Fecha y Medio de Pago');
      return;
    }

    console.log('[v0] Payment registered:', {
      milestoneId,
      amount: amountNum,
      depositDate,
      method,
      reference,
      voucherFile: voucher?.name,
      isPartial: isPartialPayment,
    });

    // Reset form
    setAmount('');
    setDepositDate('');
    setMethod('Transferencia');
    setReference('');
    setVoucher(null);
    setVoucherPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Pago</DialogTitle>
          <DialogDescription>
            {clientName} • {milestoneName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Expected Amount Info */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monto Esperado:</span>
              <span className="text-lg font-semibold">
                ${expectedAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-semibold">
              Monto Pagado
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="1000"
              min="0"
              className="text-lg"
            />
          </div>

          {/* Alerts */}
          {isPartialPayment && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-semibold">Pago Parcial</p>
                <p className="text-xs mt-1">
                  Este pago se registrará como parcial. Saldo pendiente:{' '}
                  <strong>${remainingAmount.toLocaleString()}</strong>
                </p>
              </div>
            </div>
          )}

          {isExcessPayment && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Pago Excede Monto</p>
                <p className="text-xs mt-1">
                  El monto ingresado es mayor al esperado en $
                  {(amountNum - expectedAmount).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Deposit Date */}
          <div className="space-y-2">
            <Label htmlFor="depositDate" className="text-base font-semibold">
              Fecha del Depósito
            </Label>
            <Input
              id="depositDate"
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="method" className="text-base font-semibold">
              Medio de Pago
            </Label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-base font-semibold">
              Referencia / Comprobante (Opcional)
            </Label>
            <Input
              id="reference"
              type="text"
              placeholder="Ej: TRF-2024-12345"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          {/* Drag & Drop Area */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Voucher / Comprobante
            </Label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-muted-foreground/30 hover:border-muted-foreground'
              }`}
            >
              <input
                type="file"
                id="voucher"
                accept="image/png,image/jpeg,application/pdf"
                onChange={handleFileInput}
                className="hidden"
              />
              <label
                htmlFor="voucher"
                className="flex flex-col items-center justify-center gap-2"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">
                    Arrastra tu archivo aquí o haz click
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, PDF - Máx 5MB
                  </p>
                </div>
              </label>
            </div>

            {/* Voucher Preview */}
            {voucherPreview && (
              <div className="relative">
                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={voucherPreview}
                    alt="Voucher preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    setVoucher(null);
                    setVoucherPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {voucher && !voucherPreview && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                <p className="text-sm font-medium text-green-800">
                  {voucher.name}
                </p>
                <button
                  onClick={() => {
                    setVoucher(null);
                    setVoucherPreview(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Registrar Pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
