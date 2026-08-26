import { useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { CATEGORIES } from '../data/categories'
import { translateCategory } from '../utils/i18n'
import { todayISO } from '../utils/dates'
import AppHeader from '../components/AppHeader'
import { Field, SelectField, TextArea, BtnPrimary } from '../components/FormFields'

export default function AddItem({ onNav, params }) {
  const { products, addProduct, updateProduct, settings, t } = usePantry()
  // Si llega un productId, el mismo formulario funciona en modo edición.
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
    // FileReader convierte la foto seleccionada en una cadena Data URL local.
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('photo', reader.result)
    reader.readAsDataURL(file)
  }

  const validate = () => {
    // La validación ocurre antes de modificar el estado global.
    const errs = {}
    if (!form.name.trim()) errs.name = t('add.requiredName')
    if (!form.category) errs.category = t('add.requiredCategory')
    if (!form.purchaseDate) errs.purchaseDate = t('add.requiredPurchase')
    if (!form.expiryDate) errs.expiryDate = t('add.requiredExpiry')
    if (form.expiryDate && form.purchaseDate && form.expiryDate < form.purchaseDate)
      errs.expiryDate = t('add.dateOrder')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (e) => {
    // El mismo evento decide si crea un producto o actualiza uno existente.
    e.preventDefault()
    if (!validate()) return
    const data = { ...form, name: form.name.trim() }
    if (editing) {
      updateProduct(editing.id, data)
      onNav('detail', { productId: editing.id })
    } else {
      const saved = addProduct(data)
      onNav('detail', { productId: saved.id, notice: t('detail.added') })
    }
  }

  const backTarget = editing ? ['detail', { productId: editing.id }] : ['home']

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950">
      <AppHeader
        title={editing ? t('add.editTitle') : t('add.addTitle')}
        showBack
        onBack={() => onNav(...backTarget)}
      />
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-4">
        {form.photo ? (
          <div className="relative w-full h-32">
            <img src={form.photo} alt={t('add.photo')} className="w-full h-32 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => set('photo', null)}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center"
              aria-label={t('add.removePhoto')}
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
            <span className="text-[11px] text-fresh-600 dark:text-fresh-400">{t('add.photo')}</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />

        <Field
          label={t('add.name')}
          placeholder={t('add.namePlaceholder')}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
        />

        <SelectField
          label={t('add.category')}
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          error={errors.category}
        >
          <option value="" disabled>
            {t('add.chooseCategory')}
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {translateCategory(c.id, settings.language)}
            </option>
          ))}
        </SelectField>

        <div className="flex gap-3">
          <div className="flex-1">
            <Field
              label={t('add.purchase')}
              type="date"
              value={form.purchaseDate}
              onChange={(e) => set('purchaseDate', e.target.value)}
              error={errors.purchaseDate}
            />
          </div>
          <div className="flex-1">
            <Field
              label={t('add.expiry')}
              type="date"
              value={form.expiryDate}
              onChange={(e) => set('expiryDate', e.target.value)}
              error={errors.expiryDate}
            />
          </div>
        </div>

        <Field
          label={t('add.quantity')}
          placeholder={t('add.quantityPlaceholder')}
          value={form.quantity}
          onChange={(e) => set('quantity', e.target.value)}
        />

        <Field
          label={t('add.location')}
          placeholder={t('add.locationPlaceholder')}
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
        />

        <TextArea
          label={t('add.notes')}
          placeholder={t('add.notesPlaceholder')}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />

        <div className="flex flex-col gap-2 mt-auto pt-2 pb-2">
          <BtnPrimary type="submit" label={editing ? t('add.saveChanges') : t('add.save')} />
          <button type="button" onClick={() => onNav(...backTarget)} className="h-10 flex items-center justify-center">
            <span className="text-sm text-gray-400">{t('add.cancel')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
