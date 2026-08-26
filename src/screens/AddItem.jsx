import { useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { CATEGORIES } from '../data/categories'
import { translateCategory } from '../utils/i18n'
import { todayISO } from '../utils/dates'
import AppHeader from '../components/AppHeader'
import { Field, TextArea, BtnPrimary } from '../components/FormFields'

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
    <div className="relative flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader
        title={editing ? t('add.editTitle') : t('add.addTitle')}
        showBack
        onBack={() => onNav(...backTarget)}
      />
      {/* El formulario es la columna; solo los campos hacen scroll, así la barra
          de acción queda siempre visible sin recurrir a posicionamiento absoluto. */}
      <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-6 pt-4 no-scrollbar">
          {form.photo ? (
            <div className="relative h-36 w-full shrink-0">
              <img
                src={form.photo}
                alt={t('add.photo')}
                className="h-36 w-full rounded-2xl object-cover shadow-card ring-1 ring-gray-900/5"
              />
              <button
                type="button"
                onClick={() => set('photo', null)}
                className="press absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-950/55 text-white backdrop-blur-sm hover:bg-gray-950/75"
                aria-label={t('add.removePhoto')}
              >
                <X size={15} strokeWidth={2.4} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="press flex h-28 w-full shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-fresh-300 bg-fresh-50/70 hover:bg-fresh-50 dark:border-fresh-800 dark:bg-fresh-900/15 dark:hover:bg-fresh-900/25"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-fresh-700 shadow-card dark:bg-gray-900 dark:text-fresh-400">
                <Camera size={17} strokeWidth={1.9} />
              </span>
              <span className="text-[12.5px] font-medium text-fresh-800 dark:text-fresh-400">
                {t('add.photo')}
              </span>
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

          {/* La categoría se elige tocando, no desplegando una lista nativa: se ven
              las ocho opciones con su color y su icono de una sola vez. */}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[12px] font-medium text-gray-500 dark:text-gray-400">
              {t('add.category')}
            </legend>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => {
                const isActive = form.category === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set('category', c.id)}
                    aria-pressed={isActive}
                    className={`press flex flex-col items-center gap-1.5 rounded-xl py-2.5 ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 ${
                      isActive
                        ? 'bg-white ring-2 ring-fresh-600 shadow-card dark:bg-gray-800'
                        : 'bg-white ring-gray-900/[0.07] hover:bg-gray-50 dark:bg-gray-900 dark:ring-white/[0.07] dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${c.color}`}>
                      <c.Icon size={16} strokeWidth={1.9} />
                    </span>
                    <span
                      className={`w-full truncate px-0.5 text-center text-[9px] font-semibold ${
                        isActive ? 'text-gray-900 dark:text-gray-50' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {translateCategory(c.id, settings.language)}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.category && (
              <span className="text-[11.5px] font-medium text-danger-500">{errors.category}</span>
            )}
          </fieldset>

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
        </div>

        {/* Barra de acción fija: guardar siempre está a un pulgar de distancia,
            sin tener que llegar al final del formulario. */}
        <div className="flex shrink-0 items-center gap-3 border-t border-gray-900/[0.06] bg-white/90 px-4 py-3.5 backdrop-blur-xl dark:border-white/[0.06] dark:bg-gray-900/90">
          <button
            type="button"
            onClick={() => onNav(...backTarget)}
            className="press h-12 shrink-0 rounded-xl px-4 text-[14.5px] font-semibold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
          >
            {t('add.cancel')}
          </button>
          <div className="flex-1">
            <BtnPrimary type="submit" label={editing ? t('add.saveChanges') : t('add.save')} />
          </div>
        </div>
      </form>
    </div>
  )
}
