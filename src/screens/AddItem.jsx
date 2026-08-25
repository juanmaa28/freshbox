import { useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { CATEGORIES } from '../data/categories'
import { todayISO } from '../utils/dates'
import AppHeader from '../components/AppHeader'
import { Field, SelectField, TextArea, BtnPrimary } from '../components/FormFields'

export default function AddItem({ onNav, params }) {
  const { products, addProduct, updateProduct } = usePantry()
  const editing = params?.productId ? products.find((p) => p.id === params.productId) : null

  const [form, setForm] = useState(() =>
    editing
      ? { ...editing }
      : {
          name: '',
          category: '',
          purchaseDate: todayISO(),
          expiryDate: '',
          quantity: '',
          location: '',
          notes: '',
          photo: null,
        }
  )
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('photo', reader.result)
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Ingresa el nombre del producto'
    if (!form.category) errs.category = 'Selecciona una categoría'
    if (!form.purchaseDate) errs.purchaseDate = 'Ingresa la fecha de compra'
    if (!form.expiryDate) errs.expiryDate = 'Ingresa la fecha de vencimiento'
    if (form.expiryDate && form.purchaseDate && form.expiryDate < form.purchaseDate)
      errs.expiryDate = 'Debe ser posterior a la compra'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = { ...form, name: form.name.trim() }
    if (editing) {
      updateProduct(editing.id, data)
      onNav('detail', { productId: editing.id })
    } else {
      const saved = addProduct(data)
      onNav('detail', { productId: saved.id })
    }
  }

  const backTarget = editing ? ['detail', { productId: editing.id }] : ['home']

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950">
      <AppHeader
        title={editing ? 'Editar producto' : 'Agregar producto'}
        showBack
        onBack={() => onNav(...backTarget)}
      />
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-4">
        {form.photo ? (
          <div className="relative w-full h-32">
            <img src={form.photo} alt="Foto del producto" className="w-full h-32 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => set('photo', null)}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center"
              aria-label="Quitar foto"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full h-24 border-2 border-dashed border-fresh-300 dark:border-fresh-800 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-fresh-50 dark:bg-fresh-900/10"
          >
            <div className="w-7 h-7 border border-fresh-400 rounded-lg flex items-center justify-center">
              <Plus size={14} className="text-fresh-500" />
            </div>
            <span className="text-[11px] text-fresh-600 dark:text-fresh-400">Agregar foto del producto</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />

        <Field
          label="Nombre del producto"
          placeholder="Ej: Leche entera 1L"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
        />

        <SelectField
          label="Categoría"
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          error={errors.category}
        >
          <option value="" disabled>
            Seleccionar categoría...
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </SelectField>

        <div className="flex gap-3">
          <div className="flex-1">
            <Field
              label="Fecha de compra"
              type="date"
              value={form.purchaseDate}
              onChange={(e) => set('purchaseDate', e.target.value)}
              error={errors.purchaseDate}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Fecha de vencimiento"
              type="date"
              value={form.expiryDate}
              onChange={(e) => set('expiryDate', e.target.value)}
              error={errors.expiryDate}
            />
          </div>
        </div>

        <Field
          label="Cantidad"
          placeholder="Ej: 1 litro / 500 g"
          value={form.quantity}
          onChange={(e) => set('quantity', e.target.value)}
        />

        <Field
          label="Ubicación (opcional)"
          placeholder="Ej: Nevera · Estante 2"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
        />

        <TextArea
          label="Notas opcionales"
          placeholder="Ej: abrir antes del fin de semana"
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />

        <div className="flex flex-col gap-2 mt-auto pt-2 pb-2">
          <BtnPrimary type="submit" label={editing ? 'Guardar cambios' : 'Guardar producto'} />
          <button type="button" onClick={() => onNav(...backTarget)} className="h-10 flex items-center justify-center">
            <span className="text-sm text-gray-400">Cancelar</span>
          </button>
        </div>
      </form>
    </div>
  )
}
